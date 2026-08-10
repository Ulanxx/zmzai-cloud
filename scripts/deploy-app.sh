#!/usr/bin/env bash
# 在服务器上部署单个应用：拉最新代码 → 装依赖 → build → PM2 重启。
# 用法（在服务器上跑）：deploy-app.sh <process_name>
# 例：deploy-app.sh muzhi
# 由 runner 用户跑（PM2 进程也是 runner），CI 和手动部署共用。
set -euo pipefail
export CI=true
export PNPM_CONFIRM_MODULES_PURGE=false

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

if [ "$APP" = "agent" ]; then
  AGENT_NODE_BIN="/opt/zmzai/actions-agent/externals/node24/bin"
  AGENT_PNPM_CJS="/home/runner/setup-pnpm/node_modules/.pnpm/pnpm@11.5.0/node_modules/pnpm/bin/pnpm.cjs"
  [ -x "$AGENT_NODE_BIN/node" ] || { echo "Agent Node 24 runtime 不可用"; exit 1; }
  [ -f "$AGENT_PNPM_CJS" ] || { echo "Agent pnpm 11 runtime 不可用"; exit 1; }
  export PATH="$AGENT_NODE_BIN:$PATH"
  export PNPM_STORE_DIR="/home/runner/.pnpm-store"
fi

cd "/opt/zmzai/$REPO_DIR"
echo "=== [$APP] 拉代码 ==="
git fetch origin main
# 清理本地生成文件（pnpm-lock.yaml 等），避免 pull 冲突
git checkout -- . 2>/dev/null || true
git clean -fd pnpm-lock.yaml 2>/dev/null || true
git reset --hard origin/main

echo "=== [$APP] 装依赖 ==="
if [ "$APP" = "agent" ]; then
  "$AGENT_NODE_BIN/node" "$AGENT_PNPM_CJS" install --frozen-lockfile --offline --store-dir="$PNPM_STORE_DIR"
  AGENT_SWC_DIR="node_modules/.pnpm/@next+swc-linux-x64-gnu@15.5.21/node_modules/@next/swc-linux-x64-gnu"
  if [ ! -f "$AGENT_SWC_DIR/next-swc.linux-x64-gnu.node" ]; then
    mkdir -p "$AGENT_SWC_DIR"
    tar -xzf /opt/zmzai/cache/next-swc-linux-x64-gnu-15.5.21.tgz --strip-components=1 -C "$AGENT_SWC_DIR"
  fi
else
  pnpm install --frozen-lockfile 2>&1 | tail -1 || pnpm install 2>&1 | tail -1
fi

echo "=== [$APP] build ==="
if [ "$APP" = "agent" ]; then
  "$AGENT_NODE_BIN/node" "$AGENT_PNPM_CJS" build
else
  pnpm build
fi

echo "=== [$APP] 重启 ==="
if pm2 describe "$APP" >/dev/null 2>&1; then
  if [ "$APP" = "agent" ]; then
    pm2 delete "$APP"
    PORT="$PORT" pm2 start "$AGENT_NODE_BIN/node $PWD/node_modules/next/dist/bin/next start -p $PORT" --name "$APP" --cwd "$PWD"
  else
    pm2 restart "$APP"
  fi
else
  if [ "$APP" = "agent" ]; then
    PORT="$PORT" pm2 start "$AGENT_NODE_BIN/node $PWD/node_modules/next/dist/bin/next start -p $PORT" --name "$APP" --cwd "$PWD"
  else
    PORT="$PORT" pm2 start "pnpm start -p $PORT" --name "$APP" --cwd "/opt/zmzai/$REPO_DIR"
  fi
fi
pm2 save >/dev/null

sleep 4
echo "=== [$APP] 健康检查 http://127.0.0.1:$PORT ==="
curl -s -o /dev/null -w "本地: %{http_code}\n" "http://127.0.0.1:$PORT/" || echo "（首页可能非 200，属正常）"
echo "=== [$APP] 部署完成 → https://$DOMAIN ==="
