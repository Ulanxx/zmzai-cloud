# Design v2 — zmzai cloud

新设计语言规范。替代 v1「印章署名 手作纸」。确认后全量替换 7 个站的
`globals.css` token + `design.md`。

## 理念

**Monochrome Impact.** 黑白两色撑起整个体系。大字、负间距、强对比、克制的
交互光效。不靠颜色做层级——靠**字号、字重、留白**做层级。

v1 的暖纸衬线是一套完整的"纸墨"语言，但它太安静了。工具类产品（Agent /
Sandbox / Relay）需要冲击力和交互感，内容类产品（muzhi / cloud）也需要
更现代的面孔。v2 用一套系统覆盖两类需求。

### Axes（三根轴）
1. **纯白底 + 纯黑字** — 不用暖纸、不用渐变底。`#FFF` + `#000`。
2. **Geist 无衬线** — 大字用 Geist（Vercel 自家字体），中文 fallback 用
   Inter + 系统无衬线。告别宋体。
3. **负间距大字 + 强交互** — 标题 64-96px、letter-spacing -0.03~-0.04em；
   hover 有光效/位移/边框流，但不过度。

### 与 Aceternity 的关系
参考了 Aceternity AI SaaS 模板的排版 DNA（96px H1 / weight 600 / Geist /
负间距 / pill 按钮 / 边框光效），但不是照搬：
- Aceternity 是 marketing template；zmzai 是工具 + 内容混合体
- zmzai 需要 dark code blocks（Agent 的代码预览/审计）—— v2 保留局部 dark
  surface，但全局是 light
- zmzai 不用 Aceternity 的 aurora/meteors 装饰——工具产品要干净，不要花哨

---

## Tokens

