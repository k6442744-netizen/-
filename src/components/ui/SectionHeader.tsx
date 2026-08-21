import type { ReactNode } from "react";
import { PixelDecoration } from "@/components/y2k/PixelDecoration";
import { CeramicLabel } from "@/components/y2k/CeramicLabel";

interface SectionHeaderProps {
  /** 섹션 제목 (한글, 여주 도자체) */
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
      <h2 className="flex items-center gap-1">
        <CeramicLabel className="text-[17px] leading-none text-ink">
          {title}
        </CeramicLabel>
        <PixelDecoration shape="sparkle" size={10} className="mb-1 text-brand-pink-soft" />
      </h2>
      {right}
    </div>
  );
}
