import type { Metadata, Viewport } from "next";
import { Silkscreen } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

/* Korean UI (§4-B) */
const pretendard = localFont({
  src: "../fonts/PretendardVariable.woff2",
  weight: "45 920",
  variable: "--font-pretendard-base",
  display: "swap",
});

/* Display / Hero (§4-A) — Chrome 타이포용 헤비 한글 디스플레이 */
const jalnan = localFont({
  src: "../fonts/Jalnan.woff",
  variable: "--font-jalnan-base",
  display: "swap",
});

/* Label / Retro (여주 도자체) — 섹션·윈도우 한글 라벨용 */
const yeoju = localFont({
  src: "../fonts/YeojuCeramic.woff2",
  variable: "--font-yeoju-base",
  display: "swap",
});

/* 상품 카드 짧은 타이틀 — Y유니버스 B */
const yuniverse = localFont({
  src: "../fonts/YUniverse-B.woff2",
  variable: "--font-yuniverse-base",
  display: "swap",
});

/* 설명 / 부가 텍스트 — Umdot Mono (도트 계열, 14px 기준으로 설계된 폰트) */
const umdot = localFont({
  src: [
    { path: "../fonts/UmdotMono14.woff2", weight: "400", style: "normal" },
    { path: "../fonts/UmdotMono14-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-umdot-base",
  display: "swap",
});

/* Pixel / Retro (§4-C) — 남은 영문 microcopy 전용 */
const silkscreen = Silkscreen({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-silkscreen-base",
  display: "swap",
});

/* 배포 URL — CI/배포 스크립트에서 주입한다. 없으면 로컬 dev 기준 */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3021";

const title = "FORTUNE PORTAL — 990원 사주";
const description =
  "2000년대 초 인터넷에서 발견한, 조금은 신비롭고 사랑스러운 운세 포털. 내 운명이 궁금할 때, 단돈 990원.";
/* 히어로 첫 배너를 공유 썸네일로 사용 */
const ogImage = `${siteUrl}/hero.png`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "FORTUNE PORTAL",
    title,
    description,
    url: siteUrl,
    images: [{ url: ogImage, width: 1548, height: 1016, alt: "990원 사주" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [ogImage],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FFFFFF",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body
        className={`${pretendard.variable} ${jalnan.variable} ${yeoju.variable} ${umdot.variable} ${yuniverse.variable} ${silkscreen.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
