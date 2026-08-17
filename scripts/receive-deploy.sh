#!/usr/bin/env bash
# =============================================================================
# receive-deploy.sh — 香港服务器部署接收器（部署优化方案 A）
#
# 由 GitHub Actions 通过受限 SSH 密钥调用（/root/.ssh/authorized_keys 里
# command= 指向本脚本），也支持 root 手动调用。
#
# 子命令：
#   store  <app> <sha>  从 stdin 接收产物 tar.gz 存入 /opt/zmzai/incoming/
#   deploy <app> <sha>  解压 → 环境变量 → 依赖(按需重装) → 原子软链切换 →
#                       pm2 重启 → 健康检查（失败自动回滚上一版/旧目录）
#   envget <app>        输出该应用生产环境变量（供 GitHub runner 构建时使用）
#   status <app>        打印当前 release 与 pm2 状态
#
# 与旧 deploy-app.sh 的分工：旧脚本在服务器上拉码+全量构建（慢，废弃）；
# 本脚本只做"接收产物 + 秒级切换"，构建发生在 GitHub 托管 runner 上。
# =============================================================================
set -euo pipefail

ROOT="/opt/zmzai"
SCRIPTS="$ROOT/scripts"
INCOMING="$ROOT/incoming"
RELEASES="$ROOT/releases"
APPS="$ROOT/apps"
ENVS="$ROOT/envs"
LOCK="$ROOT/receive-deploy.lock"
KEEP=3                                   # 每个应用保留的 release 份数
RUNNER_HOME="/home/runner"
RUNNER_PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"

# agent 专用运行时（与旧 deploy-app.sh 保持一致）
AGENT_NODE_BIN="/opt/zmzai/actions-agent/externals/node24/bin"
AGENT_PNPM_CJS="/home/runner/setup-pnpm/node_modules/.pnpm/pnpm@11.5.0/node_modules/pnpm/bin/pnpm.cjs"
AGENT_STORE="/home/runner/.pnpm-store"
AGENT_SWC_TGZ="/opt/zmzai/cache/next-swc-linux-x64-gnu-15.5.21.tgz"
AGENT_SWC_DIR="node_modules/.pnpm/@next+swc-linux-x64-gnu@15.5.21/node_modules/@next/swc-linux-x64-gnu"

log()  { echo "[$(date '+%F %T')] $*"; }
fatal(){ log "ERROR: $*"; exit 1; }

# 以 runner 用户执行（pm2 / pnpm 进程都归 runner 所有）
run_runner() {
  su -s /bin/bash runner -c "export HOME='$RUNNER_HOME' PATH='$RUNNER_PATH'; $1"
}

# 从 deploy-targets.sh 查应用配置，输出 "dir|port|domain"
lookup() {
  source "$SCRIPTS/deploy-targets.sh"
  for t in "${DEPLOY_TARGETS[@]}"; do
    IFS='|' read -r name dir port domain <<< "$t"
    [ "$name" = "$1" ] && { printf '%s|%s|%s\n' "$dir" "$port" "$domain"; return 0; }
  done
  return 1
}

# 重启 pm2 进程指向指定目录（delete+start，保证 cwd 生效）。
# 直接调 node 跑 next，不走 pnpm 包装层（曾出现 pnpm 包装进程挂起而 next 子进程消失）。
pm2_start_release() { # $1=app $2=port $3=release_dir
  local app="$1" port="$2" dir="$3"
  if [ "$app" = "agent" ]; then
    run_runner "pm2 delete $app >/dev/null 2>&1 || true; PORT=$port pm2 start '$AGENT_NODE_BIN/node $dir/node_modules/next/dist/bin/next start -p $port' --name $app --cwd '$dir' >/dev/null 2>&1 && pm2 save >/dev/null"
  else
    run_runner "pm2 delete $app >/dev/null 2>&1 || true; PORT=$port pm2 start 'node $dir/node_modules/next/dist/bin/next start -p $port' --name $app --cwd '$dir' >/dev/null 2>&1 && pm2 save >/dev/null"
  fi
}

