import Link from "next/link";

import { projects, statusLabel } from "@/lib/projects";

export const metadata = {
  title: "项目 · zmzai cloud",
};

export default function ProjectsPage() {
  return (
    <div className="flex flex-col gap-12">
      <header className="flex flex-col gap-4">
        <p className="eyebrow">OPC · 项目索引</p>
        <h1 className="headline text-4xl">牧之做的工程</h1>
        <p className="max-w-xl text-ink/80">
          每个项目独立部署、独立仓库、共享同一套印章品牌底盘。项目可换自己的
          项目级强调色，但字体与纸感不动——集合里每个可识别，又明显是一家人。
        </p>
      </header>

      <ol className="flex flex-col divide-y divide-line border-y-2 border-rule">
        {projects.map((p, i) => (
          <li key={p.slug} className="py-8">
            <Link href={p.href} className="group grid grid-cols-[2.5rem_1fr] gap-6">
              <span className="font-mono text-sm text-muted pt-1">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <h2 className="headline text-2xl group-hover:text-accent transition-colors">
                    {p.name}
                  </h2>
                  <span className="font-mono text-[0.625rem] uppercase tracking-widest text-muted">
                    {statusLabel(p.status)}
                  </span>
                  <span className="font-mono text-xs text-muted">
                    {p.href.replace(/^https?:\/\//, "")}
                  </span>
                </div>
                <p className="text-ink">{p.tagline}</p>
                <p className="max-w-2xl text-sm text-ink/70">{p.description}</p>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
