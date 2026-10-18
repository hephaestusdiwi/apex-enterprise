#!/usr/bin/env bash
# Pulihkan backup ke sebuah database. Default-nya database SEMENTARA, bukan yang asli.
# Pakai: bash scripts/restore.sh backups/20261010-120000 [nama_db_target]
# Menimpa database asli: CONFIRM=yes bash scripts/restore.sh backups/... portfolio
set -euo pipefail

cd "$(dirname "$0")/.."

SRC="${1:?Pakai: bash scripts/restore.sh <folder-backup> [db-target]}"
SRC="${SRC%/}"
CONTAINER="${PG_CONTAINER:-portfolio_postgres}"
DB_USER="${PG_USER:-portfolio}"
DB_NAME="${PG_DB:-portfolio}"
TARGET="${2:-${DB_NAME}_restore_test}"

[ -f "$SRC/db.dump" ] || { echo "tidak ada $SRC/db.dump" >&2; exit 1; }

if [ "$TARGET" = "$DB_NAME" ] && [ "${CONFIRM:-}" != "yes" ]; then
  echo "Ini akan MENIMPA database asli '$DB_NAME'. Jalankan ulang dengan CONFIRM=yes kalau yakin." >&2
  exit 1
fi

echo "[1/3] buat ulang database $TARGET"
docker exec "$CONTAINER" psql -U "$DB_USER" -d postgres -v ON_ERROR_STOP=1 \
  -c "DROP DATABASE IF EXISTS \"$TARGET\" WITH (FORCE)" \
  -c "CREATE DATABASE \"$TARGET\""

echo "[2/3] restore dump"
docker exec -i "$CONTAINER" pg_restore -U "$DB_USER" -d "$TARGET" --no-owner --exit-on-error < "$SRC/db.dump"

echo "[3/3] isi $TARGET"
docker exec "$CONTAINER" psql -U "$DB_USER" -d "$TARGET" -c \
  "select 'users' as tabel, count(*) from users union all select 'projects', count(*) from projects union all select 'pages', count(*) from pages union all select 'media', count(*) from media union all select 'videos', count(*) from videos"

if [ -f "$SRC/uploads.tar.gz" ]; then
  echo
  echo "File upload ($(tar -tzf "$SRC/uploads.tar.gz" | wc -l) entri) ada di $SRC/uploads.tar.gz."
  echo "Pulihkan dari root project dengan: tar -xzf $SRC/uploads.tar.gz"
fi