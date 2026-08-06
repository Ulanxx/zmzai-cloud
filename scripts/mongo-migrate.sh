#!/usr/bin/env bash
# MongoDB 迁移脚本：Atlas ↔ 本地互导。
#
# 用法：
#   导出 Atlas → 本地：  bash mongo-migrate.sh export "<ATLAS_URI>"
#   本地 → 新环境：      bash mongo-migrate.sh import "<目标URI>"
#   只备份本地：         bash mongo-migrate.sh dump
#
# 例：
#   bash mongo-migrate.sh export "mongodb+srv://user:pass@cluster0.x.mongodb.net" 
#   bash mongo-migrate.sh import "mongodb://127.0.0.1:27017"
set -euo pipefail

DB="${MONGO_DB:-muzhi_production}"
LOCAL_URI="${LOCAL_URI:-mongodb://127.0.0.1:27017}"
DUMP_DIR="${DUMP_DIR:-/tmp/mongo-migrate-$DB}"
ACTION="${1:?用法: export <atlas_uri> | import <target_uri> | dump}"

case "$ACTION" in
  export)
    SRC="${2:?export 需要 Atlas URI}"
    echo "=== 从 Atlas 导出 $DB ==="
    rm -rf "$DUMP_DIR"
    mongodump --uri="$SRC" --db="$DB" --out="$DUMP_DIR"
    echo "=== 导入本地 $LOCAL_URI ==="
    mongorestore --uri="$LOCAL_URI" --db="$DB" --drop "$DUMP_DIR/$DB"
    echo "=== 完成 ==="
    ;;
  import)
    DST="${2:?import 需要目标 URI}"
    echo "=== 导出本地 $DB ==="
    rm -rf "$DUMP_DIR"
    mongodump --uri="$LOCAL_URI" --db="$DB" --out="$DUMP_DIR"
    echo "=== 导入目标 $DST ==="
    mongorestore --uri="$DST" --db="$DB" --drop "$DUMP_DIR/$DB"
    echo "=== 完成 ==="
    ;;
  dump)
    TS=$(date +%F-%H%M)
    echo "=== 备份本地 $DB 到 /opt/backups/mongo-$TS.tar.gz ==="
    mongodump --uri="$LOCAL_URI" --db="$DB" --out="/tmp/dump-$TS"
    tar czf "/opt/backups/mongo-$TS.tar.gz" -C /tmp "dump-$TS"
    rm -rf "/tmp/dump-$TS"
    echo "=== 完成 ==="
    ;;
  *)
    echo "未知动作: $ACTION"; exit 1 ;;
esac

echo "=== 验证目标库文档数 ==="
TARGET_URI="${2:-$LOCAL_URI}"
mongosh --quiet "$TARGET_URI/$DB" --eval '
  const names = db.getCollectionNames();
  let total = 0;
  names.forEach(c => { const n = db[c].countDocuments(); total += n; if (n>0) print("  " + c + ": " + n); });
  print("总文档数: " + total);
'
