# Design — zmzai.cloud 牧之

Locked design system. Future Hallmark runs read this file first; pages defer
to it. Amend intentionally — the file is the rule.

Locked via Hallmark **Study** for the `zmzai.cloud` hub brand, the umbrella
site hosting 牧之's OPC project collection. Each sub-project shares this
chassis and may declare a project-level accent under `## Variants`.

## System
- Genre — editorial
- Macrostructure — Editorial Index
- Theme — custom (vibe: "印章署名 手作纸")
- Axes — 暖砂纸 / 衬线+等宽 / 印泥红

## Tokens (canonical — `tokens.css` is the source of truth)

```css
:root {
  /* Color — oklch. Warm paper, warm ink, seal-red accent. No acid green,
     no indigo, no neutral zinc. Every value is warm-biased on purpose. */
  --color-paper:         oklch(0.95 0.012 85);  /* #F4EFE6 浆纸底 */
  --color-surface:       oklch(0.97 0.008 85);  /* #FBF8F2 卡片 */
  --color-surface-strong: oklch(0.92 0.014 80); /* 浮强调底 */
  --color-ink:           oklch(0.18 0.011 40); /* #1A1714 暖墨，非纯黑 */
  --color-muted:         oklch(0.47 0.013 55); /* #6B6358 暖灰 */
  --color-line:          oklch(0.86 0.012 80); /* #D9D1C2 细线 */
  --color-rule:          oklch(0.18 0.011 40); /* 硬规线 = ink */
  --color-accent:        oklch(0.46 0.150 27); /* #A8392C 印泥红 */
  --color-accent-strong: oklch(0.39 0.150 27); /* #8A2D22 沉印红 */
  --color-accent-ink:    oklch(0.97 0.008 85); /* 印泥上的字 = paper */
  --color-success:       oklch(0.52 0.090 160);

  /* Fonts. Serif for content (book); mono for wordmark / labels / eyebrows.
     No Geist, no Inter as the single body voice. */
  --font-display: "Noto Serif SC", "Source Han Serif SC", "Songti SC", serif;
  --font-body:    "Noto Serif SC", "Source Han Serif SC", "Songti SC", serif;
  --font-mono:    "JetBrains Mono", ui-monospace, "SFMono-Regular", monospace;

  /* 4-pt spacing scale. Every gap lands on a multiple of 4. */
  --space-1: 0.25rem;  --space-2: 0.5rem;   --space-3: 0.75rem;
  --space-4: 1rem;     --space-6: 1.5rem;   --space-8: 2rem;
  --space-12: 3rem;    --space-16: 4rem;    --space-24: 6rem;

  /* Type scale — 1.25 (major-third) ratio, body 1rem. */
  --text-step-0: 1rem;
  --text-step-1: 1.25rem;
  --text-step-2: 1.563rem;
  --text-step-3: 1.953rem;
  --text-step-4: 2.441rem;
  --text-step-5: 3.052rem;

  /* Motion — exponential ease-out, silent stance. */
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --dur-fast: 150ms;
  --dur-base: 250ms;
  --dur-slow: 500ms;

  /* Radius — sharp editorial, not pill-soft. */
  --radius-card: 2px;
  --radius-pill: 999px;   /* reserved for status chips only */
  --radius-input: 0;
}
```

## CTA voice
- Primary — fill `--color-accent`, ink `--color-accent-ink`, radius 0, padding
  `--space-2 --space-4`. Uppercase mono label, letter-spacing 0.08em. Feels
  like a stamped seal, not a SaaS button.
- Secondary — ghost / underline offset 3px, ink `--color-ink`, no fill.

## Motion stance
- silent — one reveal primitive (rule-line draw on section open), motion-cut
  on the rest.
- Reduced-motion fallback — ≠150ms opacity crossfade; reveal primitive becomes
  an instant show.

## Exports
`tokens.css` (in this project, exported via `app/globals.css` `:root`) is the
source of truth. To extend for Tailwind v4 `@theme`, shadcn/ui CSS variables,
or DTCG `tokens.json`, ask to "extend design.md with Tailwind exports" and
Hallmark will append them per `export-formats.md`.

## Variants
Sub-projects under `zmzai.cloud` inherit everything above and may override
**only** `--color-accent` / `--color-accent-strong` to a project-level hue, so
each OPC project is individually identifiable while staying one family. The
knowledge-kit hub member uses the canonical seal-red above.

## Provenance
Diagnosed from `mdldm-knowledge-kit` (the first OPC project, the knowledge
product delivery station) on 2026-08-05, then promoted to the umbrella brand
system for `zmzai.cloud`. Genre kept (editorial fit a knowledge/reading brand);
axes replaced (see Notes).

## Notes
Anti-patterns carried by the source `mdldm-knowledge-kit` that must NOT carry
over to the hub or any sibling project:
1. Geist (Inter family) used for both heading and body — Hallmark anti-pattern
   #2. Replaced by serif content voice + mono system voice.
2. Acid-green accent `#d8ff3e` — the signature 2024 AI-startup accent. Replaced
   by seal-red `oklch(0.46 0.150 27)`.
3. Text-in-a-square "logo" (the 「牧」 block) — icon-box template. Replaced by
   a `zmzai` mono wordmark + a 朱文方印 SVG seal used only as a signature mark
   in footer / content end / favicon, never as a nav chip.
4. Center-aligned generic landing + no signature motif. Replaced by
   left-aligned Editorial Index macrostructure with a recurring rule-line
   motif (`rule-top`).
5. `color-scheme: light` lock + dead `dark:` utility classes. Replaced by a
   single intentional light surface; dark mode is not part of this brand —
   print has no dark edition, and we say so on purpose.

"Better nothing than bad something" — if a project cannot meet the seal-red +
serif + mono system, it ships plain ink-on-paper with no accent rather than
introducing a second ad-hoc system.
