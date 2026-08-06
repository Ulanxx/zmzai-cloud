# zmzai cloud 运维脚本

整套体系的部署、数据库、迁移、备份脚本。所有应用跑在香港服务器，
MongoDB 在本机（`127.0.0.1:27017`），CI/CD 用服务器 cron 定时拉取。

## CI/CD（自动部署）：服务器定时拉取

服务器 cron 每 5 分钟检查各仓是否有新 commit，有才 build+restart：

```
*/5 * * * * su - runner -c "bash /opt/zmzai/scripts/auto-deploy.sh"
```

**工作流**：push 到任意仓 main → 5 分钟内服务器自动拉取部署。
日志：`/home/runner/zmzai-deploy.log`。

为什么不用 GitHub Actions runner：GitHub Actions runner 在美国，
跨境 SSH 连香港服务器 22 端口不稳定；个人账号不支持 user-level runner
（仓库级 runner 只服务注册的仓）。服务器定时拉取最简单可靠。

## 手动部署

```bash
# 单个应用（在服务器上）
bash /opt/zmzai/scripts/deploy-app.sh muzhi

# 手动检查所有仓（触发一次 auto-deploy）
su - runner -c "bash /opt/zmzai/scripts/auto-deploy.sh"
```

## MongoDB 创建脚本

初始化本地 MongoDB（建库、集合、索引）：

```bash
MONGO_URI="mongodb://127.0.0.1:27017" bash scripts/mongo-init.sh
```

建首个 admin 用户：

```bash
cd /opt/zmzai/muzhi
pnpm create-admin -- --name Admin --email you@x.com --password <强密码>
```

## MongoDB 迁移脚本

```bash
# Atlas → 本地
bash scripts/mongo-migrate.sh export "mongodb+srv://user:pass@cluster0.x.mongodb.net"

# 本地 → 新环境
bash scripts/mongo-migrate.sh import "mongodb://目标:27017"

# 只备份本地
bash scripts/mongo-migrate.sh dump
```

## 备份

- **自动**：cron 每日 3 点跑 `scripts/backup-mongo.sh`，备份到 `/opt/backups/`，保留 14 天
- **手动**：`bash scripts/mongo-migrate.sh dump`

## 服务器进程 / 端口 / 域名

| 进程 | 端口 | 域名 | 仓 |
|---|---|---|---|
| auth | 3001 | auth.zmzai.cloud | zmzai-auth |
| relay | 3002 | m.zmzai.cloud | zmzai-relay |
| hub | 3013 | zmzai.cloud | zmzai-cloud |
| muzhi | 3014 | muzhi.zmzai.cloud | muzhi |
| sandbox | 3010 | z.zmzai.cloud | zmzai-sandbox |
| agent | 3011 | a.zmzai.cloud | zmzai-agent |
| workos | 3012 | i.zmzai.cloud | zmzai-workos |

Caddy 反代 `:443` → 各端口，自动签 TLS。PM2 管进程（runner 用户），
开机自启（`pm2-runner` systemd 服务）。MongoDB 只监听 127.0.0.1。

## 服务器迁移到新机器的步骤

1. 新机器装 Node 20 + PM2 + pnpm + Caddy + MongoDB + git
2. `git clone` 各仓到 `/opt/zmzai/`
3. 复制 scripts 到 `/opt/zmzai/scripts/` + `/opt/backups/backup-mongo.sh`
4. 各仓 `pnpm install && pnpm build`
5. 配 `.env.production`（MONGODB_URI 改 `mongodb://127.0.0.1:27017/muzhi_production`，其它 env 从旧服务器拷贝）
6. `mongorestore` 导入数据（用 `mongo-migrate.sh import`）
7. PM2 起全部进程 + `pm2 startup` + `pm2 save`
8. Caddy 配 7 子域反代 + `systemctl reload caddy`
9. DNS 各子域 A 记录改到新 IP
10. 配 cron（auto-deploy + backup）
