#!/usr/bin/env bash
# 释放 relay 因进程中断而遗留的过期余额预留。
set -euo pipefail

ENV_FILE="${RELAY_ENV_FILE:-/opt/zmzai/zmzai-relay/.env.production}"

set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

test -n "${RELAY_INTERNAL_CRON_SECRET:-}"
curl --fail --silent --show-error --max-time 30 \
  -X POST "https://relay.zmzai.cloud/api/internal/reconcile-reservations" \
  -H "Authorization: Bearer $RELAY_INTERNAL_CRON_SECRET" >/dev/null
