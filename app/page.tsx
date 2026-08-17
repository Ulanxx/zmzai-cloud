"use client";

import { useEffect, useRef, useState } from "react";

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

/* ── FAQ item ── */
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

/* ── AnimatedNumber — 进入视口后从 0 计数 ── */
function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const dur = 1200;
          const tick = (now: number) => {
            const t = Math.min((now - start) / dur, 1);
            const eased = 1 - Math.pow(1 - t, 3);
            setDisplay(Math.round(eased * value));
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [value]);

  return (
    <span ref={ref} className="count-num">
      {display}
      {suffix}
    </span>
  );
}

/* ── 内联 SVG 图标（不用 emoji） ── */
function IconGate() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 21V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16" />
      <path d="M2 21h20" />
      <path d="M12 3v18" />
    </svg>
  );
}
function IconPlug() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 22v-5" />
      <path d="M9 8V2M15 8V2" />
      <path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8h12z" />
    </svg>
  );
}
function IconAudit() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

/* ── Workflow steps ── */
const workflowSteps = [
  {
    num: "01",
    badge: "step 1",
    title: "统一入口",
    product: "hub",
    note: "一个账号通行所有产品，工作台聚合全部入口",
    desc: "一个账号，访问所有 AI 产品。Relay 提供模型接口，Sandbox 提供执行环境，Agent 编排任务流。",
  },
  {
    num: "02",
    badge: "step 2",
    title: "模型路由",
    product: "relay",
    note: "选定接口后，鉴权、计费、路由自动带入调用链",
    desc: "Relay 统一接入 OpenAI、Anthropic、DeepSeek 等模型，自动故障转移和智能路由。",
  },
  {
    num: "03",
    badge: "step 3",
    title: "安全执行",
    product: "sandbox",
    note: "每个任务独立容器，资源与网络全程受限",
    desc: "Sandbox 为每个 Agent 任务提供隔离容器，限制资源、网络和超时，确保代码安全运行。",
  },
  {
    num: "04",
    badge: "step 4",
    title: "知识沉淀",
    product: "muzhi",
    note: "实践沉淀为文章，交付整合进工作台",
    desc: "Muzhi 博客记录技术实践，WorkOS 工作台整合写作、检索、交付全流程。",
  },
];

/* ── Integrations ── */
const integrations = [
  "OpenAI",
  "Anthropic",
  "DeepSeek",
  "Google Gemini",
  "Moonshot",
  "智谱 GLM",
  "通义千问",
  "OpenRouter",
];

/* ── Stats ── */
const stats = [
  { value: 6, suffix: "", label: "条产品线" },
  { value: 8, suffix: "+", label: "模型渠道" },
  { value: 1, suffix: "", label: "统一账号" },
  { value: 0, suffix: "", label: "厂商锁定" },
];

