import type { WindowTone } from "@/components/y2k/RetroWindow";
import type { Relation } from "./profiles";

/**
 * 톤에서 파생되는 색 — 카드·상세·시트가 같은 값을 쓰도록 한 곳에 모은다.
 * 새 톤 색이 필요하면 여기서만 늘린다.
 */

/** 카드/히어로 바탕 — 톤 색을 아주 옅게 */
export const paleBg: Record<WindowTone, string> = {
  pink: "bg-[#fff0f8]",
  lavender: "bg-[#f5efff]",
  blue: "bg-[#edf8ff]",
  yellow: "bg-[#fff8ea]",
};

/** 바탕 위에 깔리는 픽셀 별 색 — 같은 톤을 한 단계 진하게 */
export const starTint: Record<WindowTone, string> = {
  pink: "bg-[#ffd0e8]",
  lavender: "bg-[#ded0ff]",
  blue: "bg-[#c6e9ff]",
  yellow: "bg-[#ffe6ab]",
};

/** 레트로 윈도우 타이틀 바 */
export const barBg: Record<WindowTone, string> = {
  pink: "bg-[#ffc9e6]",
  lavender: "bg-[#ddc9ff]",
  blue: "bg-[#c4ecff]",
  yellow: "bg-[#ffe6a3]",
};

/** 라벨 글자색 */
export const toneText: Record<WindowTone, string> = {
  pink: "text-[#d1247e]",
  lavender: "text-[#6b3fc7]",
  blue: "text-[#1f7fae]",
  yellow: "text-[#9a6b12]",
};

/** 가격·상태를 얹는 띠 (레트로 윈도우의 상태 표시줄) */
export const bandBg: Record<WindowTone, string> = {
  pink: "bg-[#ffdcef]",
  lavender: "bg-[#e7daff]",
  blue: "bg-[#d6f0ff]",
  yellow: "bg-[#ffeec2]",
};

/** 상세 화면 히어로 그라데이션 */
export const heroGradient: Record<WindowTone, string> = {
  pink: "bg-[linear-gradient(180deg,#fff8fc_0%,#ffeef7_100%)]",
  lavender: "bg-[linear-gradient(180deg,#fbf8ff_0%,#f3ecff_100%)]",
  blue: "bg-[linear-gradient(180deg,#f8fdff_0%,#e6f6ff_100%)]",
  yellow: "bg-[linear-gradient(180deg,#fffdf7_0%,#fff3da_100%)]",
};

/** 버튼 톤 — Button 은 pink/lavender/neutral 만 받는다 */
export const buttonTone = (tone: WindowTone) =>
  tone === "pink" ? ("pink" as const) : ("lavender" as const);

/** 사람 목록의 이니셜 아바타 — 관계별로 색을 나눠 한눈에 구분되게 한다 */
export const relationAvatar: Record<Relation, string> = {
  self: "bg-brand-lav text-white",
  partner: "bg-brand-pink text-white",
  friend: "bg-brand-blue text-ink",
  family: "bg-[#ffe6a3] text-ink",
  other: "bg-silver-mid text-white",
};
