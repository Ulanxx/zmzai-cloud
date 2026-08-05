import Link from "next/link";

import { Wordmark } from "@/components/wordmark";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b-2 border-rule bg-paper">
      <div className="page-shell flex h-16 items-center justify-between gap-6">
        <Link href="/" className="focus-ring inline-flex items-baseline">
          <Wordmark />
        </Link>
        <nav aria-label="主导航" className="flex items-center gap-6 font-mono text-sm">
          <Link
            className="focus-ring transition-colors hover:text-muted"
            href="/projects"
          >
            项目
          </Link>
          <Link
            className="focus-ring transition-colors hover:text-muted"
            href="https://github.com/muzhi"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </Link>
        </nav>
      </div>
    </header>
  );
}
