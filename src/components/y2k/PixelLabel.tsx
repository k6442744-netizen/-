import type { ElementType, ReactNode } from "react";

interface PixelLabelProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
}

/**
 * Pixel / Retro label (§4-C)
 * 영문 label과 microcopy에만 사용. 본문·중요 정보에는 사용하지 않는다.
 */
export function PixelLabel({
  children,
  as: Tag = "span",
  className = "",
}: PixelLabelProps) {
  return <Tag className={`pixel ${className}`}>{children}</Tag>;
}
