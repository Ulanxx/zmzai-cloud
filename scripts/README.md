# zmzai cloud 运维脚本

整套体系的部署、数据库、迁移脚本。所有应用跑在香港服务器（`149.88.84.189`），
MongoDB 在本机（`127.0.0.1:27017`）。

## CI/CD（自动部署）

`.github/workflows/deploy.yml`：push 到 `main` 自动部署到服务器。

**配置（每个仓都要）**：GitHub 仓 → Settings → Secrets and variables → Actions，加：

| Secret | 值 |
|---|---|
| `DEPLOY_HOST` | `149.88.84.189` |
| `DEPLOY_USER` | `root` |
| `DEPLOY_SSH_KEY` | 部署私钥内容（见下） |

然后把这个 workflow 文件复制到各应用仓的 `.github/workflows/deploy.yml`，
改 `APP_NAME` 为该仓的进程名（auth / relay / hub / muzhi / sandbox / agent / workos）。

**部署流程**：push → Actions SSH 到服务器 → `scripts/deploy-app.sh <进程名>`
→ git pull → pnpm install → pnpm build → PM2 重启。

## 手动部署（在服务器上跑）

```bash
bash scripts/deploy-app.sh muzhi      # 部署单个应用
```

进程名与端口/目录/域名的对应在 `scripts/deploy-targets.sh`，改配置只改这一个文件。

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

备份默认到 `/opt/backups/mongo-<时间戳>.tar.gz`。服务器已配 cron 每日 3 点自动备份
（`/opt/backups/backup-mongo.sh`，保留 14 天）。

## 服务器进程 / 端口 / 域名

| 进程 | 端口 | 域名 |
|---|---|---|
| auth | 3001 | auth.zmzai.cloud |
| relay | 3002 | m.zmzai.cloud |
| hub | 3013 | zmzai.cloud |
| muzhi | 3014 | muzhi.zmzai.cloud |
| sandbox | 3010 | z.zmzai.cloud |
| agent | 3011 | a.zmzai.cloud |
| workos | 3012 | i.zmzai.cloud |

Caddy 反代 `:443` → 各端口，自动签 TLS。PM2 管进程，开机自启（`pm2-root` systemd 服务）。
