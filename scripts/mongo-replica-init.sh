#!/usr/bin/env bash
# 将本机 MongoDB 初始化为单节点副本集，供 relay 的余额事务使用。
# 在服务器执行一次：bash /opt/zmzai/scripts/mongo-replica-init.sh
set -euo pipefail

MONGO_URI="${MONGO_URI:-mongodb://127.0.0.1:27017}"
REPLICA_SET="${MONGO_REPLICA_SET:-rs0}"

mongosh --quiet "$MONGO_URI/admin" --eval "
  try {
    const status = rs.status();
    if (status.set !== '$REPLICA_SET') throw new Error('副本集名称不匹配：' + status.set);
    print('副本集已就绪：' + status.set);
  } catch (error) {
    const message = String(error);
    if (!message.includes('not yet initialized') && !message.includes('no replset config has been received')) throw error;
    rs.initiate({ _id: '$REPLICA_SET', members: [{ _id: 0, host: '127.0.0.1:27017' }] });
    print('已初始化副本集：$REPLICA_SET');
  }
"