/* ── CTA checklist ── */
const ctaChecks = [
  "注册即得统一账号，所有产品一登即达",
  "Relay 兼容 OpenAI 接口标准，换个 base_url 就能接入",
  "Muzhi 知识内容免费开放阅读",
  "Sandbox 与 Agent 内测中，登录后可申请体验",
];

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
  const step = workflowSteps[activeStep];

  return (
    <main>
      {/* ═══════════════════════════════════════════
          1. HERO — 大标题 + 双 CTA + 管线 breadcrumb
      ═══════════════════════════════════════════ */}
      <section className="pt-12 pb-16 lg:pt-20 lg:pb-24">
        <div className="max-w-5xl mx-auto px-6 lg:px-0">
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
            <div className="flex flex-wrap items-center gap-4 mb-14">
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

          {/* Pipeline breadcrumb */}
          <div className="pipeline">
            {["想法", "Relay 接口", "Sandbox 执行", "Agent 编排", "交付沉淀"].map(
              (node, i, arr) => (
                <span key={node} className="contents">
                  <span className={`pipeline-node ${i === 1 ? "current" : ""}`}>
                    {node}
                  </span>
                  {i < arr.length - 1 && <span className="pipeline-arrow">→</span>}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          2. WHY — 标题 + 叙事段落 + 3 卡片（1 暗 2 亮）
      ═══════════════════════════════════════════ */}
      <section className="py-20 lg:py-28 bg-surface/60">
        <div className="max-w-5xl mx-auto px-6 lg:px-0">
          <h2 className="headline text-3xl sm:text-4xl lg:text-5xl mb-10">
            为什么选择 zmzai？
          </h2>
          <p className="narrative max-w-3xl mb-14">
            zmzai.cloud 是把<b>模型接口、沙箱执行、Agent 编排</b>串成一条链路的
            个人 AI 产品系统。当 AI 开发能力散落在各家 SaaS 里——各自注册、各自计费、
            各自一套 API——zmzai 把它们收拢到同一个身份之下：
            <b>一个账号</b>、<b>一套接口标准</b>、<b>一条可审计的任务流</b>。
            你不需要再为每个环节换一次工具。
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="why-card dark">
              <div className="why-card-icon">
                <IconGate />
              </div>
              <div className="text-lg font-bold">统一入口</div>
              <p className="text-sm leading-relaxed opacity-70">
                一个账号通行全部产品，不再为每个工具重复注册、记一堆 API Key。
              </p>
            </div>
            <div className="why-card">
              <div className="why-card-icon">
                <IconPlug />
              </div>
              <div className="text-lg font-bold">接入而非重造</div>
              <p className="text-sm leading-relaxed text-ink-2">
                Relay 兼容 OpenAI 接口标准，换个 base_url 就用上多模型路由。
              </p>
            </div>
            <div className="why-card">
              <div className="why-card-icon">
                <IconAudit />
              </div>
              <div className="text-lg font-bold">可审计可控</div>
              <p className="text-sm leading-relaxed text-ink-2">
                每个 Agent 任务持久化留痕，变更、审批、执行记录全程可查。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          3. WORKFLOW — 步骤条 + 带 badge 的视觉卡
      ═══════════════════════════════════════════ */}
      <section id="workflow" className="py-20 lg:py-28">
        <div className="max-w-5xl mx-auto px-6 lg:px-0">
          <div className="mb-16">
            <p className="font-mono text-xs tracking-[0.2em] text-muted uppercase mb-4">
              How it works
            </p>
            <h2 className="headline text-3xl sm:text-4xl lg:text-5xl mb-4">
              四步打通 AI 开发链路
            </h2>
            <p className="text-lg text-ink-2 max-w-xl">
              从想法到交付，每一步都有对应的产品承接。
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left: step list */}
            <div className="flex flex-col">
              {workflowSteps.map((s, i) => (
                <div
                  key={s.num}
                  className={`step-item ${i === activeStep ? "active" : ""}`}
                  onClick={() => setActiveStep(i)}
                >
                  <span className="step-num">{s.num}</span>
                  <div>
                    <div className="font-semibold">{s.title}</div>
                    <div className={`text-xs mt-0.5 ${i === activeStep ? "text-paper/70" : "text-muted"}`}>
                      {s.desc}
                    </div>
                  </div>
                </div>
              ))}

              {/* Step 底部双按钮 */}
              <div className="flex flex-wrap items-center gap-3 mt-8">
                <a href="#products" className="btn-outline text-sm">
                  浏览全部产品 <span className="arrow-slide">→</span>
                </a>
                <a
                  href={`${AUTH_URL}/login?next=${encodeURIComponent(WORKSPACE_URL)}`}
                  className="btn-solid text-sm"
                >
                  进入工作台
                </a>
              </div>
            </div>

            {/* Right: showcase with step badge */}
            <div className="workflow-frame">
              <span className="step-badge">{step.badge}</span>
              <div className="workflow-frame-inner">
                <ProductShowcase productId={step.product} />
                <div className="mt-4 flex items-start gap-2 border border-line bg-paper p-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                  <p className="text-xs leading-relaxed text-ink-2">{step.note}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          4. PRODUCTS — Tab 切换 6 产品
      ═══════════════════════════════════════════ */}
      <section id="products" className="py-20 lg:py-28 bg-surface/60">
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
            {allProducts.map((p) => (
              <button
                key={p.id}
                className={`tab-pill ${activeTab === p.id ? "active" : ""}`}
                onClick={() => setActiveTab(p.id)}
              >
                {p.name}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {allProducts.map((product) => {
            if (product.id !== activeTab) return null;
            return (
              <div key={product.id} className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-start">
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
          5. INTEGRATIONS — 模型渠道 chip
      ═══════════════════════════════════════════ */}
      <section className="py-20 lg:py-24">
        <div className="max-w-5xl mx-auto px-6 lg:px-0">
          <div className="mb-10">
            <p className="font-mono text-xs tracking-[0.2em] text-muted uppercase mb-4">
              Integrations
            </p>
            <h2 className="headline text-3xl sm:text-4xl mb-4">
              一套接口，接所有模型
            </h2>
            <p className="text-lg text-ink-2 max-w-xl">
              Relay 已对接主流模型渠道，兼容 OpenAI API 标准——换 base_url 与
              API Key 即可完成迁移。
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {integrations.map((name) => (
              <span key={name} className="chip">
                <span className="chip-dot" />
                {name}
              </span>
            ))}
            <a href="https://m.zmzai.cloud/docs" className="chip hover:border-accent">
              查看全部渠道 <span className="arrow-slide">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          6. PRODUCT CARDS GRID
      ═══════════════════════════════════════════ */}
      <section className="py-20 lg:py-28 bg-surface/60">
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
          7. STATS — 计数动画
      ═══════════════════════════════════════════ */}
      <section className="py-20 lg:py-24">
        <div className="max-w-5xl mx-auto px-6 lg:px-0">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="stat-value">
                  <AnimatedNumber value={s.value} suffix={s.suffix} />
                </div>
                <div className="text-sm text-muted mt-2">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          8. CTA CHECKLIST — 勾选清单 + 双按钮
      ═══════════════════════════════════════════ */}
      <section className="py-20 lg:py-28 bg-surface/60">
        <div className="max-w-5xl mx-auto px-6 lg:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: headline */}
            <div>
              <p className="font-mono text-xs tracking-[0.2em] text-accent uppercase mb-4">
                zmzai.cloud Workspace
              </p>
              <h2 className="headline text-3xl sm:text-4xl lg:text-5xl mb-6">
                一个工作台，
                <br />
                让每个产品随手可用。
              </h2>
              <p className="text-base leading-relaxed text-ink-2 mb-8 max-w-md">
                在统一工作台中管理接口、任务与内容，连接你已有的开发习惯，
                不用为每个环节切换工具。
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href={`${AUTH_URL}/register`}
                  className="btn-solid"
                >
                  免费注册 <span className="arrow-slide">→</span>
                </a>
                <a href="https://m.zmzai.cloud/docs" className="btn-outline">
                  API 文档
                </a>
              </div>
              <p className="font-mono text-[10px] text-muted mt-4">
                支持 Web 端 · macOS / Windows / Linux 浏览器直访
              </p>
            </div>

            {/* Right: checklist */}
            <div className="border border-line bg-paper p-8">
              {ctaChecks.map((item) => (
                <div key={item} className="check-row">
                  <span className="check-mark">✓</span>
                  <span className="text-ink-2">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          9. FAQ
      ═══════════════════════════════════════════ */}
      <section id="faq" className="py-20 lg:py-28">
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
          10. FINAL CTA — 大字收尾
      ═══════════════════════════════════════════ */}
      <section className="py-24 lg:py-32">
        <div className="max-w-3xl mx-auto px-6 lg:px-0 text-center">
          <h2 className="headline text-4xl sm:text-5xl lg:text-6xl mb-6">
            开始构建你的
            <br />
            <span className="text-accent">AI 产品系统。</span>
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
              href="/projects"
              className="btn-outline"
            >
              全部项目
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
