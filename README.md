# zmzai.cloud · 知末智云

`zmzai.cloud` 是 ZMZ AI 的产品矩阵主站。

它是一个薄主站：负责品牌入口、项目索引、登录入口和工作区入口。真正的业务能力分布在各个子域服务里，例如 Muzhi、Relay、Sandbox、Agent 和 WorkOS。

## 职责

- 作为 ZMZ AI 的统一入口；
- 展示当前可用产品和规划中的产品线；
- 进入共享登录态后的工作区页面；
- 承载 ZMZ AI 的视觉系统、命名体系和产品索引。

## 不负责

- 不承接模型调用，模型调用在 [`zmzai-relay`](https://github.com/zmzai-cloud/zmzai-relay)；
- 不执行代码，受限执行在 [`zmzai-sandbox`](https://github.com/zmzai-cloud/zmzai-sandbox)；
- 不做 Agent 编排，任务运行在 [`zmzai-agent`](https://github.com/zmzai-cloud/zmzai-agent)；
- 不注册账号，账号入口由知末智云和 [`zmzai-auth`](https://github.com/zmzai-cloud/zmzai-auth) 承接。

## 目录

| 路径 | 说明 |
| --- | --- |
| `app/page.tsx` | 主站首页 |
| `app/projects/page.tsx` | 产品矩阵 |
| `app/workspace/` | 登录后的工作区入口 |
| `lib/projects.ts` | 产品线数据源，新增子项目从这里开始 |
| `providers/auth/session.ts` | 共享登录态读取 |
| `@zmzai/theme` | Logo 云朵标 / Wordmark / favicon 等品牌资产 |
| `components/wordmark.tsx` | `zmzai.cloud` wordmark |
| `BRAND.md` | 品牌故事、命名和视觉约束 |
| `design.md` | 设计系统说明 |
| `scripts/` | 部署、备份、Mongo 初始化和对账脚本 |

## 本地运行

```bash
pnpm install
pnpm dev
```

常用检查：

```bash
pnpm typecheck
pnpm lint
```

## 环境变量

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `APP_URL` | `http://localhost:3013` | 当前主站地址 |
| `MONGODB_URI` | 无 | 共享账号和 session 数据库 |
| `AUTH_SECRET` | 无 | 必须与知末智云账号体系一致 |
| `SESSION_COOKIE_NAME` | `muzhi_session` | 登录态 cookie 名称 |
| `SESSION_COOKIE_DOMAIN` | 空 | 多子域共享登录时使用 |

## 加一个子项目

1. 在 `lib/projects.ts` 增加项目，`status` 选 `live`、`building` 或 `planned`；
2. 子项目沿用 `BRAND.md` 和 `design.md` 的命名、纸面风和方印系统；
3. 子域使用 `<slug>.zmzai.cloud`，主站只做入口和索引。

Apache-2.0 · 知末智云
