import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonTone = "pink" | "lavender" | "neutral";
export type ButtonSize = "md" | "sm";
type Tone = ButtonTone;
type Size = ButtonSize;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  tone?: Tone;
  size?: Size;
  children: ReactNode;
}

/**
 * Button (§9)
 * White 배경 + 1px 컬러 보더 + 컬러 텍스트. Black CTA / Full Pink CTA는 사용하지 않는다.
 * touch target 최소 44px (§17).
 */
const toneClass: Record<Tone, string> = {
  pink: "border-[#ff8ec7] text-brand-pink hover:bg-[#ffeef7] active:bg-[#ffdcee]",
  lavender:
    "border-[#a97cff] text-brand-lav hover:bg-[#f3ecff] active:bg-[#e6d8ff]",
  /* 더 보기처럼 강조가 필요 없는 보조 액션 */
  neutral: "border-[#d7d4da] text-[#57545e] hover:bg-[#f6f5f7] active:bg-[#eeecf0]",
};

const sizeClass: Record<Size, string> = {
  md: "min-h-[44px] px-5 text-[15px]",
  sm: "min-h-[38px] px-4 text-[14px]",
};

/** 링크(`<a>`)를 버튼처럼 보이게 할 때 쓰는 클래스 조합 */
export function buttonClass({
  tone = "pink",
  size = "md",
  className = "",
}: { tone?: Tone; size?: Size; className?: string } = {}) {
  return `inline-flex items-center justify-center gap-1.5 rounded-win border bg-white font-semibold transition-colors duration-150 ${toneClass[tone]} ${sizeClass[size]} ${className}`;
}

export function Button({
  tone = "pink",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={buttonClass({ tone, size, className })}
      {...props}
    >
      {children}
    </button>
  );
}
