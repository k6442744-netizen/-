import type { ButtonHTMLAttributes, ReactNode } from "react";

/**
 * 버튼 위계 (docs/design-hierarchy.html)
 *
 * primary   그 화면이 존재하는 이유. 채운 핑크 · **화면당 하나**
 * secondary 같은 화면의 다른 유효한 선택. 흰 배경 + Primary 와 같은 색의 보더·글자
 * tertiary  흐름을 벗어나는 행동(취소·이동). 무채색
 * text      찾는 사람만 찾으면 되는 행동. 글자만
 * danger    삭제 진입. 마지막 확인 단계에서만 primary 형태로 올린다
 *
 * 위계는 색이 정하고, 높이는 놓이는 자리(size)가 정한다.
 */
export type ButtonVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "text"
  | "danger";

/** 영역 색. 위계가 아니라 화면 주제를 나타낸다 (전생 인맥 = lavender) */
export type ButtonTone = "pink" | "lavender";

/**
 * 높이는 위계가 아니라 **놓이는 자리**가 정한다.
 * cta 화면 하단 전체폭 · default 팝업 안 액션 · compact 카드 띠처럼 좁은 자리
 */
export type ButtonSize = "cta" | "default" | "compact";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  tone?: ButtonTone;
  size?: ButtonSize;
  children: ReactNode;
}

const base =
  "inline-flex items-center justify-center gap-1.5 rounded-win border font-bold transition-colors duration-150 disabled:cursor-not-allowed";

/* Primary 는 채운 면 + 흰 글자.
   면은 NEW 뱃지와 같은 브랜드 핑크(#ff4fa3) · 라벤더(#9b6bff)를 쓴다. */
const byVariant: Record<ButtonVariant, Record<ButtonTone, string>> = {
  primary: {
    pink: "border-brand-pink bg-brand-pink text-white hover:brightness-[1.06] active:brightness-95 disabled:border-line disabled:bg-silver disabled:text-ink-faint disabled:brightness-100",
    lavender:
      "border-brand-lav bg-brand-lav text-white hover:brightness-[1.06] active:brightness-95 disabled:border-line disabled:bg-silver disabled:text-ink-faint disabled:brightness-100",
  },
  secondary: {
    pink: "border-brand-pink bg-white text-brand-pink hover:bg-page-pink active:bg-[#ffdcee] disabled:border-line disabled:bg-silver disabled:text-ink-faint",
    lavender:
      "border-brand-lav bg-white text-brand-lav hover:bg-page-lav active:bg-[#e6d8ff] disabled:border-line disabled:bg-silver disabled:text-ink-faint",
  },
  tertiary: {
    pink: "border-[#d7d4da] bg-white text-[#57545e] hover:bg-hover active:bg-[#eeecf0] disabled:border-line disabled:bg-silver disabled:text-ink-faint",
    lavender:
      "border-[#d7d4da] bg-white text-[#57545e] hover:bg-hover active:bg-[#eeecf0] disabled:border-line disabled:bg-silver disabled:text-ink-faint",
  },
  text: {
    pink: "border-transparent bg-transparent text-ink-soft underline-offset-4 hover:underline disabled:text-ink-faint disabled:no-underline",
    lavender:
      "border-transparent bg-transparent text-ink-soft underline-offset-4 hover:underline disabled:text-ink-faint disabled:no-underline",
  },
  danger: {
    pink: "border-brand-pink-soft bg-white text-accent hover:bg-page-pink active:bg-[#ffdcee]",
    lavender:
      "border-brand-pink-soft bg-white text-accent hover:bg-page-pink active:bg-[#ffdcee]",
  },
};

const bySize: Record<ButtonSize, string> = {
  cta: "min-h-[52px] px-5 text-[16px]",
  default: "min-h-[44px] px-5 text-[15px]",
  compact: "min-h-[38px] px-4 text-[14px]",
};

/** 링크(`<a>`)를 버튼처럼 보이게 할 때 쓰는 클래스 조합 */
export function buttonClass({
  variant = "secondary",
  tone = "pink",
  size = "default",
  className = "",
}: {
  variant?: ButtonVariant;
  tone?: ButtonTone;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return `${base} ${byVariant[variant][tone]} ${bySize[size]} ${className}`;
}

export function Button({
  variant = "secondary",
  tone = "pink",
  size = "default",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={buttonClass({ variant, tone, size, className })}
      {...props}
    >
      {children}
    </button>
  );
}
