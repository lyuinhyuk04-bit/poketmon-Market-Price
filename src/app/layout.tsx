import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PokePrice - 포켓몬 카드 실시간 시세 분석 트래커",
  description: "국내외 포켓몬 카드 실시간 거래 시세와 등급별 비교표를 실시간 트래킹하세요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Tailwind CSS v4 Browser Engine Fallback */}
        <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4" defer></script>
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
