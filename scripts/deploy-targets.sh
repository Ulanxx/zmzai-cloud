# zmzai cloud 部署脚本
#
# 各应用的部署配置：进程名、目录、端口。
# CI/CD 和手动部署脚本共用这一份，改端口/目录只改这里。

# 格式：process_name|repo_dir|port|domain
DEPLOY_TARGETS=(
  "auth|zmzai-auth|3001|auth.zmzai.cloud"
  "relay|zmzai-relay|3002|relay.zmzai.cloud"
  "hub|zmzai-cloud|3013|zmzai.cloud"
  "muzhi|muzhi|3014|muzhi.zmzai.cloud"
  "sandbox|zmzai-sandbox|3010|sandbox.zmzai.cloud"
  "agent|zmzai-agent|3011|agent.zmzai.cloud"
  "workos|zmzai-workos|3012|workos.zmzai.cloud"
  "arena|zmzai-arena|3000|arena.zmzai.cloud"
  "data|zmzai-data|3004|data.zmzai.cloud"
  "memory|zmzai-memory|3015|memory.zmzai.cloud"
  "billing|zmzai-billing|3005|billing.zmzai.cloud"
  "status|zmzai-status|3006|status.zmzai.cloud"
)
