import { FortuneObject } from "./FortuneObject";
import { RetroWindow } from "@/components/y2k/RetroWindow";
import { PixelDecoration } from "@/components/y2k/PixelDecoration";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

/** System Window (§12-5) — Message / Event / Notice / Daily Fortune */
export function FortuneMessage() {
  return (
    <RetroWindow
      label="FORTUNE MESSAGE.EXE"
      labelFont="pixel"
      tone="lavender"
      bodyClassName="bg-[linear-gradient(180deg,#ffeef7_0%,#ffffff_62%)]"
    >
      <div className="px-4 pb-5 pt-6 text-center">
        <div className="relative mx-auto w-fit">
          <FortuneObject
            name="envelope"
            src="/products/re-match.png"
            size={84}
            className="float-soft"
          />
          <PixelDecoration
            shape="sparkle"
            size={11}
            className="absolute -right-1 top-2 text-white"
          />
        </div>

        <h2 className="dot-text mt-3 text-[18px] font-bold leading-[1.45] text-ink">
          오늘의 행운이 도착했어요{" "}
          <span aria-hidden="true" className="text-brand-pink">
            ♡
          </span>
        </h2>
        <p className="dot-text mt-2 text-[14px] leading-[1.6] text-ink-soft">
          미호무녀가 전하는 오늘의 한마디
        </p>

        <Button className="dot-text mt-4 w-full">
          메시지 열기
          <Icon name="arrow-right" size={16} />
        </Button>
      </div>
    </RetroWindow>
  );
}