# 健康检查：任何 HTTP 响应（含 4xx/5xx）都算存活，只有连不上才算失败。
# 冷启动在 2 核小机上可能 15~30s，放宽到 8 次尝试（约 1 分钟内）。
health_check() { # $1=port
  local port="$1" i code
  for i in 1 2 3 4 5 6 7 8; do
    code="$(curl -s -o /dev/null -w '%{http_code}' --max-time 4 "http://127.0.0.1:$port/" 2>/dev/null || true)"
    [ -n "$code" ] && [ "$code" != "000" ] && return 0
    sleep 3
  done
  return 1
}

# 清理：只保留最近 KEEP 份 release
cleanup_releases() { # $1=app
  local app="$1" dir="$RELEASES/$app" old
  ls -1dt "$dir"/[0-9a-f]*/ 2>/dev/null | tail -n "+$((KEEP+1))" | while read -r old; do
    [ -z "$old" ] && continue
    rm -rf "$old" && log "清理旧 release: $old"
  done
}

# ---------------------------------------------------------------------------
# 受限 SSH 调用时，客户端命令在 $SSH_ORIGINAL_COMMAND 里
if [ -n "${SSH_ORIGINAL_COMMAND:-}" ]; then
  # shellcheck disable=SC2086
  set -- $SSH_ORIGINAL_COMMAND
fi

cmd="${1:-}"; app="${2:-}"; sha="${3:-}"
[ -z "$cmd" ] && { echo "用法: receive-deploy.sh <store|deploy|envget|status> <app> [sha]"; exit 2; }
cfg="$(lookup "$app" 2>/dev/null || true)"
[ -z "$cfg" ] && fatal "未知应用: $app（检查 $SCRIPTS/deploy-targets.sh）"
IFS='|' read -r repo_dir port domain <<< "$cfg"
app_dir="$RELEASES/$app"

