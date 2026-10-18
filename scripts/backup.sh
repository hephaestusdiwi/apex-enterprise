#!/usr/bin/env bash
# Backup lokal: dump Postgres (container Docker) + arsip folder upload (media/, videos/).
# Pakai: bash scripts/backup.sh   (opsional: KEEP=30 PG_CONTAINER=nama BACKUP_DIR=/path)
set -euo pipefail

cd "$(dirname "$0")/.."

CONTAINER="${PG_CONTAINER:-portfolio_postgres}"
DB_USER="${PG_USER:-portfolio}"
DB_NAME="${PG_DB:-portfolio}"
OUT_ROOT="${BACKUP_DIR:-backups}"
KEEP="${KEEP:-14}"

stamp="$(date +%Y%m%d-%H%M%S)"
dest="$OUT_ROOT/$stamp"
mkdir -p "$dest"

# Kalau ada langkah yang gagal, buang backup yang setengah jadi.
trap 'rc=$?; if [ "$rc" -ne 0 ]; then rm -rf "$dest"; echo "GAGAL: backup parsial dihapus" >&2; fi' EXIT

echo "[1/4] dump database $DB_NAME dari container $CONTAINER"
docker exec "$CONTAINER" pg_dump -U "$DB_USER" -d "$DB_NAME" --format=custom --no-owner > "$dest/db.dump"

echo "[2/4] verifikasi dump bisa dibaca"
docker exec -i "$CONTAINER" pg_restore --list < "$dest/db.dump" > /dev/null

echo "[3/4] arsip folder upload"
dirs=()
for d in media videos; do
  if [ -d "$d" ]; then dirs+=("$d"); fi
done
if [ "${#dirs[@]}" -gt 0 ]; then
  tar -czf "$dest/uploads.tar.gz" "${dirs[@]}"
else
  echo "    (tidak ada folder media/videos, dilewati)"
fi

echo "[4/4] hapus backup lama (simpan $KEEP terbaru)"
ls -1d "$OUT_ROOT"/*/ | sort -r | tail -n +"$((KEEP + 1))" | xargs -r rm -rf

echo "selesai: $dest"
du -sh "$dest"/*