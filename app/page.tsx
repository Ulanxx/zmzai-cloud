import Link from "next/link";

import { Logo } from "@zmzai/theme";
import { allProducts, statusLabel, type ProductLine } from "@/lib/projects";

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL ?? "https://auth.zmzai.cloud";
const WORKSPACE_URL = "https://zmzai.cloud/workspace";

const statusDot: Record<ProductLine["status"], string> = {
  live: "bg-success",
  building: "bg-accent",
  planned: "bg-muted",
};

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* ── Hero ── */}
      <section className="flex flex-col gap-10 pb-20 pt-8">
        <div className="flex items-center gap-4">
          <Logo size={48} />
          <span className="font-mono text-xs tracking-widest text-muted uppercase">
            zmai.cloud
          </span>
        </div>

        <div className="flex flex-col gap-5">
          <h1 className="headline text-5xl sm:text-6xl md:text-7xl">
            牧之的云，
            <br />
            AI 产品系统。
          </h1>
          <p className="max-w-lg text-lg leading-relaxed text-ink-2">
            中转驿、沙箱场、Agent 工作台——各自独立运行，从同一个入口出发。
          </p>
        </div>

        <div className="flex items-center gap-4">
          <a
            href={`${AUTH_URL}/login?next=${encodeURIComponent(WORKSPACE_URL)}`}
            className="inline-flex items-center bg-accent px-6 py-2.5 text-sm font-medium text-accent-ink transition-colors hover:bg-accent-strong"
          >
            登录 →
          </a>
          <Link
            href="/projects"
            className="font-mono text-sm text-muted transition-colors hover:text-ink"
          >
            全部项目
          </Link>
        </div>
      </section>

      {/* ── 产品矩阵 ── */}
      <section className="rule-top flex flex-col gap-8 pt-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="headline text-3xl">产品矩阵</h2>
          <span className="font-mono text-xs text-muted">
            {allProducts.filter((p) => p.status === "live").length} 在线 ·{" "}
            {allProducts.filter((p) => p.status === "building").length} 建设中
          </span>
        </div>

        <div className="border-t-2 border-rule">
          {allProducts.map((p) => (
            <Link
              key={p.id}
              href={p.href}
              className="group flex flex-col gap-3 border-b border-line py-6 transition-colors hover:bg-surface sm:flex-row sm:items-center sm:gap-8 sm:py-7"
            >
              {/* 状态 + 产品名 */}
              <div className="flex min-w-0 items-center gap-3 sm:w-56 sm:shrink-0">
                <span
                  className={`size-2 shrink-0 rounded-full ${statusDot[p.status]}`}
                />
                <span className="text-base font-medium tracking-tight transition-colors group-hover:text-accent">
                  {p.name}
                </span>
              </div>

              {/* 描述 */}
              <span className="min-w-0 flex-1 text-sm leading-relaxed text-ink-2">
                {p.tagline}
              </span>

              {/* 域名 + 状态 */}
              <div className="flex shrink-0 items-center gap-3">
                <span className="font-mono text-xs text-muted">
                  {p.href.replace(/^https?:\/\//, "")}
                </span>
                <span className="font-mono text-[10px] tracking-widest text-muted uppercase">
                  {statusLabel(p.status)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 底部 CTA ── */}
      <section className="rule-top mt-14 flex flex-col items-start gap-5 pt-14 pb-8">
        <h2 className="headline text-2xl">开始使用</h2>
        <p className="max-w-md text-ink-2">
          登录后可通过统一工作台访问所有产品。API 开发者可直接接入中转驿。
        </p>
        <div className="flex items-center gap-6">
          <a
            href={`${AUTH_URL}/login?next=${encodeURIComponent(WORKSPACE_URL)}`}
            className="inline-flex items-center bg-accent px-6 py-2.5 text-sm font-medium text-accent-ink transition-colors hover:bg-accent-strong"
          >
            登录工作台 →
          </a>
          <a
            href="https://m.zmzai.cloud/docs"
            className="font-mono text-sm text-muted transition-colors hover:text-ink"
          >
            API 文档
          </a>
        </div>
      </section>
    </div>
  );
}
