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
        <span className="ml-auto font-mono text-[10px] text-success">200 OK</span>
      </div>
      <div className="showcase-code">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-mono text-[10px] px-1.5 py-0.5 bg-accent/10 text-accent rounded-sm">REQUEST</span>
          <span className="font-mono text-[10px] text-muted">142ms · 156 tokens</span>
        </div>
        <div className="text-muted">{"// Request"}</div>
        <div>
          <span className="text-accent">curl</span>{" "}
          <span className="text-ink-2">https://m.zmzai.cloud/v1/chat</span>
        </div>
        <div className="pl-4 text-ink-2">{"-d '{"}</div>
        <div className="pl-8">
          <span className="text-accent">"model"</span>: {" "}
          <span className="text-success">"gpt-4o"</span>,
        </div>
        <div className="pl-8">
          <span className="text-accent">"messages"</span>: [{"{"}
        </div>
        <div className="pl-12">
          <span className="text-accent">"role"</span>: {" "}
          <span className="text-success">"user"</span>,
        </div>
        <div className="pl-12">
          <span className="text-accent">"content"</span>: {" "}
          <span className="text-success">"Hello"</span>
        </div>
        <div className="pl-8">{"}]"}</div>
        <div className="pl-4">{"}'"}</div>
        <div className="mt-3 pt-3 border-t border-line">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-[10px] px-1.5 py-0.5 bg-success/10 text-success rounded-sm">RESPONSE</span>
          </div>
          <div className="pl-4">
            <span className="text-accent">"id"</span>: <span className="text-ink-2">"chatcmpl-abc123"</span>,
          </div>
          <div className="pl-4">
            <span className="text-accent">"object"</span>: <span className="text-success">"chat.completion"</span>,
          </div>
          <div className="pl-4">
            <span className="text-accent">"usage"</span>: {"{"} <span className="text-ink-2">total_tokens: 156</span> {"}"}
          </div>
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
        <span className="ml-auto font-mono text-[10px] text-success">● running</span>
      </div>
      <div className="showcase-code bg-dark-bg text-dark-ink">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-mono text-[10px] px-1.5 py-0.5 bg-success/20 text-success rounded-sm">CONTAINER</span>
          <span className="font-mono text-[10px] text-dark-ink/50">ubuntu-22.04 · 256MB</span>
        </div>
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
        <div className="mt-3 pt-2 border-t border-line/30">
          <div className="flex items-center gap-3 text-dark-ink/50 text-[10px]">
            <span>CPU: 12ms</span>
            <span>MEM: 48MB</span>
            <span>NET: blocked</span>
          </div>
        </div>
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
    <div className="showcase-shell">
      <div className="showcase-titlebar">
        <span className="showcase-dot" />
        <span>Task Pipeline</span>
        <span className="ml-auto font-mono text-[10px] text-accent">● executing</span>
      </div>
      <div className="p-5 flex flex-col gap-3">
        {[
          { label: "Analyze", status: "done", detail: "3 files scanned" },
          { label: "Plan", status: "done", detail: "5 steps generated" },
          { label: "Execute", status: "active", detail: "Running step 3/5" },
          { label: "Review", status: "pending", detail: "Waiting" },
        ].map((step, i) => (
          <div key={step.label} className="flex items-center gap-3">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-mono border shrink-0 ${
                step.status === "done"
                  ? "border-success text-success bg-success/5"
                  : step.status === "active"
                    ? "border-accent text-accent bg-accent/10"
                    : "border-line text-muted"
              }`}
            >
              {step.status === "done" ? "✓" : i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className={`font-mono text-xs ${
                step.status === "done" ? "text-success" :
                step.status === "active" ? "text-accent" : "text-muted"
              }`}>
                {step.label}
              </div>
              <div className="font-mono text-[10px] text-muted truncate">
                {step.detail}
              </div>
            </div>
            {step.status === "active" && (
              <span className="flex gap-1 shrink-0">
                <span className="w-1 h-1 rounded-full bg-accent animate-pulse" />
                <span className="w-1 h-1 rounded-full bg-accent animate-pulse" style={{ animationDelay: "200ms" }} />
                <span className="w-1 h-1 rounded-full bg-accent animate-pulse" style={{ animationDelay: "400ms" }} />
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Muzhi — 博客卡片 ── */
function MuzhiBlog() {
  return (
    <div className="showcase-shell">
      <div className="showcase-titlebar">
        <span className="showcase-dot" />
        <span>muzhi.zmzai.cloud</span>
        <span className="ml-auto font-mono text-[10px] text-success">published</span>
      </div>
      <div className="p-5">
        {/* 文章列表 */}
        <div className="flex flex-col gap-3">
          {[
            { title: "从零构建 AI Coding Agent", tag: "教程", date: "08-15", status: "live" },
            { title: "Relay 计费断点设计", tag: "技术", date: "08-12", status: "live" },
            { title: "Sandbox 安全隔离方案", tag: "技术", date: "08-08", status: "draft" },
          ].map((post) => (
            <div key={post.title} className="flex items-start gap-3 pb-3 border-b border-line last:border-0 last:pb-0">
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-ink leading-snug truncate">
                  {post.title}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-mono text-[10px] px-1 py-0.5 bg-surface text-muted rounded-sm">
                    {post.tag}
                  </span>
                  <span className="font-mono text-[10px] text-muted">
                    {post.date}
                  </span>
                </div>
              </div>
              <span className={`font-mono text-[10px] shrink-0 mt-0.5 ${
                post.status === "live" ? "text-success" : "text-muted"
              }`}>
                {post.status === "live" ? "已发布" : "草稿"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── WorkOS — 仪表盘 widget ── */
function WorkOsDash() {
  return (
    <div className="showcase-shell">
      <div className="showcase-titlebar">
        <span className="showcase-dot" />
        <span>WorkOS Dashboard</span>
      </div>
      <div className="p-5 flex flex-col gap-4">
        <div className="flex gap-3">
          <div className="flex-1 p-4 border border-line">
            <div className="font-mono text-[10px] text-muted mb-1">任务</div>
            <div className="text-xl font-semibold">12</div>
          </div>
          <div className="flex-1 p-4 border border-line">
            <div className="font-mono text-[10px] text-muted mb-1">项目</div>
            <div className="text-xl font-semibold">4</div>
          </div>
        </div>
        <div className="p-4 border border-line">
          <div className="font-mono text-[10px] text-muted mb-2">今日进度</div>
          <div className="h-2.5 bg-surface rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full"
              style={{ width: "68%" }}
            />
          </div>
          <div className="font-mono text-[10px] text-muted mt-1.5">68%</div>
        </div>
        <div className="p-4 border border-line">
          <div className="font-mono text-[10px] text-muted mb-3">最近活动</div>
          {["完成文章发布", "更新 API 配置", "创建新项目"].map((item) => (
            <div
              key={item}
              className="flex items-center gap-2 text-xs py-1.5 text-ink-2"
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

/* ── Hub — 产品地图 ─ */
function HubMap() {
  const items = [
    { name: "Muzhi", x: 50, y: 12 },
    { name: "Sandbox", x: 12, y: 42 },
    { name: "Relay", x: 88, y: 42 },
    { name: "Agent", x: 22, y: 82 },
    { name: "WorkOS", x: 78, y: 82 },
  ];
  return (
    <div className="relative w-full h-[260px]">
      {/* 中心 Hub */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full border-2 border-accent flex items-center justify-center bg-paper z-10">
        <span className="font-mono text-[11px] text-accent font-bold">Hub</span>
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
