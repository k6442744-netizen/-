import Image from "next/image";
import { asset } from "@/lib/asset";
import { CeramicLabel } from "@/components/y2k/CeramicLabel";
import { PixelDecoration } from "@/components/y2k/PixelDecoration";
import { PixelLabel } from "@/components/y2k/PixelLabel";

interface FortuneHeroProps {
  /** 히어로 이미지 경로 (예: "/hero.png"). 없으면 자리만 유지한다 (§20-13) */
  src?: string;
  alt?: string;
  /** 이미지 비율 — 기본 8:5 */
  ratio?: string;
}

/**
 * Hero (§15)
 * 텍스트/오브젝트를 이미지 한 장으로 대체하는 구성.
 * 에셋이 준비되면 `src`만 넘기면 된다.
 */
export function FortuneHero({
  src,
  alt = "FORTUNE PORTAL 990원 사주",
  ratio = "8/5",
}: FortuneHeroProps) {
  return (
    <section
      aria-label="이벤트 배너"
      className="border-b border-silver bg-page-pink"
    >
      {src ? (
        <div className="relative w-full" style={{ aspectRatio: ratio }}>
          {/* unoptimized 이미지에는 basePath가 자동으로 붙지 않는다 */}
          <Image
            src={asset(src)}
            alt={alt}
            fill
            priority
            className="object-cover"
          />
        </div>
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
