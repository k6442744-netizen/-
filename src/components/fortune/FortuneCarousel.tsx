"use client";

import { useCallback, useRef, useState } from "react";
import { FeaturedFortuneCard } from "./FeaturedFortuneCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PixelLabel } from "@/components/y2k/PixelLabel";
import { EDGE_RESISTANCE, SWIPE_TRANSITION, swipeThreshold } from "@/lib/swipe";
import type { FortuneProduct } from "@/lib/products";

const pad = (n: number) => String(n).padStart(2, "0");

/** 카드 사이 간격 (gap-3) — 한 칸 이동 거리 계산에 쓴다 */
const GAP = 12;

/**
 * Featured swipe card (§13)
 * 모바일 상품 전체를 긴 1열 목록으로 만들지 않기 위해 스와이프 캐러셀로 구성한다 (§16).
 *
 * 히어로 배너와 같은 방식 — 네이티브 스크롤 대신 트랙을 transform 으로 직접 민다.
 * 손을 따라 1:1로 붙고, 놓으면 두 캐러셀이 같은 곡선으로 넘어간다.
 * 현재 위치는 섹션 헤더 우측의 `01 / 04` 카운터가 알려준다.
 */
export function FortuneCarousel({ items }: { items: FortuneProduct[] }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const indexRef = useRef(0);
  const [index, setIndex] = useState(0);
  const last = items.length - 1;

  const drag = useRef({
    active: false,
    startX: 0,
    dx: 0,
    moved: false,
    captured: false,
  });

  const setX = useCallback((i: number, dx: number) => {
    const track = trackRef.current;
    if (!track) return;
    track.style.transform = `translateX(calc(${-i * 100}% - ${i * GAP}px + ${dx}px))`;
  }, []);

  const goTo = useCallback(
    (next: number) => {
      const track = trackRef.current;
      if (!track) return;
      const clamped = Math.max(0, Math.min(next, last));
      indexRef.current = clamped;
      setIndex(clamped);
      track.style.transition = SWIPE_TRANSITION;
      setX(clamped, 0);
    },
    [last, setX],
  );

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (items.length < 2) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const track = trackRef.current;
    if (!track) return;

    drag.current = {
      active: true,
      startX: e.clientX,
      dx: 0,
      moved: false,
      captured: false,
    };
    track.style.transition = "none";
    /* 마우스로 끌 때 이미지·텍스트가 딸려오는 기본 동작만 막는다 (click 은 그대로) */
    if (e.pointerType === "mouse") e.preventDefault();
    /* 포인터 캡처는 실제로 끌기 시작할 때 건다 — 캡처가 걸린 채 클릭하면
       click 의 대상이 카드 안 버튼이 아니라 이 트랙으로 바뀐다 */
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return;
    let dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 4 && !drag.current.moved) {
      drag.current.moved = true;
      /* 카드 밖으로 나가도 계속 따라오도록 이때부터 캡처한다 */
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
        drag.current.captured = true;
      } catch {
        /* 캡처가 안 되면 캡처 없이 진행 */
      }
    }
    /* 첫 장에서 뒤로, 마지막 장에서 앞으로 — 갈 곳이 없으면 저항을 준다 */
    const atEdge =
      (indexRef.current === 0 && dx > 0) || (indexRef.current === last && dx < 0);
    if (atEdge) dx *= EDGE_RESISTANCE;
    drag.current.dx = dx;
    setX(indexRef.current, dx);
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return;
    drag.current.active = false;
    if (drag.current.captured && e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    drag.current.captured = false;

    const threshold = swipeThreshold(e.currentTarget.clientWidth || 1);
    const { dx } = drag.current;
    if (dx <= -threshold) goTo(indexRef.current + 1);
    else if (dx >= threshold) goTo(indexRef.current - 1);
    else goTo(indexRef.current); // 임계값 미달 — 제자리로 되돌린다
  };

  /* 끌고 나서 손을 뗀 자리의 카드 링크가 눌리지 않도록 한다 */
  const handleClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!drag.current.moved) return;
    drag.current.moved = false;
    e.preventDefault();
    e.stopPropagation();
  };

  /* 화면 밖 카드의 버튼으로 탭 이동하면 그 카드를 따라 보여 준다.
     스크롤 컨테이너가 아니라 브라우저가 대신 맞춰 주지 않는다. */
  const handleFocus = (e: React.FocusEvent<HTMLUListElement>) => {
    const track = trackRef.current;
    if (!track) return;
    const card = (e.target as HTMLElement).closest("li");
    if (!card) return;
    const i = Array.prototype.indexOf.call(track.children, card);
    if (i >= 0 && i !== indexRef.current) goTo(i);
  };

  return (
    <section aria-labelledby="pick-your-fortune">
      <h2 id="pick-your-fortune" className="sr-only">
        추천운세
      </h2>
      <SectionHeader
        title="추천운세"
        right={
          <PixelLabel className="!text-[11px] text-ink-faint">
            <span className="text-ink">{pad(index + 1)}</span> /{" "}
            {pad(items.length)}
          </PixelLabel>
        }
      />

      {/* 트랙을 잘라내는 창 — 좌우로만 자르고 싶지만 overflow 는 축을 따로 못 준다.
          shadow-win 이 카드 아래로 38px(오프셋 10 + 블러 28) 뻗으므로 위아래 44px 을
          비워 두고, 그만큼 마진에서 도로 빼서 위 간격은 종전과 같은 14px(44-30)로 둔다.
          여유가 모자라면 그림자가 직선으로 잘려 띠처럼 보인다. */}
      <div
        className="-mb-11 -mt-[30px] touch-pan-y select-none overflow-hidden py-11"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={handleClickCapture}
      >
        <ul
          ref={trackRef}
          onFocus={handleFocus}
          className="flex w-full gap-3"
          style={{ transition: SWIPE_TRANSITION }}
        >
          {items.map((product) => (
            <li key={product.id} className="w-full shrink-0">
              <FeaturedFortuneCard product={product} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
