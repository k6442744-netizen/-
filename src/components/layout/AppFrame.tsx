import type { ReactNode } from "react";
import { FloatingHearts } from "@/components/y2k/FloatingHearts";

/**
 * 모바일 웹 전용 프레임.
 * 최소 360px. 480px 미만(실제 폰)에서는 화면 폭을 꽉 채우고,
 * 480px 이상에서만 420px로 제한하고 테두리·그림자를 붙인다.
 */
export function AppFrame({ children }: { children: ReactNode }) {
  return (
    <div
      /* 배경 위에서 프레임이 살짝 떠 보이도록 옅은 그림자 */
      className="relative isolate mx-auto flex min-h-dvh w-full min-w-[360px] flex-col bg-page min-[480px]:max-w-[420px] min-[480px]:border-x min-[480px]:border-silver shadow-[0_0_48px_rgba(110,70,130,0.10)]"
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
