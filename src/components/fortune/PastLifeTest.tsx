import Link from "next/link";
import { FortuneObject } from "./FortuneObject";
import { RetroWindow } from "@/components/y2k/RetroWindow";
import { PixelDecoration } from "@/components/y2k/PixelDecoration";
import { buttonClass } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

/**
 * System Window (§12-5) — 이벤트 자리.
 *
 * 상품이 아니라 무료 참여형 이벤트라 구매 팝업을 쓰지 않고
 * 전용 화면(`/past-life`)으로 따로 뺀다.
 */
export function PastLifeTest() {
  return (
    <RetroWindow
      label="PAST LIFE.EXE"
      labelFont="pixel"
      tone="lavender"
      bodyClassName="bg-[linear-gradient(180deg,#f3ecff_0%,#ffffff_62%)]"
    >
      <div className="px-4 pb-5 pt-6 text-center">
        <div className="relative mx-auto w-fit">
          <FortuneObject
            name="butterfly"
            src="/objects/butterfly.png"
            size={84}
            className="float-soft"
          />
          <PixelDecoration
            shape="sparkle"
            size={11}
            className="absolute -right-1 top-2 text-white"
          />
        </div>

        <p className="mt-3">
          <span className="rounded-full bg-brand-lav px-2.5 py-1 text-[11px] font-bold text-white">
            무료 이벤트
          </span>
        </p>

        <h2 className="dot-text mt-2.5 text-[18px] font-bold leading-[1.45] text-ink">
          전생관계 판별기{" "}
          <span aria-hidden="true" className="text-brand-lav">
            ♡
          </span>
        </h2>
        <p className="dot-text mt-2 text-[14px] leading-[1.6] text-ink-soft">
          친구들과 나의 전생관계를 들여다 보세요!
        </p>

        <Link
          href="/past-life"
          className={buttonClass({
            tone: "lavender",
            className: "dot-text mt-4 w-full",
          })}
        >
          내 링크 만들기
          <Icon name="arrow-right" size={16} />
        </Link>
      </div>
    </RetroWindow>
  );
}
