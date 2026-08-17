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
      <section className="flex min-h-[80vh] flex-col justify-center gap-8 pb-24 pt-16">
        <div className="flex items-center gap-3">
          <Logo size={32} />
          <span className="font-mono text-[11px] tracking-[0.2em] text-muted uppercase">
            zmzai.cloud
          </span>
        </div>

        <div className="flex flex-col gap-6">
          <p className="font-mono text-xs tracking-[0.2em] text-muted uppercase">
            AI Product System
          </p>
          <h1 className="text-6xl font-bold leading-[1.05] tracking-tight sm:text-7xl md:text-8xl lg:text-9xl">
            牧之的云，
            <br />
            <span className="text-muted">AI 产品系统。</span>
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-ink-2">
            中转驿、沙箱场、Agent 工作台——各自独立运行，从同一个入口出发。
          </p>
        </div>

        <div className="flex items-center gap-6 pt-4">
          <a
            href={`${AUTH_URL}/login?next=${encodeURIComponent(WORKSPACE_URL)}`}
            className="inline-flex items-center bg-accent px-7 py-3 text-sm font-medium text-accent-ink transition-colors hover:bg-accent-strong"
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

      {/* ── 产品矩阵 — 编号网格 ── */}
      <section className="border-t border-line pt-20 pb-16">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <p className="font-mono text-xs tracking-[0.2em] text-muted uppercase">
              Products
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">产品矩阵</h2>
          </div>
          <span className="font-mono text-xs text-muted">
            {allProducts.filter((p) => p.status === "live").length} 在线 ·{" "}
            {allProducts.filter((p) => p.status === "building").length} 建设中
          </span>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {allProducts.map((p, i) => (
            <Link
              key={p.id}
              href={p.href}
              className="group flex flex-col gap-5 border border-line bg-surface p-7 transition-all hover:border-accent/40 hover:bg-surface-strong"
            >
              {/* 编号 + 状态 */}
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs tracking-widest text-muted">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className={`size-1.5 rounded-full ${statusDot[p.status]}`}
                  />
                  <span className="font-mono text-[10px] tracking-widest text-muted uppercase">
                    {statusLabel(p.status)}
                  </span>
                </div>
              </div>

              {/* 产品名 */}
              <h3 className="text-xl font-bold tracking-tight transition-colors group-hover:text-accent sm:text-2xl">
                {p.name}
              </h3>

              {/* 描述 */}
              <p className="flex-1 text-sm leading-relaxed text-ink-2">
                {p.tagline}
              </p>

              {/* 域名 + 箭头 */}
              <div className="flex items-center justify-between border-t border-line pt-4">
                <span className="font-mono text-xs text-muted">
                  {p.href.replace(/^https?:\/\//, "")}
                </span>
                <span className="text-sm text-muted transition-colors group-hover:text-accent">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 底部 CTA ── */}
      <section className="border-t border-line mt-8 flex flex-col items-start gap-5 pt-16 pb-12">
        <p className="font-mono text-xs tracking-[0.2em] text-muted uppercase">
          Get Started
        </p>
        <p className="max-w-md text-ink-2">
          登录后可通过统一工作台访问所有产品。API 开发者可直接接入中转驿。
        </p>
        <div className="flex items-center gap-6">
          <a
            href={`${AUTH_URL}/login?next=${encodeURIComponent(WORKSPACE_URL)}`}
            className="inline-flex items-center bg-accent px-7 py-3 text-sm font-medium text-accent-ink transition-colors hover:bg-accent-strong"
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
