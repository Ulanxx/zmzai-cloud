import { Logo } from "@zmzai/theme";

export function SiteFooter() {
  return (
    <footer className="border-t border-line mt-24">
      <div className="page-shell flex flex-col gap-8 py-12 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-3">
          <Logo size={32} />
          <p className="font-mono text-xs text-muted">
            zmzai.cloud
            <br />
            牧之的 AI 产品系统
          </p>
        </div>
        <p className="max-w-xs font-mono text-xs text-muted sm:text-right">
          Apache-2.0 · {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
