import type { ReactNode } from "react";

interface SectionHeaderProps {
  /** 섹션 제목 — 도트 서체(Umdot Mono) */
  title: string;
  right?: ReactNode;
  className?: string;
}

export function SectionHeader({
  title,
  right,
  className = "",
}: SectionHeaderProps) {
  return (
    <div className={`flex items-end justify-between gap-3 ${className}`}>
      <h2 className="dot-title text-[21px] leading-none text-ink">{title}</h2>
      {right}
    </div>
  );
}
