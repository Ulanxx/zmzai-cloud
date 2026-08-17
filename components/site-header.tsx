"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button, NavShell, navItemClass } from "@zmzai/theme";

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL ?? "https://auth.zmzai.cloud";
const WORKSPACE_URL = "https://zmzai.cloud/workspace";

/**
 * SiteHeader — open-design.ai 式吸顶导航（theme NavShell）：
 * 顶部时全宽贴边，滚动 >16px 后收缩为浮动胶囊（圆角 + 阴影 + 四周留白）。
 * 滚动监听与形态切换由 theme NavShell 内部实现。
 */
export function SiteHeader() {
  const pathname = usePathname() ?? "/";

  return (
    <NavShell
      badge={
        <span className="rounded-full border border-line px-2 py-0.5 font-mono text-[11px] text-ink-3">
          zmzai.cloud
        </span>
      }
      actions={
        <Button
          type="button"
          className="bg-ink text-paper hover:bg-ink/85"
          onClick={() => {
            window.location.assign(
              `${AUTH_URL}/login?next=${encodeURIComponent(WORKSPACE_URL)}`
            );
          }}
        >
          登录
        </Button>
      }
    >
      {[
        { label: "产品", href: "/#products" },
        { label: "工作流", href: "/#workflow" },
        { label: "常见问题", href: "/#faq" },
        { label: "博客", href: "https://muzhi.zmzai.cloud", external: true },
      ].map((item) => (
        <a
          key={item.label}
          href={item.href}
          {...(item.external ? { target: "_blank", rel: "noreferrer" } : {})}
          className={navItemClass(false)}
        >
          {item.label}
        </a>
      ))}
      <Link href="/projects" className={navItemClass(pathname.startsWith("/projects"))}>
        项目
      </Link>
      <a
        href="https://github.com/Ulanxx"
        target="_blank"
        rel="noreferrer"
        className={navItemClass(false)}
      >
        GitHub
      </a>
    </NavShell>
  );
}
