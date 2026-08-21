import { FortuneObject } from "./FortuneObject";
import { RetroWindow } from "@/components/y2k/RetroWindow";
import { PixelDecoration } from "@/components/y2k/PixelDecoration";
import { Button } from "@/components/ui/Button";
import { HeartCoin } from "@/components/ui/HeartCoin";
import { Icon } from "@/components/ui/Icon";
import type { FortuneProduct } from "@/lib/products";

const bodyTint: Record<FortuneProduct["tone"], string> = {
  pink: "from-[#ffe9f5]",
  lavender: "from-[#f0e6ff]",
  blue: "from-[#e2f5ff]",
};

/** 하단 가격·CTA 줄은 얇은 선 대신 별도 바(레트로 윈도우의 상태 표시줄)로 분리한다 */
const footerBand: Record<FortuneProduct["tone"], string> = {
  pink: "border-outline bg-[#ffeaf5]",
  lavender: "border-outline bg-[#f2e9ff]",
  blue: "border-outline bg-[#e9f7ff]",
};

/**
 * Featured Card (§8)
 * Mobile 핵심 상품. Width 100%, Visual/Text 약 50:50.
 */
export function FeaturedFortuneCard({
  product,
  className = "",
}: {
  product: FortuneProduct;
  className?: string;
}) {
  const { labelKo, type, tone, object, name, description, hearts } = product;

  return (
    <RetroWindow
      label={labelKo ?? type}
      tone={tone}
      icon={
        <PixelDecoration
          shape={tone === "lavender" ? "star" : "heart"}
          size={11}
        />
      }
      className={className}
    >
      <div
        className={`flex items-center gap-2 bg-linear-to-b px-4 pb-5 pt-5 ${bodyTint[tone]} to-white`}
      >
        <div className="flex w-[32%] shrink-0 items-center justify-center">
          <FortuneObject name={object} size={96} className="float-soft" />
        </div>

        <div className="min-w-0 flex-1">
          {/* 제목은 항상 한 줄로 — 폭에 맞춰 크기만 조절한다 */}
          <h3 className="whitespace-nowrap text-[clamp(19px,5.6vw,23px)] font-bold leading-[1.35] tracking-[-0.02em] text-ink">
            {name}
          </h3>
          {description ? (
            <p className="mt-2.5 whitespace-pre-line dot-text text-[14px] leading-[1.7] text-ink-soft">
              {description}
            </p>
          ) : null}
        </div>
      </div>

      <div
        className={`flex items-center justify-between gap-3 border-t px-4 py-2 ${footerBand[tone]}`}
      >
        <p className="flex items-center gap-1.5">
          <span className="dot-text text-[18px] font-bold leading-none text-heart">
            {hearts}
          </span>
          <HeartCoin size={17} />
        </p>
        <Button tone={tone === "pink" ? "pink" : "lavender"} size="sm">
          보러가기
          <Icon name="arrow-right" size={15} />
        </Button>
      </div>
    </RetroWindow>
  );
}