```css
:root {
  /* ===== Color =====
     黑白为骨。灰阶只用 neutral（不暖不冷）。
     强调色每个站自定义（见 Variants），默认纯黑。 */
  --color-bg:            #FFFFFF;  /* 全局底 */
  --color-surface:       #FAFAFA;  /* 卡片/面板 */
  --color-surface-2:     #F5F5F5;  /* hover/嵌套 */
  --color-ink:           #000000;  /* 正文/标题，纯黑 */
  --color-ink-2:         #525252;  /* 次级文字 neutral-600 */
  --color-ink-3:         #A3A3A3;  /* 辅助文字 neutral-400 */
  --color-line:          #E5E5E5;  /* 边框 neutral-200 */
  --color-line-strong:   #171717;  /* 硬线/强调边框 = ink */
  --color-accent:        #000000;  /* 默认强调 = 纯黑。各站 Variants 覆盖 */
  --color-accent-ink:    #FFFFFF;  /* 强调色上的字 */

  /* Dark surface — 仅用于代码块/审计/preview，不是全局 dark mode */
  --color-dark-bg:       #0A0A0A;
  --color-dark-surface:  #171717;
  --color-dark-ink:      #FAFAFA;
  --color-dark-line:     #27272A;

  /* 语义色 — 极少使用，只在状态指示 */
  --color-success:       #16A34A;  /* green-600 */
  --color-warning:       #CA8A04;  /* yellow-600 */
  --color-danger:        #DC2626;  /* red-600 */

  /* ===== Fonts =====
     Geist 是主字体（headings + body）。
     Geist Mono 用于代码/标签/eyebrow。
     中文 fallback：Inter → system-ui → PingFang SC → Microsoft YaHei。 */
  --font-sans: "Geist", "Inter", -apple-system, "PingFang SC",
               "Microsoft YaHei", system-ui, sans-serif;
  --font-mono: "Geist Mono", "JetBrains Mono", ui-monospace,
               "SFMono-Regular", monospace;
  /* serif 退役——v2 不使用衬线。保留变量以防第三方组件引用 */
  --font-serif: var(--font-sans);

  /* ===== Spacing =====
     4pt 基准。和 v1 相同，不破坏已有间距。 */
  --space-1:  0.25rem;   /* 4px */
  --space-2:  0.5rem;    /* 8px */
  --space-3:  0.75rem;   /* 12px */
  --space-4:  1rem;      /* 16px */
  --space-5:  1.25rem;   /* 20px */
  --space-6:  1.5rem;    /* 24px */
  --space-8:  2rem;      /* 32px */
  --space-10: 2.5rem;    /* 40px */
  --space-12: 3rem;      /* 48px */
  --space-16: 4rem;      /* 64px */
  --space-20: 5rem;      /* 80px */
  --space-24: 6rem;      /* 96px */

  /* ===== Type scale =====
     Aceternity 级大字。比例不再用固定 ratio——
     heading 用手动值（因为大字需要精确控制），
     body 用 1.25 major-third。 */
  --text-xs:    0.75rem;   /* 12px — mono label */
  --text-sm:    0.875rem;  /* 14px — secondary text */
  --text-base:  1rem;      /* 16px — body */
  --text-lg:    1.125rem;  /* 18px — emphasis body */
  --text-xl:    1.25rem;   /* 20px — lead paragraph */
  --text-2xl:   1.5rem;    /* 24px — H3 */
  --text-3xl:   2rem;      /* 32px — H2 small */
  --text-4xl:   2.5rem;    /* 40px — section title */
  --text-5xl:   3.5rem;    /* 56px — page title */
  --text-6xl:   5rem;      /* 80px — hero */
  --text-7xl:   6rem;      /* 96px — hero max（中文不用） */

  /* Letter spacing — 大字必须负间距 */
  --tracking-tight:  -0.04em;  /* hero / display */
  --tracking-snug:    -0.03em;  /* section title */
  --tracking-normal:  -0.01em;  /* body / heading */
  --tracking-wide:     0;       /* mono label */
  --tracking-wider:    0.04em;  /* uppercase eyebrow */

  /* ===== Radius =====
     v1 是 0px（直角）。v2 用柔和圆角。
     card 用中等圆角；pill 保留给 chip/badge/button。 */
  --radius-sm:    8px;
  --radius-card:  12px;
  --radius-lg:    16px;
  --radius-xl:    20px;
  --radius-pill:  9999px;

  /* ===== Shadow =====
     v1 无阴影（纸的隐喻）。v2 用克制的阴影做层次。
     输入框可用 neobrutalism 硬阴影（偏移色块）。 */
  --shadow-xs:  0 1px 2px rgba(0,0,0,0.04);
  --shadow-sm:  0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.03);
  --shadow-md:  0 4px 16px rgba(0,0,0,0.08);
  --shadow-lg:  0 12px 40px rgba(0,0,0,0.10);
  --shadow-xl:  0 20px 60px rgba(0,0,0,0.12);
  /* neobrutalism — 硬偏移阴影，用于输入框/CTA */
  --shadow-brutal:    6px 6px 0 var(--color-ink);
  --shadow-brutal-lg: 10px 10px 0 var(--color-ink);

  /* ===== Motion =====
     v1 是 silent（几乎不动）。v2 允许有存在感的交互动效。
     ease 用 exponential ease-out（和 v1 相同），新增 spring 用于 hover。 */
  --ease-out:     cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out:  cubic-bezier(0.65, 0, 0.35, 1);
  --ease-spring:  cubic-bezier(0.34, 1.56, 0.64, 1);
  --dur-fast:   150ms;
  --dur-base:   250ms;
  --dur-slow:   400ms;
  --dur-slower: 700ms;  /* 入场 reveal */
}
```

### Tailwind v4 映射

