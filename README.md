# zmzai cloud · 牧之

> 牧之的云 — OPC 项目集合枢纽站。一个人的署名，盖在一打工程上。

这是 `zmzai.cloud` 主站，牧之的 OPC 项目集合入口。它极薄：品牌首页 +
项目索引。每个子项目（如 [`mdldm-knowledge-kit`](https://github.com/muzhi)）
独立部署在 `*.zmzai.cloud`，本站只做品牌门牌和索引。

## 文件说明

| 文件 | 作用 |
|---|---|
| `BRAND.md` | **品牌故事** — 名字三层、品牌主张、视觉骨架、品牌戒律。事实来源。 |
| `design.md` | **锁定设计系统** — Hallmark Study 路径产出，System/Tokens/CTA/Motion/Notes。 |
| `app/globals.css` | `tokens.css` 源 — oklch 颜色 + 衬线/等宽字体 + 4pt 间距 + 指数缓动。 |
| `components/seal.tsx` | 朱文方印 SVG — 品牌唯一签名 motif。 |
| `lib/projects.ts` | OPC 项目清单。新增项目只改这里。 |

## 视觉立场

专门杀 AI vibe。不用的东西：

- ❌ 荧光绿 / 靛蓝 / 紫色渐变 hero
- ❌ Inter / Geist 当唯一正文字体
- ❌ 居中对齐的通用落地页
- ❌ 四张图标方块功能卡
- ❌ 导航栏贴图形 logo 当装饰

用的东西：暖浆纸底、暖墨字、**印泥红** `oklch(0.46 0.150 27)` 强调、
衬线正文 + 等宽 wordmark、朱文方印署名。详见 `BRAND.md` 与 `design.md`。

## 本地运行

```bash
pnpm install
pnpm dev
# http://localhost:3000
```

需 Node 20+。字体走 `next/font/google`（Noto Serif SC + JetBrains Mono），
首次构建联网下载，之后缓存。

## 加一个 OPC 子项目

1. 在 `lib/projects.ts` 加一条，`status` 选 `live`/`building`/`planned`。
2. 子项目仓里按 `design.md` 的 `## Variants` 走同一底盘，可只改
   `--color-accent` 为项目级色。
3. 子域指向：`<slug>.zmzai.cloud`。

## 许可

Apache-2.0。署名：牧之。
