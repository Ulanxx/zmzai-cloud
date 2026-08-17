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
      <section className="flex min-h-[70vh] flex-col justify-center gap-8 pb-20 pt-12">
        <div className="flex items-center gap-3">
          <Logo size={36} />
          <span className="font-mono text-xs tracking-widest text-muted uppercase">
            zmzai.cloud
          </span>
        </div>

        <h1 className="text-5xl font-bold leading-[1.1] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
          牧之的云，
          <br />
          <span className="text-muted">AI 产品系统。</span>
        </h1>

        <p className="max-w-lg text-lg leading-relaxed text-ink-2">
          中转驿、沙箱场、Agent 工作台——各自独立运行，从同一个入口出发。
        </p>

        <div className="flex items-center gap-6">
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
      <section className="border-t border-line-strong pt-16 pb-8">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-2xl font-bold tracking-tight">产品</h2>
          <span className="font-mono text-xs text-muted">
            {allProducts.filter((p) => p.status === "live").length} 在线 ·{" "}
            {allProducts.filter((p) => p.status === "building").length} 建设中
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {allProducts.map((p) => (
            <Link
              key={p.id}
              href={p.href}
              className="group flex flex-col gap-3 border border-line bg-surface p-5 transition-all hover:border-line-strong hover:bg-surface-strong"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`size-2 shrink-0 rounded-full ${statusDot[p.status]}`}
                  />
                  <span className="text-base font-semibold tracking-tight transition-colors group-hover:text-accent">
                    {p.name}
                  </span>
                </div>
                <span className="font-mono text-[10px] tracking-widest text-muted uppercase">
                  {statusLabel(p.status)}
                </span>
              </div>

              <p className="flex-1 text-sm leading-relaxed text-ink-2">
                {p.tagline}
              </p>

              <span className="font-mono text-xs text-muted">
                {p.href.replace(/^https?:\/\//, "")}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 底部 CTA ── */}
      <section className="border-t border-line mt-16 flex flex-col items-start gap-4 pt-14 pb-8">
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
