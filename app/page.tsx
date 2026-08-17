"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Logo } from "@zmzai/theme";
import { allProducts, statusLabel, type ProductLine } from "@/lib/projects";
import { useInView } from "@/lib/use-in-view";

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL ?? "https://auth.zmzai.cloud";
const WORKSPACE_URL = "https://zmzai.cloud/workspace";

const statusDot: Record<ProductLine["status"], string> = {
  live: "bg-success",
  building: "bg-accent",
  planned: "bg-muted",
};

function RevealSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const { ref, isVisible } = useInView();
  return (
    <div ref={ref} className={`${className} reveal ${isVisible ? "visible" : ""}`}>
      {children}
    </div>
  );
}

/** Hero 右侧浮动动画 — 产品卡片漂浮 */
function HeroVisual() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const cards = allProducts.slice(0, 4).map((p, i) => ({
    ...p,
    x: [10, 60, 30, 70][i],
    y: [15, 35, 55, 75][i],
    delay: i * 200,
    rotation: [-3, 2, -2, 3][i],
  }));

  return (
    <div className="relative h-full w-full min-h-[400px]">
      {cards.map((card) => (
        <div
          key={card.id}
          className="absolute transition-all duration-1000 ease-out"
          style={{
            left: `${card.x}%`,
            top: `${card.y}%`,
            transform: mounted
              ? `translate(-50%, -50%) rotate(${card.rotation}deg)`
              : `translate(-50%, -50%) rotate(${card.rotation}deg) scale(0.8)`,
            opacity: mounted ? 1 : 0,
            transitionDelay: `${card.delay}ms`,
          }}
        >
          <div className="card-lift rounded-lg border border-line bg-paper p-4 shadow-lg backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className={`size-2 rounded-full ${statusDot[card.status]}`} />
              <span className="font-mono text-[10px] text-muted uppercase tracking-wider">
                {statusLabel(card.status)}
              </span>
            </div>
            <p className="font-semibold text-sm text-ink">{card.name}</p>
            <p className="text-xs text-muted mt-1 max-w-[120px]">{card.tagline}</p>
          </div>
        </div>
      ))}

      {/* 背景装饰网格 */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(var(--color-rule) 1px, transparent 1px), linear-gradient(90deg, var(--color-rule) 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
      }} />
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* ── Hero — 左文右图 ── */}
      <section className="min-h-screen flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 w-full">
          {/* 左侧文字 */}
          <div className="flex flex-col justify-center gap-8 py-20 lg:py-0">
            <div className="flex items-center gap-3 hero-reveal">
              <Logo size={32} />
              <span className="font-mono text-[11px] tracking-[0.2em] text-muted uppercase">
                zmzai.cloud
              </span>
            </div>

            <div className="flex flex-col gap-6">
              <p className="font-mono text-xs tracking-[0.2em] text-muted uppercase hero-reveal">
                AI Product System
              </p>
              <h1 className="headline text-5xl sm:text-6xl md:text-7xl hero-reveal">
                牧之的云，
                <br />
                <span className="text-muted">AI 产品系统。</span>
              </h1>
              <p className="max-w-lg text-lg leading-relaxed text-ink-2 hero-reveal">
                中转驿、沙箱场、Agent 工作台——各自独立运行，从同一个入口出发。
              </p>
            </div>

            <div className="flex items-center gap-6 pt-4 hero-reveal">
              <a
                href={`${AUTH_URL}/login?next=${encodeURIComponent(WORKSPACE_URL)}`}
                className="btn-primary"
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
          </div>

          {/* 右侧动画 */}
          <div className="hidden lg:flex items-center justify-center relative">
            <HeroVisual />
          </div>
        </div>
      </section>

      {/* ── 产品大区块 ── */}
      {allProducts.map((p, i) => (
        <RevealSection
          key={p.id}
          className={`border-t border-line ${i % 2 === 0 ? "bg-surface" : "bg-paper"}`}
        >
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 py-20 lg:py-28 ${i % 2 === 1 ? "lg:direction-rtl" : ""}`}>
            {/* 文字区 */}
            <div className={`flex flex-col justify-center gap-6 ${i % 2 === 1 ? "lg:direction-ltr" : ""}`}>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs tracking-widest text-muted">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex items-center gap-2">
                  <span className={`size-2 rounded-full ${statusDot[p.status]}`} />
                  <span className="font-mono text-[10px] tracking-widest text-muted uppercase">
                    {statusLabel(p.status)}
                  </span>
                </div>
              </div>

              <h2 className="headline text-4xl sm:text-5xl">{p.name}</h2>
              <p className="text-lg leading-relaxed text-ink-2">{p.tagline}</p>
              <p className="text-sm leading-7 text-ink-2/80 max-w-lg">{p.description}</p>

              <div className="flex items-center gap-6 pt-4">
                <a
                  href={p.href}
                  className="btn-primary"
                >
                  进入产品 →
                </a>
                <span className="font-mono text-xs text-muted">
                  {p.href.replace(/^https?:\/\//, "")}
                </span>
              </div>
            </div>

            {/* 视觉区 — 字母/汉字大展示 */}
            <div className={`flex items-center justify-center ${i % 2 === 1 ? "lg:direction-ltr" : ""}`}>
              <div className="relative">
                <div className="text-[200px] sm:text-[280px] font-bold leading-none text-rule select-none">
                  {p.letter}
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="font-serif text-2xl text-ink/20">{p.hanzi}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </RevealSection>
      ))}

      {/* ── 底部 CTA ── */}
      <RevealSection className="border-t border-line flex flex-col items-start gap-5 py-20">
        <p className="font-mono text-xs tracking-[0.2em] text-muted uppercase">
          Get Started
        </p>
        <p className="max-w-md text-ink-2">
          登录后可通过统一工作台访问所有产品。API 开发者可直接接入中转驿。
        </p>
        <div className="flex items-center gap-6">
          <a
            href={`${AUTH_URL}/login?next=${encodeURIComponent(WORKSPACE_URL)}`}
            className="btn-primary"
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
      </RevealSection>
    </div>
  );
}
