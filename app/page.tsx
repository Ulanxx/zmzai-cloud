import Link from "next/link";

import { Seal } from "@/components/seal";
import { projects, statusLabel } from "@/lib/projects";

export default function HomePage() {
  const live = projects.filter((p) => p.status === "live");

  return (
    <div className="flex flex-col gap-16">
      {/* Hero — asymmetric, left-aligned. No gradient, no centered trio. */}
      <section className="flex flex-col gap-8">
        <p className="eyebrow">牧之 / 署名 · OPC</p>
        <h1 className="headline max-w-3xl text-4xl sm:text-5xl">
          一个人的署名，
          <br />
          盖在一打工程上。
        </h1>
        <p className="max-w-xl text-lg text-ink/80">
          <span className="font-mono text-accent">zmzai.cloud</span>{" "}
          是牧之的云。它不是一个产品，是一个人把经过真实业务验证的工程
          开源出来，用自己的印章盖章。每件工程独立运行，但都姓牧之。
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/projects" className="btn-primary">
            看 OPC 项目 →
          </Link>
          <Link
            href="/about"
            className="font-mono text-sm underline decoration-line underline-offset-4 transition-colors hover:text-accent"
          >
            为什么不是又一个 AI 站
          </Link>
        </div>
      </section>

      {/* Projects preview — numbered list, NOT icon-box cards. */}
      <section className="rule-top flex flex-col gap-8 pt-12">
        <div className="flex items-baseline justify-between">
          <h2 className="headline text-2xl">项目</h2>
          <Link
            href="/projects"
            className="font-mono text-xs text-muted transition-colors hover:text-accent"
          >
            全部 →
          </Link>
        </div>
        <ol className="flex flex-col divide-y divide-line">
          {live.map((p, i) => (
            <li key={p.slug} className="py-6">
              <Link
                href={p.href}
                className="group grid grid-cols-[2rem_1fr] gap-4"
              >
                <span className="font-mono text-xs text-muted pt-1">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex flex-col gap-2">
                  <span className="flex items-baseline gap-3">
                    <span className="headline text-xl group-hover:text-accent transition-colors">
                      {p.name}
                    </span>
                    <span className="font-mono text-[0.625rem] uppercase tracking-widest text-muted">
                      {statusLabel(p.status)}
                    </span>
                  </span>
                  <span className="text-ink/70">{p.tagline}</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {/* Brand stance — the seal as content signature. */}
      <section className="rule-top flex flex-col gap-6 pt-12 sm:flex-row sm:items-start sm:gap-12">
        <Seal size={56} className="shrink-0" />
        <div className="flex flex-col gap-4">
          <h2 className="headline text-2xl">作者在场</h2>
          <p className="max-w-xl text-ink/80">
            市面不缺知识站。缺的是"看得见作者"的那种站。AI 生成站的指纹是
            紫色渐变、Inter 全场、四张图标方块卡、荧光绿强调色——它没有作者，
            它有一个 prompt。这里的反方向是印章与手作纸：衬线正文、等宽署名、
            印泥红强调、朱文方印盖在 footer。
          </p>
          <p className="font-mono text-xs text-muted">
            视觉系统锁定见 design.md · 品牌故事见 BRAND.md
          </p>
        </div>
      </section>
    </div>
  );
}
