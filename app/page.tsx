"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { Logo } from "@zmzai/theme";
import { allProducts, statusLabel, type ProductLine } from "@/lib/projects";
import { useInView } from "@/lib/use-in-view";
import { ProductShowcase } from "@/components/product-showcase";

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL ?? "https://auth.zmzai.cloud";
const WORKSPACE_URL = "https://zmzai.cloud/workspace";

/* ── Scroll progress bar ── */
function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const p = h > 0 ? window.scrollY / h : 0;
      if (ref.current) ref.current.style.transform = `scaleX(${p})`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return <div ref={ref} className="scroll-progress" />;
}

/* ── Animated counter — ticks from 0 to target when visible ── */
function AnimatedNumber({
  target,
  isVisible,
}: {
  target: number;
  isVisible: boolean;
}) {
  const [value, setValue] = useState(0);
  const raf = useRef(0);

  useEffect(() => {
    if (!isVisible) return;
    const start = performance.now();
    const dur = 900;
    const tick = (now: number) => {
      const t = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(eased * target));
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [isVisible, target]);

  return <span className="count-up">{String(value).padStart(2, "0")}</span>;
}

/* ── Status badge — 三种状态不同视觉 ── */
function StatusBadge({ status }: { status: ProductLine["status"] }) {
  if (status === "live") {
    return (
      <div className="flex items-center gap-2">
        <span className="relative flex size-2">
          <span className="status-pulse absolute inset-0 rounded-full bg-success" />
          <span className="relative size-2 rounded-full bg-success" />
        </span>
        <span className="font-mono text-[10px] tracking-widest text-success uppercase">
          {statusLabel(status)}
        </span>
      </div>
    );
  }
  if (status === "building") {
    return (
      <div className="flex items-center gap-2">
        <span className="status-progress w-8 h-1.5 bg-accent/20 text-accent" />
        <span className="font-mono text-[10px] tracking-widest text-accent uppercase">
          {statusLabel(status)}
        </span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2">
      <span className="status-dashed size-3 text-muted" />
      <span className="font-mono text-[10px] tracking-widest text-muted uppercase">
        {statusLabel(status)}
      </span>
    </div>
  );
}

/* ── Reveal section wrapper ── */
function RevealSection({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { ref, isVisible } = useInView();
  return (
    <div
      ref={ref}
      className={`${className} reveal ${isVisible ? "visible" : ""}`}
    >
      {children}
    </div>
  );
}

/* ── Hero v2 — 产品星座网格 ── */
function HeroConstellation() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="relative w-full h-full min-h-[400px] flex items-center justify-center">
      {/* 背景网格 */}
      <div className="absolute inset-0 hero-grid-bg opacity-30" />

      {/* 产品网格 */}
      <div className="relative grid grid-cols-3 gap-3 p-4 max-w-[360px]">
        {allProducts.map((p, i) => (
          <div
            key={p.id}
            className="product-tile border border-line rounded-sm bg-paper/80 backdrop-blur-sm p-3 flex flex-col gap-2 min-w-[100px]"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(20px)",
              transition: `opacity 600ms var(--ease-out-expo) ${i * 100}ms, transform 600ms var(--ease-out-expo) ${i * 100}ms`,
            }}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-muted">
                {p.letter}
              </span>
              <span
                className={`size-1.5 rounded-full ${
                  p.status === "live"
                    ? "bg-success"
                    : p.status === "building"
                      ? "bg-accent"
                      : "bg-muted/40"
                }`}
              />
            </div>
            <div>
              <div className="text-xs font-semibold text-ink leading-tight">
                {p.name}
              </div>
              <div className="text-[10px] text-muted leading-tight mt-0.5 truncate">
                {p.tagline}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── 主页面 ── */
export default function HomePage() {
  return (
    <div className="flex flex-col">
      <ScrollProgress />

      {/* ── Hero — 左文右产品网格 ── */}
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
                Relay、Sandbox、Agent 工作台——各自独立运行，从同一个入口出发。
              </p>
            </div>

            <div className="flex items-center gap-6 pt-4 hero-reveal">
              <a
                href={`${AUTH_URL}/login?next=${encodeURIComponent(WORKSPACE_URL)}`}
                className="btn-primary"
              >
                登录 <span className="arrow-slide">→</span>
              </a>
              <Link
                href="/projects"
                className="font-mono text-sm text-muted transition-colors hover:text-ink"
              >
                全部项目
              </Link>
            </div>
          </div>

          {/* 右侧产品星座 */}
          <div className="hidden lg:flex items-center justify-center relative">
            <HeroConstellation />
          </div>
        </div>
      </section>

      {/* ── 产品大区块 — 每个产品差异化展示 ── */}
      {allProducts.map((p, i) => (
        <ProductSection key={p.id} product={p} index={i} />
      ))}

      {/* ── 底部 CTA ── */}
      <RevealSection className="border-t border-line flex flex-col items-start gap-5 py-20">
        <p className="font-mono text-xs tracking-[0.2em] text-muted uppercase">
          Get Started
        </p>
        <p className="max-w-md text-ink-2">
          登录后可通过统一工作台访问所有产品。API 开发者可直接接入 Relay。
        </p>
        <div className="flex items-center gap-6">
          <a
            href={`${AUTH_URL}/login?next=${encodeURIComponent(WORKSPACE_URL)}`}
            className="btn-primary"
          >
            登录工作台 <span className="arrow-slide">→</span>
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

/* ── 产品区块组件 — 带 showcase + 动画编号 ── */
function ProductSection({
  product: p,
  index: i,
}: {
  product: ProductLine;
  index: number;
}) {
  const { ref, isVisible } = useInView();

  return (
    <div
      ref={ref}
      className={`border-t border-line reveal ${isVisible ? "visible" : ""} ${
        i % 2 === 0 ? "bg-surface" : "bg-paper"
      }`}
    >
      <div className="max-w-5xl py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* 左侧信息 */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="font-mono text-xs tracking-widest text-muted">
                <AnimatedNumber target={i + 1} isVisible={isVisible} />
              </span>
              <StatusBadge status={p.status} />
            </div>

            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              {p.name}
            </h2>
            <p className="text-lg leading-relaxed text-ink-2 mb-3">
              {p.tagline}
            </p>
            <p className="text-sm leading-7 text-ink-2/80 max-w-2xl mb-8">
              {p.description}
            </p>

            <div className="flex items-center gap-6">
              <a href={p.href} className="btn-primary">
                进入产品 <span className="arrow-slide">→</span>
              </a>
              <span className="font-mono text-xs text-muted">
                {p.href.replace(/^https?:\/\//, "")}
              </span>
            </div>
          </div>

          {/* 右侧视觉展示 */}
          <div className="hidden lg:flex items-start justify-end">
            <ProductShowcase productId={p.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