```css
@theme {
  --color-bg:           #FFFFFF;
  --color-surface:      #FAFAFA;
  --color-surface-2:    #F5F5F5;
  --color-ink:          #000000;
  --color-ink-2:        #525252;
  --color-ink-3:        #A3A3A3;
  --color-line:         #E5E5E5;
  --color-line-strong:  #171717;
  --color-accent:       #000000;
  --color-accent-ink:   #FFFFFF;
  --color-dark-bg:      #0A0A0A;
  --color-dark-surface: #171717;
  --color-dark-ink:     #FAFAFA;
  --color-success:      #16A34A;
  --color-warning:      #CA8A04;
  --color-danger:       #DC2626;

  --font-sans: "Geist", "Inter", -apple-system, "PingFang SC",
               "Microsoft YaHei", system-ui, sans-serif;
  --font-mono: "Geist Mono", "JetBrains Mono", ui-monospace,
               "SFMono-Regular", monospace;

  --radius-card:  12px;
  --radius-lg:    16px;
  --radius-xl:    20px;
  --radius-pill:  9999px;

  --ease-out:    cubic-bezier(0.16, 1, 0.3, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

---

## 排版阶梯（Typography）

| Token | Size | Weight | Letter-spacing | Line-height | 用途 |
|-------|------|--------|----------------|-------------|------|
| `hero` | 80px (5rem) | 600 | -0.04em | 0.98 | 落地页主标题（中文 48-56px） |
| `title` | 56px (3.5rem) | 600 | -0.03em | 1.05 | 页面主标题 |
| `section` | 40px (2.5rem) | 600 | -0.03em | 1.1 | 区块标题 |
| `h2` | 32px (2rem) | 600 | -0.02em | 1.15 | 二级标题 |
| `h3` | 24px (1.5rem) | 600 | -0.01em | 1.25 | 三级标题 |
| `lead` | 20px (1.25rem) | 400 | -0.01em | 1.5 | 引导段落 |
| `body` | 16px (1rem) | 400 | -0.01em | 1.65 | 正文 |
| `body-lg` | 18px (1.125rem) | 500 | -0.01em | 1.6 | 强调正文 |
| `label` | 14px (0.875rem) | 500 | 0 | 1.5 | UI 标签 |
| `caption` | 12px (0.75rem) | 500 | 0 | 1.5 | 说明文字 |
| `eyebrow` | 12px (0.75rem) | 600 | 0.04em | 1.5 | uppercase 前缀标签 |
| `mono-label` | 12px (0.75rem) | 500 | 0 | 1.5 | mono 字体的小标签 |

**规则：**
- 中文标题永远比英文小 15-20%（中文字符密度高，同字号视觉更大）
- 标题 weight 不超过 700（600 是默认，够重但不笨）
- 正文 line-height 1.65（中文需要更多行间距）
- `text-wrap: balance` 加在所有标题上
- `font-variant-numeric: tabular-nums` 加在数字密集处（数据/时间/金额）

---

## 组件规范（Components）

### Button

三种变体。全部 `border-radius: var(--radius-pill)`（全圆角胶囊）。

**Primary（黑色填充）**
```
background: var(--color-ink)
color: var(--color-accent-ink)  /* 白字 */
padding: 12px 28px
font: 600 15px var(--font-sans)
border-radius: var(--radius-pill)
transition: transform 150ms, box-shadow 250ms
hover: transform scale(1.03); box-shadow: 0 8px 30px rgba(0,0,0,0.15)
active: transform scale(0.98)
disabled: background var(--color-line); color var(--color-ink-3)
```

**Secondary（白底黑边）**
```
background: transparent
color: var(--color-ink)
border: 1px solid var(--color-line)
padding: 12px 28px
hover: border-color var(--color-ink); background var(--color-surface)
```

**Ghost（无边框）**
```
background: transparent
color: var(--color-ink-2)
padding: 8px 16px
hover: background var(--color-surface-2); color var(--color-ink)
```

### Input / Textarea

```
background: var(--color-bg)
border: 2px solid var(--color-ink)          /* 粗黑边 */
border-radius: var(--radius-lg)
padding: 16px 20px
font: 400 16px var(--font-sans)
box-shadow: var(--shadow-brutal)            /* neobrutalism 硬偏移 */
focus: box-shadow var(--shadow-brutal-lg); transform translate(-2px,-2px)
placeholder color: var(--color-ink-3)
```

工具类密集页面（Agent workbench / Audit）可降级为轻边框：
```
border: 1px solid var(--color-line)
border-radius: var(--radius-sm)
box-shadow: none
focus: border-color var(--color-ink)
```

### Card

两种层级。

**Surface card（普通卡片）**
```
background: var(--color-bg)
border: 1px solid var(--color-line)
border-radius: var(--radius-card)
padding: 24px
hover: border-color var(--color-ink); box-shadow var(--shadow-md); transform translateY(-2px)
```

**Interactive card（可点击 bento）**
```
同上 + hover 径向光跟随鼠标：
  background-image: radial-gradient(300px circle at var(--cx) var(--cy),
    rgba(0,0,0,0.04), transparent 40%)
  opacity 0 → 1 on hover
