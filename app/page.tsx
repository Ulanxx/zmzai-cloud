"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useCallback } from "react";

import { Logo } from "@zmzai/theme";
import { allProducts, statusLabel, type ProductLine } from "@/lib/projects";
import { ProductShowcase } from "@/components/product-showcase";

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL ?? "https://auth.zmzai.cloud";
const WORKSPACE_URL = "https://zmzai.cloud/workspace";

/* ── Slide 数据 ── */
type Slide =
  | { type: "hero" }
  | { type: "product"; product: ProductLine; index: number }
  | { type: "cta" };

const slides: Slide[] = [
  { type: "hero" },
  ...allProducts.map((p, i) => ({ type: "product" as const, product: p, index: i })),
  { type: "cta" },
];

/* ── Status badge ── */
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

/* ── 主页面 ── */
export default function HomePage() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const isTransitioning = useRef(false);

  const goTo = useCallback(
    (index: number, dir: "next" | "prev") => {
      if (isTransitioning.current) return;
      if (index < 0 || index >= slides.length) return;
      isTransitioning.current = true;
      setDirection(dir);
      setCurrent(index);
      setTimeout(() => {
        isTransitioning.current = false;
      }, 650);
    },
    []
  );

  const goNext = useCallback(() => goTo(current + 1, "next"), [current, goTo]);
  const goPrev = useCallback(() => goTo(current - 1, "prev"), [current, goTo]);

  /* 键盘 */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault();
        goNext();
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        goPrev();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev]);

  /* 滚轮 */
  useEffect(() => {
    let lastWheel = 0;
    const onWheel = (e: WheelEvent) => {
      const now = Date.now();
      if (now - lastWheel < 800) return;
      lastWheel = now;
      if (e.deltaY > 30) goNext();
      else if (e.deltaY < -30) goPrev();
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, [goNext, goPrev]);

  return (
    <div className="slide-container">
      {/* ── 左右箭头 ── */}
      <button
        className="slide-arrow slide-arrow-left"
        onClick={goPrev}
        disabled={current === 0}
        aria-label="上一页"
      >
        ←
      </button>
      <button
        className="slide-arrow slide-arrow-right"
        onClick={goNext}
        disabled={current === slides.length - 1}
        aria-label="下一页"
      >
        →
      </button>

      {/* ─ 底部导航点 ── */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`slide-dot ${i === current ? "active" : ""}`}
            onClick={() => goTo(i, i > current ? "next" : "prev")}
            aria-label={`第 ${i + 1} 页`}
          />
        ))}
      </div>

      {/* ── 页码 ── */}
      <div className="fixed bottom-8 right-8 z-40 font-mono text-[10px] text-muted tracking-widest">
        {String(current + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
      </div>

      {/* ── Slides ── */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`slide ${
            i === current
              ? "active"
              : i < current
                ? "exit-left"
                : ""
          }`}
        >
          {slide.type === "hero" && <HeroSlide />}
          {slide.type === "product" && (
            <ProductSlide product={slide.product} index={slide.index} />
          )}
          {slide.type === "cta" && <CtaSlide />}
        </div>
      ))}
    </div>
  );
}

/* ── Hero Slide ── */
function HeroSlide() {
  return (
    <div className="w-full max-w-5xl mx-auto px-6 lg:px-0 flex flex-col justify-center gap-8">
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
        <h1 className="headline text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
          牧之的云，
          <br />
          <span className="text-muted">AI 产品系统。</span>
        </h1>
        <p className="max-w-lg text-lg leading-relaxed text-ink-2">
          Relay、Sandbox、Agent 工作台——各自独立运行，从同一个入口出发。
        </p>
      </div>

      <div className="flex items-center gap-6 pt-4">
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
  );
}

/* ── Product Slide ── */
function ProductSlide({
  product: p,
  index: i,
}: {
  product: ProductLine;
  index: number;
}) {
  return (
    <div className="w-full max-w-5xl mx-auto px-6 lg:px-0">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-center">
        {/* 左侧信息 — 3/5 */}
        <div className="lg:col-span-3">
          <div className="flex items-center gap-3 mb-8">
            <span className="font-mono text-xs tracking-widest text-muted">
              {String(i + 1).padStart(2, "0")}
            </span>
            <StatusBadge status={p.status} />
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-5">
            {p.name}
          </h2>
          <p className="text-lg sm:text-xl leading-relaxed text-ink-2 mb-4 font-medium">
            {p.tagline}
          </p>
          <p className="text-sm leading-7 text-ink-2/80 max-w-xl mb-10">
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

        {/* 右侧展示 — 2/5 */}
        <div className="lg:col-span-2 flex items-center justify-center">
          <div className="w-full max-w-md">
            <ProductShowcase productId={p.id} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── CTA Slide ── */
function CtaSlide() {
  return (
    <div className="w-full max-w-3xl mx-auto px-6 lg:px-0 flex flex-col items-start gap-6">
      <p className="font-mono text-xs tracking-[0.2em] text-muted uppercase">
        Get Started
      </p>
      <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
        开始使用
      </h2>
      <p className="text-lg text-ink-2 max-w-md">
        登录后可通过统一工作台访问所有产品。API 开发者可直接接入 Relay。
      </p>
      <div className="flex items-center gap-6 pt-4">
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
    </div>
  );
}
