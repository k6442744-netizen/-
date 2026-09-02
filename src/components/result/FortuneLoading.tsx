import { FortuneObject, type ObjectName } from "@/components/fortune/FortuneObject";
import { PixelDecoration } from "@/components/y2k/PixelDecoration";
import { PixelLabel } from "@/components/y2k/PixelLabel";

/** 결과를 여는 동안 보여 주는 화면 — 상품 오브젝트를 그대로 이어 보여 준다 */
export function FortuneLoading({
  object = "crystal-ball",
  image,
  title = "사주를 풀이하고 있어요",
  caption = "잠시만 기다려 주세요",
}: {
  object?: ObjectName;
  image?: string;
  title?: string;
  caption?: string;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-[var(--page-padding)] py-16">
      <div className="relative">
        <PixelDecoration
          shape="sparkle"
          size={14}
          className="blink-dot absolute -left-6 top-2 text-brand-pink-soft"
        />
        <PixelDecoration
          shape="star"
          size={12}
          className="blink-dot absolute -right-5 top-8 text-brand-lav-soft"
        />
        <FortuneObject name={object} src={image} size={132} className="float-soft" />
      </div>

      <p className="mt-8 dot-title text-[18px] text-ink">{title}</p>
      <p className="mt-1.5 dot-text text-[13px] text-ink-soft">{caption}</p>

      {/* 진행 바 — 남은 시간을 정확히 알 수 없어 좌우로 훑는 형태로 둔다 */}
      <div
        aria-hidden="true"
        className="mt-6 h-1.5 w-[160px] overflow-hidden rounded-full bg-silver"
      >
        <span className="loading-sweep block h-full w-1/3 rounded-full bg-brand-pink-soft" />
      </div>

      <PixelLabel as="p" className="mt-6 text-ink-faint">
        READING YOUR FORTUNE...
      </PixelLabel>
    </div>
  );
}
