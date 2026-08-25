"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import type { ProductLine } from "@/lib/projects";
import { LogoutButton } from "@/components/logout-button";

const HISTORY_LIMIT = 5;
type HistoryItem = { id: string; at: string };

function readHistory(userId: string, products: ProductLine[]): HistoryItem[] {
  const productMap = new Map(products.map((product) => [product.id, product]));
  try {
    const raw = localStorage.getItem(`zmzai-hub-recent:${userId}`);
    const parsed = JSON.parse(raw ?? "[]") as unknown;
    if (!Array.isArray(parsed)) return [];
    const valid = parsed.filter((item): item is HistoryItem => {
      if (!item || typeof item !== "object") return false;
      const value = item as Partial<HistoryItem>;
      return typeof value.id === "string" && productMap.has(value.id) && typeof value.at === "string" && !Number.isNaN(Date.parse(value.at));
    }).sort((a, b) => Date.parse(b.at) - Date.parse(a.at)).slice(0, HISTORY_LIMIT);
    localStorage.setItem(`zmzai-hub-recent:${userId}`, JSON.stringify(valid));
    return valid;
  } catch {
    localStorage.removeItem(`zmzai-hub-recent:${userId}`);
    return [];
  }
}

export function WorkspaceClient({ userId, userName, products }: { userId: string; userName: string; products: ProductLine[] }) {
  const [recent, setRecent] = useState<HistoryItem[]>([]);
  useEffect(() => setRecent(readHistory(userId, products)), [userId, products]);
  const productMap = new Map(products.map((product) => [product.id, product]));
  const available = products.filter((product) => product.status === "live");
  const building = products.filter((product) => product.status !== "live");
  const markAndOpen = (product: ProductLine) => {
    const key = `zmzai-hub-recent:${userId}`;
    const next = [{ id: product.id, at: new Date().toISOString() }, ...recent].filter((item, index, items) => items.findIndex((candidate) => candidate.id === item.id) === index).slice(0, HISTORY_LIMIT);
    localStorage.setItem(key, JSON.stringify(next));
    setRecent(next);
    window.location.assign(product.href);
  };
  return <div className="flex flex-col gap-16">
    <header className="flex flex-col gap-5 border-b-2 border-rule pb-10"><div className="flex items-center justify-between gap-4"><p className="eyebrow">个人工作台 · {userName}</p><LogoutButton userId={userId} /></div><h1 className="headline max-w-3xl text-4xl sm:text-5xl">从这里，进入知末智云的 AI 产品系统。</h1><p className="max-w-2xl text-lg leading-8 text-ink/75">先用已经可用的产品。其余工程正在搭建。</p></header>
    <section className="flex flex-col gap-7"><div className="flex items-baseline justify-between gap-4"><h2 className="headline text-2xl">最近打开</h2><span className="eyebrow">本设备记录</span></div>{recent.length ? <ol className="flex flex-col divide-y divide-line border-y border-rule">{recent.map((item) => { const product = productMap.get(item.id); if (!product) return null; return <li key={product.id}><button type="button" onClick={() => markAndOpen(product)} className="group grid w-full gap-3 py-5 text-left sm:grid-cols-[5rem_1fr_auto] sm:items-baseline"><span className="font-mono text-2xl text-muted">{product.letter} · {product.hanzi}</span><span><span className="headline block text-xl transition-colors group-hover:text-accent">{product.name}</span><span className="text-sm text-ink/70">{product.tagline}</span></span><span className="font-mono text-xs text-accent-readable">再次进入 →</span></button></li>; })}</ol> : <p className="border-y border-line py-6 text-sm text-muted">打开产品后，它会出现在这里。</p>}</section>
    <section className="flex flex-col gap-7"><h2 className="headline text-2xl">现在可用</h2><ol className="flex flex-col divide-y divide-line border-y border-rule">{available.map((product) => <li key={product.id}><button type="button" onClick={() => markAndOpen(product)} className="group grid w-full gap-3 py-6 text-left sm:grid-cols-[5rem_1fr_auto] sm:items-baseline"><span className="font-mono text-2xl">{product.letter} · {product.hanzi}</span><span><span className="headline block text-xl transition-colors group-hover:text-accent">{product.name}</span><span className="text-ink/70">{product.tagline}</span></span><span className="font-mono text-xs text-accent-readable">进入产品 →</span></button></li>)}</ol></section>
    <section className="flex flex-col gap-7"><h2 className="headline text-2xl">正在建设</h2><ol className="flex flex-col divide-y divide-line border-y border-line">{building.map((product) => <li key={product.id} className="grid gap-3 py-6 sm:grid-cols-[5rem_1fr_auto] sm:items-baseline"><span className="font-mono text-2xl text-muted">{product.letter} · {product.hanzi}</span><span><span className="headline block text-xl">{product.name}</span><span className="text-ink/70">{product.tagline}</span></span><span className="font-mono text-xs text-muted">{product.status === "planned" ? "计划中" : "建设中"}</span></li>)}</ol></section>
    <section className="rule-top flex flex-col gap-6 pt-12"><h2 className="headline text-2xl">完整产品矩阵</h2><p className="max-w-2xl text-ink/70">五个字母是知末智云名字的拆解。每条产品线独立运行，沿着同一个入口逐步展开。</p><Link href="/projects" className="font-mono text-sm text-accent-readable underline underline-offset-4">查看全部项目 →</Link></section>
  </div>;
}
