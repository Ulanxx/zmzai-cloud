import type { Metadata, Viewport } from "next";
import { Noto_Serif_SC, JetBrains_Mono } from "next/font/google";

import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

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
  title: "zmzai cloud · 牧之",
  description: "牧之的云 — OPC 项目集合枢纽站",
  openGraph: {
    title: "zmzai cloud · 牧之",
    description: "牧之的云 — OPC 项目集合枢纽站",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#F4EFE6",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className={`${serif.variable} ${mono.variable}`}>
      <body>
        <SiteHeader />
        <main className="page-shell py-16">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
