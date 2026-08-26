import type { ElementType, ReactNode } from "react";

interface DotLabelProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
}

/**
 * 짧은 라벨(§4-C) — 윈도우 라벨, 상품 종류, 섹션 우측 보조 텍스트.
 * 서체는 본문과 같은 Umdot Mono이고 자간만 라벨용으로 벌려 둔다(.dot-label).
 */
export function DotLabel({
  children,
  as: Tag = "span",
  className = "",
}: DotLabelProps) {
  return <Tag className={`dot-label ${className}`}>{children}</Tag>;
}
