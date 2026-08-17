"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Button, Navbar } from "@zmzai/theme";

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL ?? "https://auth.zmzai.cloud";
const WORKSPACE_URL = "https://zmzai.cloud/workspace";

/**
 * SiteHeader — open-design.ai 式吸顶导航：
 * 顶部时全宽贴边，滚动 >16px 后收缩为浮动胶囊（圆角 + 阴影 + 左右留白）。
 * 滚动监听在消费端实现，theme Navbar 本体不动。
 */
export function SiteHeader() {
  const pathname = usePathname() ?? "/";
  const [floating, setFloating] = useState(false);

  useEffect(() => {
    const onScroll = () => setFloating(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={`nav-shell ${floating ? "floating" : ""}`}>
      <Navbar
        className="site-nav static! border-b-0!"
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
        <Link
          href="/projects"
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
            pathname.startsWith("/projects")
              ? "bg-ink text-paper"
              : "text-ink-2 hover:bg-surface-2 hover:text-ink"
          }`}
        >
          项目
        </Link>
        <a
          href="https://github.com/Ulanxx"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink"
        >
          GitHub
        </a>
      </Navbar>
    </div>
  );
}
