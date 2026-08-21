import { FortuneObject } from "./FortuneObject";
import { CeramicLabel } from "@/components/y2k/CeramicLabel";
import { HeartCoin } from "@/components/ui/HeartCoin";
import type { FortuneProduct } from "@/lib/products";

const tint: Record<FortuneProduct["tone"], string> = {
  pink: "bg-[#ffe9f5]",
  lavender: "bg-[#f0e6ff]",
  blue: "bg-[#e2f5ff]",
};

const labelColor: Record<FortuneProduct["tone"], string> = {
  pink: "text-[#d1247e]",
  lavender: "text-[#6b3fc7]",
  blue: "text-[#1f7fae]",
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
      className={`group flex flex-col overflow-hidden rounded-win border border-outline bg-white transition-colors hover:border-brand-pink ${className}`}
    >
      {/* 타이틀이 위, 이미지가 아래 — 이미지 칸을 길게 잡아 둘 다 들어가게 한다 */}
      <div
        className={`relative flex h-[142px] flex-col items-center gap-1 pt-5 ${tint[tone]}`}
      >
        {showRank && rank ? (
          <CeramicLabel
            className={`absolute left-2.5 top-2 z-10 text-[12px] ${labelColor[tone]}`}
          >
            {rank}위
          </CeramicLabel>
        ) : null}

        <span className="title-y text-[27px] leading-none text-ink">{short}</span>

        <span className="relative flex w-full flex-1 items-center justify-center">
          <FortuneObject name={object} src={image} size={74} />
        </span>
      </div>

      <div className="flex flex-1 flex-col border-t border-outline px-3 pb-3 pt-2.5">
        <CeramicLabel className={`text-[11px] ${labelColor[tone]}`}>{type}</CeramicLabel>
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
