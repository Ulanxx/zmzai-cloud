"use client";

import Link from "next/link";
import { useState } from "react";

import { Logo } from "@zmzai/theme";
import { allProducts, statusLabel, type ProductLine } from "@/lib/projects";
import { ProductShowcase } from "@/components/product-showcase";

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL ?? "https://auth.zmzai.cloud";
const WORKSPACE_URL = "https://zmzai.cloud/workspace";

/* ── Status badge ── */
function StatusBadge({ status }: { status: ProductLine["status"] }) {
  if (status === "live") {
    return (
      <span className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-widest uppercase text-success">
        <span className="relative flex size-1.5">
          <span className="status-pulse absolute inset-0 rounded-full bg-success" />
          <span className="relative size-1.5 rounded-full bg-success" />
        </span>
        {statusLabel(status)}
      </span>
    );
  }
  if (status === "building") {
    return (
      <span className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-widest uppercase text-accent">
        <span className="status-progress w-6 h-1 bg-accent/20 text-accent" />
        {statusLabel(status)}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-widest uppercase text-muted">
      <span className="status-dashed size-2.5" />
      {statusLabel(status)}
    </span>
  );
}

/* ─ FAQ item ── */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-item ${open ? "open" : ""}`}>
      <button className="faq-question" onClick={() => setOpen(!open)}>
        {q}
        <span className="faq-icon">+</span>
      </button>
      <div className="faq-answer">
        <p className="text-sm leading-relaxed text-ink-2">{a}</p>
      </div>
    </div>
  );
}

/* ─ Workflow steps data ── */
const workflowSteps = [
  {
    num: "01",
    title: "统一入口",
    desc: "一个账号，访问所有 AI 产品。Relay 提供模型接口，Sandbox 提供执行环境，Agent 编排任务流。",
  },
  {
    num: "02",
    title: "模型路由",
    desc: "Relay 统一接入 OpenAI、Anthropic、DeepSeek 等模型，自动故障转移和智能路由。",
  },
  {
    num: "03",
    title: "安全执行",
    desc: "Sandbox 为每个 Agent 任务提供隔离容器，限制资源、网络和超时，确保代码安全运行。",
  },
  {
    num: "04",
    title: "知识沉淀",
    desc: "Muzhi 博客记录技术实践，WorkOS 工作台整合写作、检索、交付全流程。",
  },
];

/* ── Product tab data ── */
const productTabs = allProducts.map((p) => ({
  id: p.id,
  name: p.name,
  tagline: p.tagline,
}));

/* ── FAQ data ── */
const faqs = [
  {
    q: "zmzai.cloud 是什么？",
    a: "zmzai.cloud 是牧之的 AI 产品系统枢纽。它整合了模型接口（Relay）、沙箱执行（Sandbox）、Agent 工作台、知识博客（Muzhi）等产品，提供统一的账号和入口。",
  },
  {
    q: "Relay 和直接调用 OpenAI API 有什么区别？",
    a: "Relay 提供统一的 API 接口，支持多模型路由、自动故障转移、统一计费和鉴权。你只需要对接一个 endpoint，就能使用所有主流模型。",
  },
  {
    q: "Sandbox 如何保证安全？",
    a: "每个任务运行在独立的容器中，限制 CPU、内存、网络访问和执行时间。代码执行完毕后容器自动销毁，不留任何残留。",
  },
  {
    q: "可以免费试用吗？",
    a: "Muzhi 博客内容免费开放阅读。Relay 和 Sandbox 提供免费额度，注册后即可使用。详细定价请参考各产品页面。",
  },
  {
    q: "如何接入？",
    a: "开发者可以通过 Relay 的 OpenAI 兼容接口直接接入，只需更换 base URL 和 API Key。文档见 m.zmzai.cloud/docs。",
  },
];

/* ── Main page ── */
export default function HomePage() {
  const [activeStep, setActiveStep] = useState(0);
  const [activeTab, setActiveTab] = useState("relay");

  return (
    <main>
      {/* ═══════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════ */}
      <section className="pt-28 pb-20 lg:pt-36 lg:pb-28">
        <div className="max-w-5xl mx-auto px-6 lg:px-0">
          {/* Top row: logo + nav */}
          <div className="flex items-center justify-between mb-16">
            <div className="flex items-center gap-3">
              <Logo size={28} />
              <span className="font-mono text-[11px] tracking-[0.15em] text-muted uppercase">
                zmzai.cloud
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-8">
              <a href="#products" className="text-sm text-muted hover:text-ink transition-colors">产品</a>
              <a href="#workflow" className="text-sm text-muted hover:text-ink transition-colors">工作流</a>
              <a href="#faq" className="text-sm text-muted hover:text-ink transition-colors">常见问题</a>
              <a
                href={`${AUTH_URL}/login?next=${encodeURIComponent(WORKSPACE_URL)}`}
                className="text-sm font-medium text-ink hover:text-accent transition-colors"
              >
                登录
              </a>
            </div>
          </div>

          {/* Hero text */}
          <div className="max-w-3xl">
            <p className="font-mono text-xs tracking-[0.2em] text-muted uppercase mb-6">
              AI Product System
            </p>
            <h1 className="headline text-5xl sm:text-6xl lg:text-7xl mb-6">
              从模型接口，
              <br />
              到 Agent 工作台。
            </h1>
            <p className="text-lg sm:text-xl leading-relaxed text-ink-2 max-w-xl mb-10">
              Relay、Sandbox、Agent、Muzhi——各自独立运行，从同一个入口出发。
              一个账号，打通 AI 开发全链路。
            </p>

            {/* Dual CTA */}
            <div className="flex flex-wrap items-center gap-4">
              <a
                href={`${AUTH_URL}/login?next=${encodeURIComponent(WORKSPACE_URL)}`}
                className="btn-solid"
              >
                开始使用
                <span className="arrow-slide">→</span>
              </a>
              <a href="#products" className="btn-outline">
                浏览产品
              </a>
            </div>
          </div>

          {/* Feature icon row */}
          <div className="mt-20 flex flex-wrap gap-2">
            {[
              { icon: "⚡", label: "模型路由" },
              { icon: "🔒", label: "沙箱执行" },
              { icon: "🤖", label: "Agent 编排" },
              { icon: "📝", label: "知识沉淀" },
              { icon: "🔗", label: "统一入口" },
            ].map((f) => (
              <div key={f.label} className="feature-icon">
                <div className="feature-icon-box">{f.icon}</div>
                <span>{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          WORKFLOW — 步骤条 + 截图
      ═══════════════════════════════════════════ */}
      <section id="workflow" className="py-20 lg:py-28 bg-surface/50">
        <div className="max-w-5xl mx-auto px-6 lg:px-0">
          <div className="mb-16">
            <p className="font-mono text-xs tracking-[0.2em] text-muted uppercase mb-4">
              How it works
            </p>
            <h2 className="headline text-3xl sm:text-4xl lg:text-5xl">
              四步打通 AI 开发链路
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left: step list */}
            <div className="flex flex-col">
              {workflowSteps.map((step, i) => (
                <div
                  key={step.num}
                  className={`step-item ${i === activeStep ? "active" : ""}`}
                  onClick={() => setActiveStep(i)}
                >
                  <span className="step-num">{step.num}</span>
                  <div>
                    <div className="font-semibold">{step.title}</div>
                    <div className={`text-xs mt-0.5 ${i === activeStep ? "text-paper/70" : "text-muted"}`}>
                      {step.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: showcase */}
            <div className="workflow-frame">
              <div className="workflow-frame-inner">
                <ProductShowcase productId={
                  activeStep === 0 ? "hub" :
                  activeStep === 1 ? "relay" :
                  activeStep === 2 ? "sandbox" : "muzhi"
                } />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          PRODUCTS — Tab 切换
      ═══════════════════════════════════════════ */}
      <section id="products" className="py-20 lg:py-28">
        <div className="max-w-5xl mx-auto px-6 lg:px-0">
          <div className="mb-12">
            <p className="font-mono text-xs tracking-[0.2em] text-muted uppercase mb-4">
              Products
            </p>
            <h2 className="headline text-3xl sm:text-4xl lg:text-5xl mb-4">
              产品矩阵
            </h2>
            <p className="text-lg text-ink-2 max-w-lg">
              六个产品，覆盖 AI 开发从接口到交付的全链路。
            </p>
          </div>

          {/* Tab bar */}
          <div className="flex flex-wrap gap-2 mb-10">
            {productTabs.map((tab) => (
              <button
                key={tab.id}
                className={`tab-pill ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.name}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {productTabs.map((tab) => {
            if (tab.id !== activeTab) return null;
            const product = allProducts.find((p) => p.id === tab.id)!;
            return (
              <div key={tab.id} className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-start">
                {/* Left: info */}
                <div className="lg:col-span-3">
                  <div className="flex items-center gap-3 mb-4">
                    <StatusBadge status={product.status} />
                    <span className="font-mono text-[10px] text-muted">
                      {product.href.replace(/^https?:\/\//, "")}
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
                    {product.name}
                  </h3>
                  <p className="text-base font-medium text-ink-2 mb-3">
                    {product.tagline}
                  </p>
                  <p className="text-sm leading-7 text-ink-2/80 mb-8 max-w-lg">
                    {product.description}
                  </p>
                  <a href={product.href} className="btn-solid text-sm">
                    进入产品 <span className="arrow-slide">→</span>
                  </a>
                </div>

                {/* Right: showcase */}
                <div className="lg:col-span-2">
                  <div className="workflow-frame">
                    <div className="workflow-frame-inner">
                      <ProductShowcase productId={product.id} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          PRODUCT CARDS GRID
      ═══════════════════════════════════════════ */}
      <section className="py-20 lg:py-28 bg-surface/50">
        <div className="max-w-5xl mx-auto px-6 lg:px-0">
          <div className="mb-12">
            <p className="font-mono text-xs tracking-[0.2em] text-muted uppercase mb-4">
              All Products
            </p>
            <h2 className="headline text-3xl sm:text-4xl">
              全部产品一览
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {allProducts.map((p) => (
              <a
                key={p.id}
                href={p.href}
                className="product-card p-6 block"
              >
                <div className="flex items-center justify-between mb-4">
                  <StatusBadge status={p.status} />
                  <span className="font-mono text-[10px] text-muted">
                    {p.letter}
                  </span>
                </div>
                <h3 className="text-lg font-bold mb-1">{p.name}</h3>
                <p className="text-sm text-ink-2 mb-4">{p.tagline}</p>
                <p className="text-xs text-muted leading-relaxed line-clamp-2">
                  {p.description}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          STATS
      ═══════════════════════════════════════════ */}
      <section className="py-20 lg:py-24">
        <div className="max-w-5xl mx-auto px-6 lg:px-0">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: "6", label: "产品" },
              { value: "1", label: "统一账号" },
              { value: "∞", label: "模型选择" },
              { value: "0", label: "厂商锁定" },
            ].map((s) => (
              <div key={s.label}>
                <div className="stat-value">{s.value}</div>
                <div className="text-sm text-muted mt-2">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FAQ
      ══════════════════════════════════════════ */}
      <section id="faq" className="py-20 lg:py-28 bg-surface/50">
        <div className="max-w-3xl mx-auto px-6 lg:px-0">
          <div className="mb-12">
            <p className="font-mono text-xs tracking-[0.2em] text-muted uppercase mb-4">
              FAQ
            </p>
            <h2 className="headline text-3xl sm:text-4xl">
              常见问题
            </h2>
          </div>

          <div>
            {faqs.map((faq) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CTA
      ═══════════════════════════════════════════ */}
      <section className="py-24 lg:py-32">
        <div className="max-w-3xl mx-auto px-6 lg:px-0 text-center">
          <h2 className="headline text-3xl sm:text-4xl lg:text-5xl mb-6">
            开始构建你的 AI 系统
          </h2>
          <p className="text-lg text-ink-2 mb-10 max-w-md mx-auto">
            登录后可通过统一工作台访问所有产品。API 开发者可直接接入 Relay。
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={`${AUTH_URL}/login?next=${encodeURIComponent(WORKSPACE_URL)}`}
              className="btn-solid"
            >
              登录工作台 <span className="arrow-slide">→</span>
            </a>
            <a
              href="https://m.zmzai.cloud/docs"
              className="btn-outline"
            >
              API 文档
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════ */}
      <footer className="border-t border-line py-16">
        <div className="max-w-5xl mx-auto px-6 lg:px-0">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div className="col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <Logo size={24} />
                <span className="font-mono text-xs tracking-[0.15em] text-muted uppercase">
                  zmzai.cloud
                </span>
              </div>
              <p className="text-sm text-muted leading-relaxed">
                牧之的 AI 产品系统。
                <br />
                从模型到交付，一站打通。
              </p>
            </div>

            {/* Products */}
            <div>
              <div className="font-mono text-[10px] tracking-[0.15em] text-muted uppercase mb-4">
                产品
              </div>
              <ul className="flex flex-col gap-2.5">
                {allProducts.map((p) => (
                  <li key={p.id}>
                    <a href={p.href} className="text-sm text-ink-2 hover:text-ink transition-colors">
                      {p.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <div className="font-mono text-[10px] tracking-[0.15em] text-muted uppercase mb-4">
                资源
              </div>
              <ul className="flex flex-col gap-2.5">
                <li><a href="https://m.zmzai.cloud/docs" className="text-sm text-ink-2 hover:text-ink transition-colors">API 文档</a></li>
                <li><a href="https://muzhi.zmzai.cloud" className="text-sm text-ink-2 hover:text-ink transition-colors">博客</a></li>
                <li><a href="#faq" className="text-sm text-ink-2 hover:text-ink transition-colors">常见问题</a></li>
              </ul>
            </div>

            {/* Account */}
            <div>
              <div className="font-mono text-[10px] tracking-[0.15em] text-muted uppercase mb-4">
                账号
              </div>
              <ul className="flex flex-col gap-2.5">
                <li>
                  <a href={`${AUTH_URL}/login`} className="text-sm text-ink-2 hover:text-ink transition-colors">
                    登录
                  </a>
                </li>
                <li>
                  <a href={`${AUTH_URL}/register`} className="text-sm text-ink-2 hover:text-ink transition-colors">
                    注册
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-line pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="font-mono text-[10px] text-muted">
              © 2025 zmzai.cloud · 牧之
            </span>
            <div className="flex items-center gap-6">
              <a href="#" className="text-xs text-muted hover:text-ink transition-colors">隐私</a>
              <a href="#" className="text-xs text-muted hover:text-ink transition-colors">条款</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
