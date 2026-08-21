import type { ReactNode } from "react";

/**
 * 모바일 웹 전용 프레임.
 * 최소 360px / 최대 420px — 그 이상 넓어지지 않고 가운데 정렬된다.
 */
export function AppFrame({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex min-h-dvh w-full min-w-[360px] max-w-[420px] flex-col border-x border-silver bg-page">
      {children}
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
