"use client";

import { FortuneObject } from "./FortuneObject";
import { RetroWindow } from "@/components/y2k/RetroWindow";
import { PixelDecoration } from "@/components/y2k/PixelDecoration";
import { Button } from "@/components/ui/Button";
import { HeartCoin } from "@/components/ui/HeartCoin";
import { Icon } from "@/components/ui/Icon";
import { usePurchase } from "@/components/purchase/PurchaseProvider";
import { bandBg, buttonTone } from "@/lib/tone";
import type { FortuneProduct } from "@/lib/products";

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
  const { labelKo, type, tone, object, name, description, hearts, image } =
    product;
  const openPurchase = usePurchase();

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
      {/* 본문은 흰 바탕 — 색은 타이틀바와 하단 가격바가 맡는다 */}
      <div className="flex items-center gap-2 bg-white px-4 pb-5 pt-5">
        <div className="flex w-[38%] shrink-0 items-center justify-center">
          <FortuneObject
            name={object}
            src={image}
            size={122}
            className="float-soft"
          />
        </div>

        <div className="min-w-0 flex-1">
          {/* 제목은 항상 한 줄로 — 폭에 맞춰 크기만 조절한다 */}
          <h3 className="dot-title whitespace-nowrap text-[clamp(17px,5vw,21px)] leading-[1.35] text-ink">
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
        className={`flex items-center justify-between gap-3 px-4 py-2 ${bandBg[tone]}`}
      >
        <p className="flex items-center gap-1.5">
          <span className="dot-text text-[18px] font-bold leading-none text-heart">
            {hearts}
          </span>
          <HeartCoin size={17} />
        </p>
        <Button
          tone={buttonTone(tone)}
          size="sm"
          onClick={() => openPurchase(product)}
        >
          보러가기
          <Icon name="arrow-right" size={15} />
        </Button>
      </div>
    </RetroWindow>
  );
}
