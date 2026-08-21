import { HeroCarousel } from "./HeroCarousel";
import { CeramicLabel } from "@/components/y2k/CeramicLabel";
import { PixelDecoration } from "@/components/y2k/PixelDecoration";
import { PixelLabel } from "@/components/y2k/PixelLabel";

export interface HeroSlide {
  src: string;
  alt: string;
}

interface FortuneHeroProps {
  /** 배너 이미지 목록. 2장 이상이면 자동으로 순환한다 */
  slides?: HeroSlide[];
  /** 이미지 비율 — 기본 8:5 */
  ratio?: string;
  /** 자동 전환 간격(ms) */
  interval?: number;
}

/**
 * Hero (§15)
 * 배너 이미지 한 장(또는 여러 장의 슬라이드)으로 구성한다.
 * 에셋이 없으면 자리만 유지한다 (§20-13).
 */
export function FortuneHero({
  slides,
  ratio = "8/5",
  interval,
}: FortuneHeroProps) {
  return (
    <section
      aria-label="이벤트 배너"
      className="border-b border-silver bg-page-pink"
    >
      {slides?.length ? (
        <HeroCarousel slides={slides} ratio={ratio} interval={interval} />
      ) : (
        <div
          className="flex w-full flex-col items-center justify-center gap-2 bg-[linear-gradient(180deg,#fff8fc_0%,#ffe6f4_100%)]"
          style={{ aspectRatio: ratio }}
        >
          <PixelDecoration shape="sparkle" size={16} className="text-brand-pink-soft" />
          <CeramicLabel className="text-[14px] text-silver-mid">
            히어로 이미지 영역
          </CeramicLabel>
          <PixelLabel className="!text-[9px] text-silver-mid/70">
            840 × 525 @2x
          </PixelLabel>
        </div>
      )}
    </section>
  );
}
