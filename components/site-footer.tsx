import { Logo } from "@zmzai/theme";

export function SiteFooter() {
  return (
    <footer className="rule-top mt-24 border-t-2 border-rule">
      <div className="page-shell flex flex-col gap-8 py-12 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-3">
          <Logo size={40} />
          <p className="font-mono text-xs text-muted">
            zmzai.cloud · 牧之 署名
            <br />
            OPC 项目集合枢纽站
          </p>
        </div>
        <p className="max-w-xs font-mono text-xs text-muted sm:text-right">
          作者在场。不自托管即不署名。
          <br />
          Apache-2.0 · {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
