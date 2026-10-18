#!/usr/bin/env bash
# Uji aturan role lewat REST API. Membuat editor + project sementara, menjalankan pemeriksaan,
# lalu menghapus semuanya. Password admin dibaca tanpa ditampilkan.
# Pakai: bash scripts/check-roles.sh   (opsional: BASE=http://localhost:3000)
set -uo pipefail

BASE="${BASE:-http://localhost:3000}"
JSON='Content-Type: application/json'
FAIL=0
ADMIN_TOKEN=""
EDITOR_ID=""
PROJECT_ID=""
CODE=""
BODY=""

read -rp "Email admin: " ADMIN_EMAIL
read -rsp "Password admin: " ADMIN_PASSWORD
echo

num() { grep -o "\"$1\":[0-9]*" | head -1 | cut -d: -f2; }
str() { grep -o "\"$1\":\"[^\"]*\"" | head -1 | cut -d'"' -f4; }
esc() { printf '%s' "$1" | sed 's/\\/\\\\/g; s/"/\\"/g'; }

# req METODE PATH [TOKEN] [BODY JSON] -> isi $CODE dan $BODY
req() {
  local out
  if [ -n "${4:-}" ]; then
    out="$(curl -s -w $'\n%{http_code}' -X "$1" "$BASE$2" ${3:+-H "Authorization: JWT $3"} -H "$JSON" -d "$4")"
  else
    out="$(curl -s -w $'\n%{http_code}' -X "$1" "$BASE$2" ${3:+-H "Authorization: JWT $3"})"
  fi
  CODE="${out##*$'\n'}"
  BODY="${out%$'\n'*}"
}

check() { # label harapan hasil
  if [ "$2" = "$3" ]; then
    echo "PASS  $1 ($3)"
  else
    echo "FAIL  $1 (harus $2, dapat $3)"
    FAIL=1
  fi
}

cleanup() {
  if [ -n "$PROJECT_ID" ]; then req DELETE "/api/projects/$PROJECT_ID" "$ADMIN_TOKEN"; fi
  if [ -n "$EDITOR_ID" ]; then req DELETE "/api/users/$EDITOR_ID" "$ADMIN_TOKEN"; fi
}
trap cleanup EXIT

echo "== login admin"
req POST /api/users/login "" "{\"email\":\"$(esc "$ADMIN_EMAIL")\",\"password\":\"$(esc "$ADMIN_PASSWORD")\"}"
ADMIN_TOKEN="$(printf '%s' "$BODY" | str token)"
if [ -z "$ADMIN_TOKEN" ]; then echo "Login admin gagal (HTTP $CODE): $BODY"; exit 1; fi
req GET /api/users/me "$ADMIN_TOKEN"
ROLE="$(printf '%s' "$BODY" | str role)"
if [ "$ROLE" != "admin" ]; then echo "Akun itu role-nya '$ROLE', bukan admin. Berhenti."; exit 1; fi

echo "== buat editor sementara"
EDITOR_EMAIL="cek-editor-$RANDOM$RANDOM@example.test"
EDITOR_PASSWORD="Cek$RANDOM$RANDOM$RANDOM"
req POST /api/users "$ADMIN_TOKEN" "{\"email\":\"$EDITOR_EMAIL\",\"password\":\"$EDITOR_PASSWORD\",\"role\":\"editor\"}"
EDITOR_ID="$(printf '%s' "$BODY" | num id)"
if [ -z "$EDITOR_ID" ]; then echo "Gagal membuat editor (HTTP $CODE): $BODY"; exit 1; fi
req POST /api/users/login "" "{\"email\":\"$EDITOR_EMAIL\",\"password\":\"$EDITOR_PASSWORD\"}"
EDITOR_TOKEN="$(printf '%s' "$BODY" | str token)"
if [ -z "$EDITOR_TOKEN" ]; then echo "Login editor gagal (HTTP $CODE): $BODY"; exit 1; fi

echo "== sebagai EDITOR"
TITLE="Cek Role Sementara $RANDOM$RANDOM"
req POST "/api/projects?draft=true" "$EDITOR_TOKEN" "{\"title\":\"$TITLE\"}"
check "membuat project draft" 201 "$CODE"
PROJECT_ID="$(printf '%s' "$BODY" | num id)"
if [ -z "$PROJECT_ID" ]; then echo "Tidak bisa lanjut tanpa project uji: $BODY"; exit 1; fi

req PATCH "/api/projects/$PROJECT_ID?draft=true" "$EDITOR_TOKEN" "{\"title\":\"$TITLE (edit)\"}"
check "mengedit project" 200 "$CODE"

req DELETE "/api/projects/$PROJECT_ID" "$EDITOR_TOKEN"
check "menghapus project DITOLAK" 403 "$CODE"
req GET "/api/projects/$PROJECT_ID?draft=true" "$ADMIN_TOKEN"
check "project masih ada setelah percobaan hapus" 200 "$CODE"

req POST /api/users "$EDITOR_TOKEN" "{\"email\":\"cek-tolak-$RANDOM@example.test\",\"password\":\"Cek$RANDOM$RANDOM\",\"role\":\"admin\"}"
check "membuat user DITOLAK" 403 "$CODE"
if [ "$CODE" = "201" ]; then
  STRAY="$(printf '%s' "$BODY" | num id)"
  if [ -n "$STRAY" ]; then req DELETE "/api/users/$STRAY" "$ADMIN_TOKEN"; echo "      (user nyasar id $STRAY sudah dihapus)"; fi
fi

req GET /api/users "$EDITOR_TOKEN"
check "daftar user hanya berisi dirinya" 1 "$(printf '%s' "$BODY" | num totalDocs)"

req POST /api/globals/site-settings "$EDITOR_TOKEN" '{"siteName":"Hack"}'
check "mengubah Site Settings DITOLAK" 403 "$CODE"

req PATCH "/api/users/$EDITOR_ID" "$EDITOR_TOKEN" '{"role":"admin"}'
req GET /api/users/me "$EDITOR_TOKEN"
check "role sendiri tidak bisa dinaikkan" editor "$(printf '%s' "$BODY" | str role)"

echo "== sebagai PENGUNJUNG (tanpa login)"
req GET /api/users ""
check "daftar user DITOLAK" 403 "$CODE"
req POST "/api/projects?draft=true" "" "{\"title\":\"Tidak Boleh\"}"
check "membuat project DITOLAK" 403 "$CODE"
req GET "/api/projects?limit=100" ""
check "draft tidak muncul di daftar publik" 0 "$(printf '%s' "$BODY" | grep -c "$TITLE")"

echo "== sebagai ADMIN"
req DELETE "/api/projects/$PROJECT_ID" "$ADMIN_TOKEN"
check "menghapus project" 200 "$CODE"
if [ "$CODE" = "200" ]; then PROJECT_ID=""; fi

echo
if [ "$FAIL" -eq 0 ]; then
  echo "SEMUA LOLOS. Editor dan project sementara akan dihapus otomatis."
else
  echo "ADA YANG GAGAL. Tempel output di atas. Editor dan project sementara tetap dihapus otomatis."
  exit 1
fi