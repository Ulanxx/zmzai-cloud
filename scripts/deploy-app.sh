#!/usr/bin/env bash
# 在服务器上部署单个应用：拉最新代码 → 装依赖 → build → PM2 重启。
# 用法（在服务器上跑）：deploy-app.sh <process_name>
# 例：deploy-app.sh muzhi
# 由 runner 用户跑（PM2 进程也是 runner），CI 和手动部署共用。
set -euo pipefail
export CI=true

APP="${1:?用法: deploy-app.sh <process_name>（见 deploy-targets.sh）}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$ROOT/deploy-targets.sh"

# 从 deploy-targets.sh 里查这个进程的配置
match=""
for t in "${DEPLOY_TARGETS[@]}"; do
  IFS='|' read -r name dir port domain <<< "$t"
  if [ "$name" = "$APP" ]; then
    match="$t"; REPO_DIR="$dir"; PORT="$port"; DOMAIN="$domain"; break
  fi
done
[ -z "$match" ] && { echo "未知应用: $APP"; exit 1; }

cd "/opt/zmzai/$REPO_DIR"
echo "=== [$APP] 拉代码 ==="
git pull --ff-only

echo "=== [$APP] 装依赖 ==="
pnpm install --frozen-lockfile 2>&1 | tail -1 || pnpm install 2>&1 | tail -1

echo "=== [$APP] build ==="
pnpm build

echo "=== [$APP] 重启 ==="
if pm2 describe "$APP" >/dev/null 2>&1; then
  pm2 restart "$APP"
else
  PORT="$PORT" pm2 start "pnpm start -p $PORT" --name "$APP" --cwd "/opt/zmzai/$REPO_DIR"
fi
pm2 save >/dev/null

sleep 4
echo "=== [$APP] 健康检查 http://127.0.0.1:$PORT ==="
curl -s -o /dev/null -w "本地: %{http_code}\n" "http://127.0.0.1:$PORT/" || echo "（首页可能非 200，属正常）"
echo "=== [$APP] 部署完成 → https://$DOMAIN ==="
