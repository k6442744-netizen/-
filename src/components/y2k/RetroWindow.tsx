import type { ReactNode } from "react";
import { DotLabel } from "./DotLabel";
import { PixelLabel } from "./PixelLabel";

export type WindowTone = "pink" | "lavender" | "blue" | "yellow";

interface RetroWindowProps {
  /** 윈도우 라벨 */
  label: string;
  /** 라벨 폰트 — 기본은 라벨용 자간, 영문 .EXE 창은 픽셀 microcopy 크기 */
  labelFont?: "label" | "pixel";
  tone?: WindowTone;
  /** label 왼쪽 작은 장식 아이콘 */
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}

const tone: Record<WindowTone, { bar: string; label: string }> = {
  pink: { bar: "bg-[#ffc9e6]", label: "text-[#d1247e]" },
  lavender: { bar: "bg-[#ddc9ff]", label: "text-[#6b3fc7]" },
  blue: { bar: "bg-[#c4ecff]", label: "text-[#1f7fae]" },
  yellow: { bar: "bg-[#ffe6a3]", label: "text-[#9a6b12]" },
};

/**
 * Signature Component — Retro Window (§7)
 * 상품 / Fortune Message / Event / 특별 콘텐츠에만 사용하고 모든 섹션에 남발하지 않는다.
 * 우측 `_ □ ×`는 장식이므로 실제 버튼과 구분되도록 aria-hidden 처리한다 (§17).
 */
export function RetroWindow({
  label,
  labelFont = "label",
  tone: toneName = "pink",
  icon,
  children,
  className = "",
  bodyClassName = "",
}: RetroWindowProps) {
  const t = tone[toneName];

  return (
    <section
      className={`overflow-hidden rounded-win border border-line bg-white shadow-win ${className}`}
    >
      <div
        className={`flex h-[34px] items-center justify-between gap-2 ${t.bar} pl-2.5 pr-2`}
      >
        <div className="flex min-w-0 items-center gap-1.5">
          {icon ? (
            <span aria-hidden="true" className={t.label}>
              {icon}
            </span>
          ) : null}
          {labelFont === "pixel" ? (
            <PixelLabel className={`truncate !text-[11px] ${t.label}`}>
              {label}
            </PixelLabel>
          ) : (
            <DotLabel className={`truncate text-[13px] ${t.label}`}>
              {label}
            </DotLabel>
          )}
        </div>
        <WindowControls />
      </div>
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}

/** 장식용 `_ □ ×` (기능 없음) */
function WindowControls() {
  return (
    <span aria-hidden="true" className="flex shrink-0 items-center gap-[3px]">
      {["–", "□", "×"].map((glyph, i) => (
        <span
          key={i}
          className="flex h-[13px] w-[14px] items-center justify-center rounded-[1px] bg-white text-[9px] leading-none text-ink"
        >
          {glyph}
        </span>
      ))}
    </span>
  );
}
