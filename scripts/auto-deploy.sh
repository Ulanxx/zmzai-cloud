#!/usr/bin/env bash
# 每 5 分钟检查各仓是否有新 commit，有才 build+restart。
set -euo pipefail
export CI=true
export PNPM_CONFIRM_MODULES_PURGE=false
LOG=/home/runner/zmzai-deploy.log
echo "[$(date)] 检查更新" >> $LOG
source /opt/zmzai/scripts/deploy-targets.sh
for t in "${DEPLOY_TARGETS[@]}"; do
  IFS="|" read -r name dir port domain <<< "$t"
  cd /opt/zmzai/$dir 2>/dev/null || continue
  BEFORE=$(git rev-parse HEAD 2>/dev/null)
  git fetch origin main 2>/dev/null
  AFTER=$(git rev-parse origin/main 2>/dev/null)
  if [ "$BEFORE" != "$AFTER" ] && [ -n "$AFTER" ]; then
    echo "[$(date)] $name 有更新，部署" >> $LOG
    bash /opt/zmzai/scripts/deploy-app.sh $name >> $LOG 2>&1 || echo "[$(date)] $name 部署失败" >> $LOG
  fi
done
