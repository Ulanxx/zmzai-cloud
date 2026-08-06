#!/bin/bash
TS=$(date +%F-%H%M)
mongodump --uri="mongodb://127.0.0.1:27017" --db=muzhi_production --out=/opt/backups/mongo-$TS >/dev/null 2>&1
tar czf /opt/backups/mongo-$TS.tar.gz -C /opt/backups mongo-$TS && rm -rf /opt/backups/mongo-$TS
# 只保留最近 14 天
find /opt/backups -name "mongo-*.tar.gz" -mtime +14 -delete
