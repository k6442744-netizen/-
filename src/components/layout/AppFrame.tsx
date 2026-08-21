import type { ReactNode } from "react";
import { FloatingHearts } from "@/components/y2k/FloatingHearts";

/**
 * 모바일 웹 전용 프레임.
 * 최소 360px / 최대 420px — 그 이상 넓어지지 않고 가운데 정렬된다.
 */
export function AppFrame({ children }: { children: ReactNode }) {
  return (
    <div
      /* 배경 위에서 프레임이 살짝 떠 보이도록 옅은 그림자 */
      className="relative isolate mx-auto flex min-h-dvh w-full min-w-[360px] max-w-[420px] flex-col border-x border-silver bg-page shadow-[0_0_48px_rgba(110,70,130,0.10)]"
    >
      <FloatingHearts />

      {/* 콘텐츠는 하트 레이어 위에 */}
      <div className="relative z-10 flex flex-1 flex-col">{children}</div>
    </div>
  );
}

/** 페이지 좌우 패딩 (§5: Mobile page padding 20px) */
export function Padded({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`px-[var(--page-padding)] ${className}`}>{children}</div>
  );
}
