import Link from "next/link";

import { Seal } from "@/components/seal";
import { letterProducts, rootProduct, statusLabel } from "@/lib/projects";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-20">
      {/* Hero — zmzai 逐字母矩阵：我的名字就是产品矩阵 */}
      <section className="flex flex-col gap-10">
        <p className="eyebrow">牧之的云 · OPC 产品矩阵</p>

        {/* 五个字母排开，每个字母一条产品线，盖一枚刻汉字的朱文印 */}
        <h1 className="font-mono font-bold uppercase leading-none tracking-tight">
          <span className="sr-only">zmzai cloud</span>
          <span
            aria-hidden="true"
            className="flex flex-wrap items-end gap-x-6 gap-y-4 text-[clamp(3.5rem,10vw,7rem)]"
          >
            {letterProducts.map((p, i) => (
              <span key={`${p.letter}-${i}`} className="flex items-end gap-x-3">
                <Link
                  href={p.href}
                  className="focus-ring group flex items-end gap-x-3 text-ink"
                  title={`${p.name} — ${p.tagline}`}
                >
                  <span className="transition-colors group-hover:text-accent">
                    {p.letter}
                  </span>
                  {/* 盖好：每个字母产品线盖一枚刻汉字的朱文印 */}
                  <span className="grid size-[0.72em] shrink-0 place-items-center rounded-[2px] bg-accent-strong font-serif text-[0.34em] font-bold leading-none text-accent-ink transition-colors group-hover:bg-accent">
                    {p.hanzi}
                  </span>
                </Link>
              </span>
            ))}
            <span className="text-muted self-end pb-[0.18em] font-normal text-[0.5em]">
              .cloud
            </span>
          </span>
        </h1>

        <p className="max-w-2xl text-lg leading-9 text-ink/80">
          <span className="font-mono text-accent">zmzai</span> 是牧之的 AI 产品矩阵——
          五个字母是「牧之」拼音的拆解，每个字母挂一条 OPC 产品线。
          这不是一个产品，是一个人把 AI 时代想做的工程，一件件搭在自己的云里。
        </p>
      </section>

      {/* 字母产品线索引 — 非对称编号清单，非图标方块卡 */}
      <section className="rule-top flex flex-col gap-10 pt-14">
        <h2 className="headline text-3xl">产品线</h2>
        <ol className="flex flex-col divide-y divide-line">
          {letterProducts.map((p) => (
            <li key={p.letter}>
              <Link
                href={p.href}
                className="group grid grid-cols-[4.5rem_1fr] items-baseline gap-6 py-7 sm:grid-cols-[6rem_1fr]"
              >
                {/* 字母标识 + 汉字印章感 */}
                <span className="flex items-baseline gap-3">
                  <span className="font-mono text-3xl font-bold uppercase text-ink transition-colors group-hover:text-accent sm:text-4xl">
                    {p.letter}
                  </span>
                  <span className="font-serif text-lg text-muted">{p.hanzi}</span>
                </span>
                <span className="flex flex-col gap-1.5">
                  <span className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <span className="headline text-xl transition-colors group-hover:text-accent sm:text-2xl">
                      {p.name}
                    </span>
                    <span className="font-mono text-[0.625rem] uppercase tracking-widest text-muted">
                      {statusLabel(p.status)}
                    </span>
                    <span className="font-mono text-xs text-muted">
                      {p.href.replace(/^https?:\/\//, "")}
                    </span>
                  </span>
                  <span className="text-ink/70">{p.tagline}</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {/* 本体：muzhi 知识体系 — 第一个落地成员，单独突出 */}
      <section className="rule-top flex flex-col gap-8 pt-14 sm:flex-row sm:items-start sm:gap-14">
        <Seal size={64} className="shrink-0" />
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <p className="eyebrow">第一个落地成员 · 本体</p>
            <h2 className="headline text-3xl">{rootProduct.name}</h2>
          </div>
          <p className="max-w-xl text-lg leading-9 text-ink/80">
            {rootProduct.description}
          </p>
          <div className="flex flex-wrap items-center gap-5">
            <Link href={rootProduct.href} className="btn-primary">
              进入 muzhi.zmzai.cloud →
            </Link>
            <Link
              href="/projects"
              className="font-mono text-sm underline decoration-line underline-offset-4 transition-colors hover:text-accent"
            >
              全部项目 →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
