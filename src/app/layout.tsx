import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 议事厅",
  description: "一个多智能体辩论与总结的沉浸式 Web 应用",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}