import type { ElementType, ReactNode } from "react";

interface CeramicLabelProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
}

/**
 * 여주 도자체 라벨.
 * 기존 Pixel Font 영문 label(§4-C)을 대체해 한글로 표기한다.
 * Pixel Font는 브랜드 워드마크·저작권 표기 등 남은 영문에만 사용한다.
 */
export function CeramicLabel({
  children,
  as: Tag = "span",
  className = "",
}: CeramicLabelProps) {
  return <Tag className={`ceramic ${className}`}>{children}</Tag>;
}
