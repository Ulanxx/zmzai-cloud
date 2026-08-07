#!/usr/bin/env bash
# MongoDB 创建/初始化脚本。
# 在服务器上跑，初始化本地 MongoDB：建库、建集合、建索引、写初始数据。
# 用法：MONGO_URI="mongodb://127.0.0.1:27017" bash mongo-init.sh
set -euo pipefail

MONGO_URI="${MONGO_URI:-mongodb://127.0.0.1:27017}"
DB="${MONGO_DB:-muzhi_production}"

echo "=== 初始化 MongoDB: $MONGO_URI / $DB ==="

mongosh --quiet "$MONGO_URI/$DB" << 'JS'
// 建集合（不存在才建）+ 关键索引。与 muzhi/relay 的 Mongoose 模型对齐。
const cols = [
  "users","sessions","courses","series","coursechapters","coursematerials",
  "courseprogresses","products","orders","orderitems","paymentevents",
  "entitlements","invitations","invitationredemptions","identitytokens",
  "mediaassets","operationfailures","ratelimitbuckets","channels","apikeys","usages",
  "modelprices","balanceaccounts","balanceledgers","balancereservations","channelattempts","adminaudits","relayratelimitbuckets","walletorders","paymentreconciliations",
];
for (const c of cols) {
  if (!db.getCollectionNames().includes(c)) db.createCollection(c);
}

// users
db.users.createIndex({ email: 1 }, { unique: true });
// sessions
db.sessions.createIndex({ tokenHash: 1 }, { unique: true });
db.sessions.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
// channels
db.channels.createIndex({ priority: 1 });
// apikeys
db.apikeys.createIndex({ keyHash: 1 }, { unique: true });
// usages：从旧的 userId/requestId 幂等键迁移到调用者维度。
for (const index of db.usages.getIndexes()) {
  if (index.name === "userId_1_requestId_1") db.usages.dropIndex(index.name);
}
db.usages.createIndex({ callerKind: 1, callerId: 1, requestId: 1 }, { unique: true });
db.usages.createIndex({ createdAt: -1 });
db.modelprices.createIndex({ model: 1 }, { unique: true });
db.balanceaccounts.createIndex({ userId: 1 }, { unique: true });
db.balanceledgers.createIndex({ userId: 1, createdAt: -1 });
db.balancereservations.createIndex({ usageId: 1 }, { unique: true });
db.balancereservations.createIndex({ status: 1, expiresAt: 1 });
db.channelattempts.createIndex({ usageId: 1, createdAt: 1 });
db.walletorders.createIndex({ orderNo: 1 }, { unique: true });
db.walletorders.createIndex({ userId: 1, createdAt: -1 });
db.walletorders.createIndex({ status: 1, createdAt: -1 });
db.paymentreconciliations.createIndex({ orderId: 1 }, { unique: true });
db.relayratelimitbuckets.createIndex({ keyId: 1, windowStart: 1 }, { unique: true });
db.relayratelimitbuckets.createIndex({ windowStart: 1 }, { expireAfterSeconds: 7200 });
// series / courses
db.series.createIndex({ status: 1, createdAt: -1 });
db.courses.createIndex({ seriesId: 1, position: 1 });

print("集合数: " + db.getCollectionNames().length);
print("users: " + db.users.countDocuments());
JS

echo "=== 完成 ==="
echo "库 $DB 已初始化。首个 admin 用户请用 muzhi 的 create-admin 脚本创建："
echo "  cd /opt/zmzai/muzhi && pnpm create-admin -- --name Admin --email you@x.com --password <强密码>"
