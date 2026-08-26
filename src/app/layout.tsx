import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

/* Korean UI (§4-B) */
const pretendard = localFont({
  src: "../fonts/PretendardVariable.woff2",
  weight: "45 920",
  variable: "--font-pretendard-base",
  display: "swap",
});

/* 타이틀 — 카페24 PRO UP (픽셀체). 섹션·카드 제목 전용 */
const cafe24ProUp = localFont({
  src: "../fonts/Cafe24PROUP.woff2",
  variable: "--font-cafe24-proup-base",
  display: "swap",
});

/* 설명 / 부가 텍스트 + 영문 microcopy — Umdot Mono (도트 계열, 14px 기준 설계) */
const umdot = localFont({
  src: [
    { path: "../fonts/UmdotMono14.woff2", weight: "400", style: "normal" },
    { path: "../fonts/UmdotMono14-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-umdot-base",
  display: "swap",
});

/* 배포 URL — CI/배포 스크립트에서 주입한다. 없으면 로컬 dev 기준 */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3021";

const title = "FORTUNE PORTAL — 990원 사주";
const description =
  "2000년대 초 인터넷에서 발견한, 조금은 신비롭고 사랑스러운 운세 포털. 내 운명이 궁금할 때, 단돈 990원.";
/* 공유 썸네일 — 히어로 첫 배너를 OG 권장 규격(1200×630)으로 리사이즈한 것 */
const ogImage = `${siteUrl}/og.jpg`;

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
    images: [{ url: ogImage, width: 1200, height: 630, alt: "990원 사주" }],
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
        className={`${pretendard.variable} ${umdot.variable} ${cafe24ProUp.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