case "$cmd" in
  store)
    [ -z "$sha" ] && fatal "store 需要 <app> <sha>"
    mkdir -p "$INCOMING"
    tarball="$INCOMING/$app-$sha.tar.gz"
    cat > "$tarball.tmp"
    mv "$tarball.tmp" "$tarball"
    log "已接收 $app@$sha（$(stat -c%s "$tarball") bytes）"
    ;;

  envget)
    env_file="$ENVS/$app/.env.production"
    if [ -f "$env_file" ]; then
      cat "$env_file"
    fi
    ;;

  status)
    cur="$(readlink -f "$app_dir/current" 2>/dev/null || echo none)"
    echo "app=$app current=$cur"
    echo "releases:"
    ls -1dt "$app_dir"/[0-9a-f]*/ 2>/dev/null || echo "  (无)"
    echo "pm2:"
    run_runner "pm2 describe $app" 2>/dev/null | grep -E "status|restarts|uptime|exec cwd" | sed 's/^/  /' || echo "  (无 pm2 进程)"
    ;;

  deploy)
    [ -z "$sha" ] && fatal "deploy 需要 <app> <sha>"
    tarball="$INCOMING/$app-$sha.tar.gz"
    [ -f "$tarball" ] || fatal "缺少产物包: $tarball"

    exec 9>"$LOCK"
    flock -w 600 9 || fatal "等待其他部署超时（>10 分钟），退出"
    log "=== 开始部署 $app@$sha → https://$domain（:${port}）==="

    ts="$(date +%s)"
    rel_dir="$app_dir/$sha-$ts"
    prev="$(readlink -f "$app_dir/current" 2>/dev/null || true)"
    mkdir -p "$app_dir" "$APPS/$app" "$ENVS/$app"
    # 以 runner 身份执行安装/运行，目录必须归 runner 可写
    chown -R runner:runner "$APPS/$app" "$app_dir" "$ENVS/$app"

    # 1. 解压产物
    rm -rf "$rel_dir" && mkdir -p "$rel_dir"
    tar -xzf "$tarball" -C "$rel_dir"
    [ -d "$rel_dir/.next" ] || fatal "包内缺少 .next（$rel_dir）"
    chown -R runner:runner "$rel_dir"

    # 2. 环境变量：软链到 /opt/zmzai/envs 的权威副本（workos 无 env 文件则跳过）
    for envf in "$ENVS/$app"/.env*; do
      if [ -e "$envf" ]; then
        ln -sfn "$envf" "$rel_dir/$(basename "$envf")"
      fi
    done

    # 3. 依赖：lockfile 哈希变化（或首次）才重装，否则复用 apps/<app>/node_modules
    lock_hash="$(sha256sum "$rel_dir/pnpm-lock.yaml" 2>/dev/null | cut -d' ' -f1 || echo none)"
    prev_hash="$(cat "$APPS/$app/.lock-hash" 2>/dev/null || echo none)"
    if [ ! -d "$APPS/$app/node_modules" ] || [ "$lock_hash" != "$prev_hash" ]; then
      log "依赖安装（lock=$lock_hash）..."
      cp "$rel_dir/package.json" "$rel_dir/pnpm-lock.yaml" "$APPS/$app/" 2>/dev/null || true
      [ -f "$rel_dir/pnpm-workspace.yaml" ] && cp "$rel_dir/pnpm-workspace.yaml" "$APPS/$app/"
      [ -f "$rel_dir/.npmrc" ] && cp "$rel_dir/.npmrc" "$APPS/$app/"
      if [ "$app" = "agent" ]; then
        run_runner "cd '$APPS/$app' && '$AGENT_NODE_BIN/node' '$AGENT_PNPM_CJS' install --frozen-lockfile --offline --store-dir='$AGENT_STORE'" || fatal "agent 依赖安装失败"
        if [ ! -f "$APPS/$app/$AGENT_SWC_DIR/next-swc.linux-x64-gnu.node" ]; then
          mkdir -p "$APPS/$app/$AGENT_SWC_DIR"
          tar -xzf "$AGENT_SWC_TGZ" --strip-components=1 -C "$APPS/$app/$AGENT_SWC_DIR"
        fi
      else
        run_runner "cd '$APPS/$app' && pnpm install --frozen-lockfile" || fatal "依赖安装失败"
      fi
      echo "$lock_hash" > "$APPS/$app/.lock-hash"
    else
      log "依赖未变化，复用 node_modules"
    fi
    [ -d "$APPS/$app/node_modules" ] || fatal "node_modules 缺失"
    ln -sfn "$APPS/$app/node_modules" "$rel_dir/node_modules"

    # 4. 原子切换 current → 新 release
    ln -sfn "$rel_dir" "$app_dir/.current.tmp"
    mv -Tf "$app_dir/.current.tmp" "$app_dir/current"
    log "current → $rel_dir"

    # 5. pm2 重启 + 健康检查（失败回滚）
    pm2_start_release "$app" "$port" "$rel_dir"
    if health_check "$port"; then
      log "健康检查通过（http://127.0.0.1:$port/）"
      rm -f "$tarball"
      cleanup_releases "$app"
      log "=== 部署完成 $app@$sha → https://$domain ==="
    else
      log "健康检查失败，回滚..."
      if [ -n "$prev" ] && [ -d "$prev/.next" ]; then
        ln -sfn "$prev" "$app_dir/current"
        pm2_start_release "$app" "$port" "$prev"
        log "已回滚到上一 release: $prev"
      elif [ -f "/opt/zmzai/$repo_dir/node_modules/.bin/next" ] && [ -d "/opt/zmzai/$repo_dir/.next" ]; then
        pm2_start_release "$app" "$port" "/opt/zmzai/$repo_dir"
        log "已回滚到旧部署目录: /opt/zmzai/$repo_dir"
      else
        log "无可用回滚目标，应用可能不可用！"
      fi
      exit 1
    fi
    ;;

  *)
    echo "未知子命令: $cmd"
    exit 2
    ;;
esac