```

### Navigation

```
height: 64px
background: rgba(255,255,255,0.8) + backdrop-filter blur(16px)
border-bottom: 1px solid var(--color-line)
position: sticky; top: 0; z-index: 50

nav link:
  padding: 8px 18px
  border-radius: var(--radius-pill)
  font: 500 14px
  color: var(--color-ink-2)
  hover: background var(--color-surface-2); color var(--color-ink)
  active: background var(--color-ink); color #fff
```

### Badge / Chip

```
padding: 6px 16px
border-radius: var(--radius-pill)
font: 500 13px

variant "solid": background var(--color-ink); color #fff
variant "outline": border 1px solid var(--color-line); color var(--color-ink-2)
variant "status": 同 outline + 左侧 6px pulse dot
```

### Code block（dark surface）

全局唯一的 dark surface 场景。
```
background: var(--color-dark-bg)
color: var(--color-dark-ink)
border-radius: var(--radius-card)
padding: 20px
font: 400 14px var(--font-mono); line-height 1.65
```

### List item（hover bar）

用于最近任务/审计列表。
```
padding: 20px 24px
border-top: 1px solid var(--color-line)
hover: 左侧滑出 3px 黑条 (width 0→3px transition)
hover: padding-left 增加（文字右移让位给黑条）
```

---

## 动效原则（Motion）

v1 是 silent（几乎不动）。v2 允许有存在感的交互，但**克制**。

### 允许的动效
| 场景 | 动效 | 时长 |
|------|------|------|
| 入场 | 标题逐字/逐行 reveal（translateY + opacity） | 700ms ease-out |
| hover 按钮 | scale 1.03 + shadow 扩散 | 150ms |
| hover 卡片 | translateY(-4px) + shadow + 径向光 | 200ms |
| hover 列表行 | 左侧黑条滑出 + 文字位移 | 200ms |
| 输入框 focus | brutal shadow 偏移增大 + 位移 | 300ms |
| 鼠标跟随 | 全页淡灰径向光（opacity 极低 0.03） | 实时 |

### 禁止的动效
- ❌ 自动轮播
- ❌ 页面滚动时背景视差
- ❌ 超过 1s 的入场动画
- ❌ Aurora/meteors/flowing gradients 装饰动画（内容产品不需要）
- ❌ `transition: all`（必须列具体属性）
- ❌ 动画 width/height/top/left（只能 transform + opacity）

### Reduced motion
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 变体（Variants）— 7 站差异化

每站在同一系统内，**只改 `--color-accent`** 做区分。其余 token 全部统一。

| 站 | 域名 | accent | 说明 |
|----|------|--------|------|
| cloud（hub） | zmzai.cloud | `#000000` 纯黑 | 母站，用默认纯黑 |
| muzhi | muzhi.zmzai.cloud | `#000000` 纯黑 | 知识产品，同母站 |
| relay | m.zmzai.cloud | `#2563EB` blue-600 | API 网关，蓝色暗示技术/连接 |
| auth | auth.zmzai.cloud | `#000000` 纯黑 | SSO，中性安全 |
| agent | a.zmzai.cloud | `#000000` 纯黑 | Agent 工作台 |
| sandbox | z.zmzai.cloud | `#7C3AED` violet-600 | 代码沙箱，紫色暗示创造/实验 |
| workos | i.zmzai.cloud | `#059669` emerald-600 | 个人工作台，绿色暗示生产力 |

