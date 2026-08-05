import Link from "next/link";

import { allProducts, statusLabel } from "@/lib/projects";

export const metadata = {
  title: "产品线 · zmzai cloud",
};

export default function ProjectsPage() {
  return (
    <div className="flex flex-col gap-12">
      <header className="flex flex-col gap-4">
        <p className="eyebrow">z·m·z·a·i · 产品矩阵</p>
        <h1 className="headline text-4xl">牧之的云里的工程</h1>
        <p className="max-w-2xl text-ink/80">
          每个产品独立部署、独立仓库，共享同一套印章品牌底盘。「牧之」拼音拆成
          z·m·z·a·i 五个字母，每个字母挂一条 AI 产品线；muzhi 本体是博客与付费
          知识体系。项目可换自己的项目级强调色，但字体与纸感不动——集合里每个
          可识别，又明显是一家人。
        </p>
      </header>

      <ol className="flex flex-col divide-y divide-line border-y-2 border-rule">
        {allProducts.map((p, i) => (
          <li key={`${p.letter}-${i}`} className="py-8">
            <Link href={p.href} className="group grid grid-cols-[5rem_1fr] items-baseline gap-6">
              <span className="flex items-baseline gap-3">
                <span className="font-mono text-3xl font-bold uppercase text-ink transition-colors group-hover:text-accent">
                  {p.letter}
                </span>
                <span className="font-serif text-lg text-muted">{p.hanzi}</span>
              </span>
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <h2 className="headline text-2xl transition-colors group-hover:text-accent">
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
                <p className="max-w-2xl text-sm leading-7 text-ink/70">{p.description}</p>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
