import type { ReactNode } from "react";

export type ProviderId = "kakao" | "naver" | "google" | "apple";

export interface Provider {
  id: ProviderId;
  /** 버튼 문구 */
  label: string;
  /** 스크린리더/알림용 짧은 이름 */
  name: string;
  /** 전체 폭 버튼 스타일 — 각 사업자 브랜드 가이드를 따른다 */
  className: string;
  /** 아이콘 버튼 스타일 */
  iconClassName: string;
  logo: ReactNode;
}

const KakaoLogo = (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="currentColor"
      d="M12 3.5c-5 0-9 3.15-9 7.04 0 2.5 1.66 4.7 4.15 5.95l-.9 3.3c-.1.35.29.63.6.43l3.96-2.6c.39.04.79.06 1.19.06 5 0 9-3.15 9-7.04S17 3.5 12 3.5Z"
    />
  </svg>
);

const NaverLogo = (
  <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="currentColor" d="M4 4h5.6l5.1 7.6V4H20v16h-5.6L9.3 12.3V20H4V4Z" />
  </svg>
);

const GoogleLogo = (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.57c2.08-1.92 3.27-4.74 3.27-8.09Z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.28-1.93-6.15-4.52H2.18v2.84A11 11 0 0 0 12 23Z"
    />
    <path
      fill="#FBBC05"
      d="M5.85 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.67-2.84Z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1a11 11 0 0 0-9.82 6.05l3.67 2.84C6.72 7.3 9.14 5.38 12 5.38Z"
    />
  </svg>
);

const AppleLogo = (
  <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="currentColor"
      d="M16.3 12.7c0-2.4 1.96-3.55 2.05-3.6-1.12-1.63-2.85-1.86-3.47-1.88-1.48-.15-2.88.87-3.63.87-.75 0-1.9-.85-3.13-.83-1.6.02-3.08.93-3.9 2.36-1.66 2.88-.42 7.15 1.2 9.49.79 1.15 1.74 2.43 2.98 2.38 1.2-.05 1.65-.77 3.1-.77 1.44 0 1.85.77 3.11.75 1.28-.02 2.1-1.16 2.89-2.32.91-1.33 1.29-2.62 1.31-2.69-.03-.01-2.5-.96-2.51-3.76ZM13.9 5.6c.66-.8 1.1-1.9.98-3-.95.04-2.1.63-2.78 1.42-.61.7-1.14 1.83-1 2.91 1.06.08 2.14-.54 2.8-1.33Z"
    />
  </svg>
);

/**
 * 간편 로그인 제공자.
 * 브랜드 가이드상 색/로고가 고정되므로 팔레트 예외로 두되,
 * 형태(높이 52px · radius 3px · 1px border)는 디자인 시스템을 따른다 (§6, §9).
 */
export const providers: Provider[] = [
  {
    id: "kakao",
    label: "카카오로 시작하기",
    name: "카카오",
    className:
      "border-[#e5cf00] bg-kakao text-kakao-ink hover:brightness-[0.97]",
    iconClassName: "border-[#e5cf00] bg-kakao text-kakao-ink",
    logo: KakaoLogo,
  },
  {
    id: "naver",
    label: "네이버로 시작하기",
    name: "네이버",
    className: "border-[#02a94c] bg-naver text-white hover:brightness-[0.96]",
    iconClassName: "border-[#02a94c] bg-naver text-white hover:brightness-[0.96]",
    logo: NaverLogo,
  },
  {
    id: "google",
    label: "Google로 시작하기",
    name: "Google",
    className: "border-line bg-white text-ink hover:bg-[#faf5fd]",
    iconClassName: "border-line bg-white text-ink hover:bg-[#faf5fd]",
    logo: GoogleLogo,
  },
  {
    id: "apple",
    label: "Apple로 시작하기",
    name: "Apple",
    /* Apple 가이드의 화이트 변형 — 디자인 시스템의 Black CTA 금지(§9)와도 충돌하지 않는다 */
    className: "border-[#1c1c1e] bg-white text-[#1c1c1e] hover:bg-[#f6f5f7]",
    iconClassName: "border-[#1c1c1e] bg-white text-[#1c1c1e] hover:bg-[#f6f5f7]",
    logo: AppleLogo,
  },
];
