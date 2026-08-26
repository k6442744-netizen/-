import { FortuneObject } from "./FortuneObject";
import { DotLabel } from "@/components/y2k/DotLabel";
import { HeartCoin } from "@/components/ui/HeartCoin";
import type { FortuneProduct } from "@/lib/products";

/** 카드 배경 — 톤 색을 아주 옅게 깐다. 별 패턴이 이 위에 얹힌다 */
const pale: Record<FortuneProduct["tone"], string> = {
  pink: "bg-[#fff0f8]",
  lavender: "bg-[#f5efff]",
  blue: "bg-[#edf8ff]",
  yellow: "bg-[#fff8ea]",
};

/** 배경 위에 깔리는 픽셀 별 색 — 같은 톤을 한 단계 진하게 */
const starTint: Record<FortuneProduct["tone"], string> = {
  pink: "bg-[#ffd0e8]",
  lavender: "bg-[#ded0ff]",
  blue: "bg-[#c6e9ff]",
  yellow: "bg-[#ffe6ab]",
};

const labelColor: Record<FortuneProduct["tone"], string> = {
  pink: "text-[#d1247e]",
  lavender: "text-[#6b3fc7]",
  blue: "text-[#1f7fae]",
  yellow: "text-[#9a6b12]",
};

/**
 * Mini Card (§8)
 * Image 55% / Text 45%. 긴 설명은 넣지 않는다.
 * Retro Window 문법은 Featured / System Window에만 쓰고 여기서는 반복하지 않는다 (§7).
 */
export function MiniFortuneCard({
  product,
  showRank = false,
  className = "",
}: {
  product: FortuneProduct;
  /** NOW TRENDING에서만 순위를 노출한다 */
  showRank?: boolean;
  className?: string;
}) {
  const { type, tone, object, name, hearts, rank, image, short } = product;

  return (
    <a
      href="#"
      className={`group flex flex-col overflow-hidden rounded-win border border-line bg-white shadow-card transition-shadow hover:shadow-win ${className}`}
    >
      {/* 타이틀이 위, 이미지가 아래 — 이미지 칸을 길게 잡아 둘 다 들어가게 한다 */}
      <div
        className={`relative flex h-[142px] flex-col items-center gap-1 pt-5 ${pale[tone]}`}
      >
        <span
          aria-hidden="true"
          className={`pixel-stars pointer-events-none absolute inset-0 ${starTint[tone]}`}
        />

        {showRank && rank ? (
          <span
            className={`dot-title absolute left-2.5 top-2 z-10 text-[14px] leading-none ${labelColor[tone]}`}
          >
            {rank}위
          </span>
        ) : null}

        <span className="dot-title relative text-[24px] leading-none text-ink">
          {short}
        </span>

        <span className="relative flex w-full flex-1 items-center justify-center">
          <FortuneObject name={object} src={image} size={74} />
        </span>
      </div>

      <div className="flex flex-1 flex-col px-3 pb-3 pt-2.5">
        <DotLabel className={`text-[11px] ${labelColor[tone]}`}>{type}</DotLabel>
        <p className="mt-1.5 dot-text text-[14px] font-bold leading-[1.45] text-ink">
          {name}
        </p>
        <p className="mt-auto flex items-center gap-1 pt-2.5">
          <span className="dot-text text-[15px] font-bold leading-none text-heart">
            {hearts}
          </span>
          <HeartCoin size={14} />
        </p>
      </div>
    </a>
  );
}
