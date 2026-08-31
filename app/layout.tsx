import type { Metadata, Viewport } from "next";
import { Noto_Serif_SC, JetBrains_Mono } from "next/font/google";

import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getCurrentUser } from "@/providers/auth/session";

// 依赖 session cookie，必须每次动态渲染，避免缓存未登录状态的页面
export const dynamic = "force-dynamic";

const serif = Noto_Serif_SC({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-serif",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Folio · 知末智云的 AI 产品系统",
  description: "Relay、Sandbox、Agent、Muzhi——各自独立运行，从同一个入口出发。一个账号，打通 AI 开发全链路。",
  openGraph: {
    title: "Folio · 知末智云的 AI 产品系统",
    description: "Relay、Sandbox、Agent、Muzhi——各自独立运行，从同一个入口出发。一个账号，打通 AI 开发全链路。",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  return (
    <html lang="zh-CN" className={`${serif.variable} ${mono.variable}`}>
      <body>
        <SiteHeader isAuthenticated={Boolean(user)} />
        <main className="page-shell py-16">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
