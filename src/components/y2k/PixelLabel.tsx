import type { ElementType, ReactNode } from "react";

interface PixelLabelProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
}

/**
 * Pixel / Retro label (§4-C)
 * 영문 label과 microcopy 전용. 본문과 같은 페이퍼로지를 작게·넓은 자간으로 쓴다.
 */
export function PixelLabel({
  children,
  as: Tag = "span",
  className = "",
}: PixelLabelProps) {
  return <Tag className={`pixel ${className}`}>{children}</Tag>;
}
