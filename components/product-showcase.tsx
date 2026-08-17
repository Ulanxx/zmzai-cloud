"use client";

/**
 * ProductShowcase — 每个产品独立的视觉展示组件。
 * 不再用统一模板，每个产品有自己的视觉语言：
 * - Relay: API 调用 mockup
 * - Sandbox: 终端 mockup
 * - Agent: 任务流节点
 * - Muzhi: 博客卡片
 * - WorkOS: 仪表盘 widget
 * - Hub: 产品地图
 */

/* ── Relay — API 调用 mockup ── */
function RelayApi() {
  return (
    <div className="showcase-shell">
      <div className="showcase-titlebar">
        <span className="showcase-dot" />
        <span>POST /v1/chat/completions</span>
      </div>
      <div className="showcase-code">
        <div className="text-muted">{"// Request"}</div>
        <div>
          <span className="text-accent">curl</span>{" "}
          <span className="text-ink-2">https://m.zmzai.cloud/v1/chat</span>
        </div>
        <div className="pl-4 text-ink-2">{"-d '{"}</div>
        <div className="pl-8">
          <span className="text-accent">"model"</span>:{" "}
          <span className="text-success">"gpt-4o"</span>,
        </div>
        <div className="pl-8">
          <span className="text-accent">"messages"</span>: [{"{"}
        </div>
        <div className="pl-12">
          <span className="text-accent">"role"</span>:{" "}
          <span className="text-success">"user"</span>,
        </div>
        <div className="pl-12">
          <span className="text-accent">"content"</span>:{" "}
          <span className="text-success">"Hello"</span>
        </div>
        <div className="pl-8">{"}]"}</div>
        <div className="pl-4">{"}'"}</div>
        <div className="mt-3 pt-3 border-t border-line text-muted">
          <span className="text-success">✓</span> 200 OK ·{" "}
          <span className="text-ink-2">142ms</span> ·{" "}
          <span className="text-ink-2">156 tokens</span>
        </div>
      </div>
    </div>
  );
}

/* ── Sandbox — 终端 mockup ── */
function SandboxTerminal() {
  return (
    <div className="showcase-shell">
      <div className="showcase-titlebar">
        <span className="showcase-dot" />
        <span className="showcase-dot" />
        <span className="showcase-dot" />
        <span className="ml-2">sandbox — z.zmzai.cloud</span>
      </div>
      <div className="showcase-code bg-dark-bg text-dark-ink">
        <div>
          <span className="text-success">$</span>{" "}
          <span className="text-dark-ink/80">python3 solution.py</span>
        </div>
        <div className="text-dark-ink/50 mt-1">
          Running in isolated container...
        </div>
        <div className="text-dark-ink/50">
          Memory limit: 256MB | Timeout: 30s
        </div>
        <div className="mt-2 text-success">✓ Exit code: 0</div>
        <div className="text-dark-ink/70">Output:</div>
        <div className="text-dark-ink/70 pl-2">Hello, World!</div>
        <div className="mt-2 text-dark-ink/40">
          <span className="text-success">$</span>{" "}
          <span className="showcase-cursor" />
        </div>
      </div>
    </div>
  );
}

/* ── Agent — 任务流节点 ── */
function AgentFlow() {
  return (
    <div className="flex flex-col gap-3">
      {[
        { label: "Analyze", status: "done", color: "text-success" },
        { label: "Plan", status: "done", color: "text-success" },
        { label: "Execute", status: "active", color: "text-accent" },
        { label: "Review", status: "pending", color: "text-muted" },
      ].map((step, i) => (
        <div key={step.label} className="flex items-center gap-3">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono border ${
              step.status === "done"
                ? "border-success text-success"
                : step.status === "active"
                  ? "border-accent text-accent bg-accent/10"
                  : "border-line text-muted"
            }`}
          >
            {step.status === "done" ? "✓" : i + 1}
          </div>
          <span
            className={`font-mono text-xs ${step.color}`}
          >
            {step.label}
          </span>
          {step.status === "active" && (
            <span className="ml-auto flex gap-1">
              <span className="w-1 h-1 rounded-full bg-accent animate-pulse" />
              <span className="w-1 h-1 rounded-full bg-accent animate-pulse" style={{ animationDelay: "200ms" }} />
              <span className="w-1 h-1 rounded-full bg-accent animate-pulse" style={{ animationDelay: "400ms" }} />
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

/* ── Muzhi — 博客卡片 ── */
function MuzhiBlog() {
  return (
    <div className="showcase-blog-card max-w-[280px]">
      <div className="h-32 bg-surface-strong flex items-center justify-center">
        <span className="font-serif text-4xl text-muted/30">牧</span>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-mono text-[10px] text-muted">2026-08-15</span>
          <span className="font-mono text-[10px] px-1.5 py-0.5 bg-surface text-muted">
            教程
          </span>
        </div>
        <h4 className="text-sm font-semibold mb-1 leading-snug">
          从零构建 AI Coding Agent
        </h4>
        <p className="text-xs text-muted leading-relaxed">
          第八期：工具调用与自治循环...
        </p>
        <div className="mt-3 pt-3 border-t border-line flex items-center justify-between">
          <span className="font-mono text-[10px] text-success">已发布</span>
          <span className="font-mono text-[10px] text-muted">12 min read</span>
        </div>
      </div>
    </div>
  );
}

/* ── WorkOS — 仪表盘 widget ── */
function WorkOsDash() {
  return (
    <div className="showcase-shell max-w-[300px]">
      <div className="showcase-titlebar">
        <span className="showcase-dot" />
        <span>WorkOS Dashboard</span>
      </div>
      <div className="p-4 flex flex-col gap-3">
        <div className="flex gap-3">
          <div className="flex-1 p-3 border border-line">
            <div className="font-mono text-[10px] text-muted mb-1">任务</div>
            <div className="text-lg font-semibold">12</div>
          </div>
          <div className="flex-1 p-3 border border-line">
            <div className="font-mono text-[10px] text-muted mb-1">项目</div>
            <div className="text-lg font-semibold">4</div>
          </div>
        </div>
        <div className="p-3 border border-line">
          <div className="font-mono text-[10px] text-muted mb-2">今日进度</div>
          <div className="h-2 bg-surface rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full"
              style={{ width: "68%" }}
            />
          </div>
          <div className="font-mono text-[10px] text-muted mt-1">68%</div>
        </div>
        <div className="p-3 border border-line">
          <div className="font-mono text-[10px] text-muted mb-2">最近活动</div>
          {["完成文章发布", "更新 API 配置", "创建新项目"].map((item) => (
            <div
              key={item}
              className="flex items-center gap-2 text-xs py-1 text-ink-2"
            >
              <span className="w-1 h-1 rounded-full bg-success shrink-0" />
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Hub — 产品地图 ── */
function HubMap() {
  const items = [
    { name: "Muzhi", x: 50, y: 15 },
    { name: "Sandbox", x: 15, y: 45 },
    { name: "Relay", x: 85, y: 45 },
    { name: "Agent", x: 25, y: 80 },
    { name: "WorkOS", x: 75, y: 80 },
  ];
  return (
    <div className="relative w-full h-[200px]">
      {/* 中心 Hub */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full border-2 border-accent flex items-center justify-center bg-paper z-10">
        <span className="font-mono text-[10px] text-accent font-bold">Hub</span>
      </div>
      {/* 连接线 */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ pointerEvents: "none" }}
      >
        {items.map((item) => (
          <line
            key={item.name}
            x1="50%"
            y1="50%"
            x2={`${item.x}%`}
            y2={`${item.y}%`}
            stroke="var(--color-line)"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
        ))}
      </svg>
      {/* 产品节点 */}
      {items.map((item) => (
        <div
          key={item.name}
          className="absolute -translate-x-1/2 -translate-y-1/2 showcase-node"
          style={{ left: `${item.x}%`, top: `${item.y}%` }}
        >
          {item.name}
        </div>
      ))}
    </div>
  );
}

/* ── 主组件 ── */
export function ProductShowcase({ productId }: { productId: string }) {
  switch (productId) {
    case "relay":
      return <RelayApi />;
    case "sandbox":
      return <SandboxTerminal />;
    case "agent":
      return <AgentFlow />;
    case "muzhi":
      return <MuzhiBlog />;
    case "workos":
      return <WorkOsDash />;
    case "hub":
      return <HubMap />;
    default:
      return null;
  }
}
