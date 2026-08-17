"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button, Navbar } from "@zmzai/theme";

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL ?? "https://auth.zmzai.cloud";
const WORKSPACE_URL = "https://zmzai.cloud/workspace";

export function SiteHeader() {
  const pathname = usePathname() ?? "/";
  return (
    <Navbar
      badge={<span className="rounded-full border border-line px-2 py-0.5 font-mono text-[11px] text-ink-3">zmzai.cloud</span>}
      actions={
        <Button
          type="button"
          className="bg-accent text-accent-ink hover:bg-accent-strong"
          onClick={() => { window.location.assign(`${AUTH_URL}/login?next=${encodeURIComponent(WORKSPACE_URL)}`); }}
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
  );
}
