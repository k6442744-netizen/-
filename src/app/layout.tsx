import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

/* 전체 서체 — 페이퍼로지(Paperlogy). 제목·본문·라벨을 한 서체로 통일한다 (§4) */
const paperlogy = localFont({
  src: [
    { path: "../fonts/Paperlogy-4Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/Paperlogy-5Medium.woff2", weight: "500", style: "normal" },
    { path: "../fonts/Paperlogy-6SemiBold.woff2", weight: "600", style: "normal" },
    { path: "../fonts/Paperlogy-7Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-paperlogy-base",
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
        className={`${paperlogy.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