**规则：**
- accent 只影响 primary button 填充色、active 导航高亮、focus ring、链接 hover 色
- accent 不改变底色、正文字色、卡片边框
- 如果某站不需要彩色，用纯黑 `#000000`（默认）—— 和母站完全一致
- accent 的可访问性：accent 上的文字用 `--color-accent-ink`（白）

---

## Logo & Brand Mark

v1 用「朱文方印 SVG seal」+ `zmzai` mono wordmark。
v2 替换为：

**Logo mark：** 30×30px 黑色圆角方块（`border-radius: 8px`），内含白色
SVG 图标（三层堆叠线条 = layers/编排 语义）。

**Wordmark：** `ZMZAI`，`font-weight: 600`，`letter-spacing: -0.02em`，
`font-size: 16px`，用 `--font-sans`（不再用 mono）。

**不再使用：**
- ❌ 朱文方印 seal（退役，v1 的纸墨隐喻不再适用）
- ❌ 「牧」「使」等单字方块 logo
- ❌ `zmzai` mono wordmark（改 sans）

---

## 反模式（Anti-patterns）

1. **❌ 衬线字体** — Noto Serif SC / Songti SC 退役。全局无衬线。
2. **❌ 暖色底** — paper `oklch(0.95 0.012 85)` 退役。全局纯白。
3. **❌ 零圆角** — v1 的 `border-radius: 0` 退役。最小 8px。
4. **❌ 印泥红** — `oklch(0.46 0.150 27)` 退役。强调色由 Variants 定义。
5. **❌ Emoji 图标** — 全部用 SVG 线性图标（stroke-width 2，`currentColor`）。
6. **❌ 单字方块 logo** — 见 Logo & Brand Mark。
7. **❌ 全局暗色模式** — dark surface 只用于代码块/preview。
8. **❌ 渐变背景** — 不用 linear/radial gradient 做装饰背景（径向 hover 光除外）。
9. **❌ Aurora/meteors/flowing blobs** — 装饰动画，工具产品不需要。
10. **❌ `transition: all`** — 必须列具体 CSS 属性。
11. **❌ 正文小于 16px** — 最小 body 1rem。
12. **❌ 标题正间距** — 标题必须负 letter-spacing。

---

## 迁移清单

确认本规范后，逐站迁移：

### Token 替换（机械替换）
- [ ] 每站 `app/globals.css` 的 `@theme` 块替换为 v2 tokens
- [ ] `design.md` 替换为 `design-v2.md`（或直接覆盖）
- [ ] muzhi 的旧命名 `--page`/`--ink` → 新命名 `--color-bg`/`--color-ink`

### 组件替换
- [ ] `components/seal.tsx` → `components/logo.tsx`（新 SVG mark）
- [ ] `components/wordmark.tsx` → 更新为 sans wordmark
- [ ] `.btn-primary` class → v2 button 规范
- [ ] `.eyebrow` / `.headline` / `.rule-top` → v2 排版规范
- [ ] 所有 hardcoded `var(--color-paper)` → `var(--color-bg)`
- [ ] 所有 hardcoded `var(--color-accent)` 保留（语义不变，值变了）
- [ ] 所有 `var(--font-serif)` → `var(--font-sans)`

### 字体加载
- [ ] 每站 `app/layout.tsx` 加载 Geist（`geist` npm 包 或 Google Fonts）
- [ ] 移除 Noto Serif SC / Source Han Serif 加载

### 验证
- [ ] 7 站逐个截图对比
- [ ] 暗色 code block 区域确认不受影响
- [ ] 中文排版行距/字重验证
- [ ] mobile responsive 验证

---

## Provenance

- v1「印章署名 手作纸」于 2026-08-05 由 Hallmark Study 锁定，源
  mdldm-knowledge-kit
- v2「Monochrome Impact」于 2026-08-13 由用户决策，参考 Aceternity AI SaaS
  template 排版 DNA（96px H1 / Geist / 负间距 / pill 按钮 / 边框光效）
- v1 退役但 design.md 保留为 `design-v1-archived.md` 供溯源
