/* eslint-disable @next/next/no-img-element */

import type { ReactNode } from "react";
import { asset } from "@/lib/asset";
import type { PayMethodId } from "@/lib/payment";

/**
 * 결제수단 마크.
 *
 * 간편결제 셋은 각 사업자가 배포하는 **공식 로고 파일을 그대로** 쓴다
 * (`public/pay/`). 브랜드 가이드가 형태·비율·색을 고정하므로 다시 그리지 않는다.
 * - 카카오페이 · 파트너센터 결제수단 로고
 * - 네이버페이 · 개발자센터 npayLogos
 * - 토스페이 · 브랜드 리소스 센터 TossPay Logo Button Type
 *
 * 파일은 어느 것도 자르거나 색을 바꾸지 않았다. 비율 유지 축소만 했다.
 * 네이버페이는 20px 이하에서 스몰 로고를 쓰도록 규정하고 있어 22px 로 둔다.
 *
 * 카드처럼 사업자 마크가 없는 항목만 우리 아이콘으로 그린다.
 */
const logos: Partial<Record<PayMethodId, { src: string; height: number }>> = {
  kakaopay: { src: "/pay/kakaopay.png", height: 22 },
  naverpay: { src: "/pay/naverpay.svg", height: 22 },
  tosspay: { src: "/pay/tosspay.png", height: 22 },
};

/** 로고 파일이 있으면 그 이미지를, 없으면 null (호출부가 텍스트로 처리) */
export function payMethodLogo(id: PayMethodId, label: string): ReactNode {
  const logo = logos[id];
  if (!logo) return null;

  return (
    <img
      src={asset(logo.src)}
      alt={label}
      height={logo.height}
      style={{ height: logo.height }}
      className="w-auto shrink-0"
    />
  );
}

/** 카드 — 사업자 마크가 없어 우리 선 아이콘으로 그린다 */
export function cardMark() {
  return (
    <span className="flex size-7 shrink-0 items-center justify-center rounded-tag border border-line bg-white text-ink-soft">
      <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true">
        <rect
          x="3"
          y="6"
          width="18"
          height="12"
          rx="2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path d="M3 10h18" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M6.5 14.5h3"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}
