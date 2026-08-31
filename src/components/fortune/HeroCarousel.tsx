"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { asset } from "@/lib/asset";
import { SWIPE_TRANSITION, swipeThreshold } from "@/lib/swipe";

interface HeroCarouselProps {
  slides: { src: string; alt: string }[];
  /** 이미지 비율 */
  ratio: string;
  /** 자동 전환 간격(ms) */
  interval?: number;
}

/**
 * 히어로 배너 슬라이더.
 *
 * 마지막 슬라이드 뒤에 첫 슬라이드 사본을 두고, 사본까지 민 다음
 * transition 없이 원점으로 되돌린다 — 되감기 없이 한 방향으로만 순환한다.
 *
 * 자동 순환 외에 손가락/마우스 드래그와 점 인디케이터로도 넘길 수 있다.
 */
export function HeroCarousel({
  slides,
  ratio,
  interval = 4000,
}: HeroCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(0);
  const count = slides.length;
  /* 인디케이터 표시용 — 사본(index === count)은 첫 장으로 되돌려 표시한다 */
  const [current, setCurrent] = useState(0);
  /* 수동 조작 시 값을 올려 자동 전환 타이머를 처음부터 다시 돌린다 */
  const [autoplayKey, setAutoplayKey] = useState(0);

  /* 드래그 상태 — 렌더와 무관하므로 ref로만 들고 있는다 */
  const dragRef = useRef({ active: false, startX: 0, dx: 0, wrapped: false });

  const setX = useCallback((index: number, dx: number) => {
    const track = trackRef.current;
    if (!track) return;
    track.style.transform = `translateX(calc(${-index * 100}% + ${dx}px))`;
  }, []);

  const goTo = useCallback(
    (next: number) => {
      const track = trackRef.current;
      if (!track) return;
      indexRef.current = next;
      setCurrent(next % count);
      track.style.transition = SWIPE_TRANSITION;
      setX(next, 0);
    },
    [count, setX],
  );

  useEffect(() => {
    if (count < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = window.setInterval(() => {
      /* 손을 대고 있는 동안에는 자동으로 넘기지 않는다 */
      if (dragRef.current.active) return;
      goTo(indexRef.current + 1);
    }, interval);
    return () => window.clearInterval(id);
  }, [count, interval, goTo, autoplayKey]);

  /* 사본에 도달하면 애니메이션 없이 첫 장으로 되돌린다 */
  const handleTransitionEnd = () => {
    const track = trackRef.current;
    if (!track || indexRef.current !== count) return;
    track.style.transition = "none";
    track.style.transform = "translateX(0)";
    indexRef.current = 0;
    void track.offsetHeight; // reflow — 다음 전환에 transition이 다시 붙도록
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (count < 2) return;
    /* 마우스는 주 버튼만 */
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const track = trackRef.current;
    if (!track) return;

    dragRef.current = { active: true, startX: e.clientX, dx: 0, wrapped: false };
    track.style.transition = "none";
    /* 이미 놓인 포인터거나 캡처가 불가능한 상황이면 캡처 없이 진행한다 */
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* noop */
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag.active) return;
    drag.dx = e.clientX - drag.startX;

    /* 첫 장에서 오른쪽으로 당기면 뒤로 갈 자리가 없다.
       사본(index === count)은 첫 장과 같은 그림이라, 티 나지 않게
       사본 위치로 옮겨 놓고 거기서 뒤로 끌리게 한다. */
    if (!drag.wrapped && drag.dx > 0 && indexRef.current === 0) {
      drag.wrapped = true;
      indexRef.current = count;
    }

    setX(indexRef.current, drag.dx);
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag.active) return;
    drag.active = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }

    /* 뒤로 끌려고 사본까지 갔다가 도로 앞으로 민 경우.
       사본에서 다음 장으로 애니메이션하면 전체를 거슬러 훑게 되므로,
       같은 그림인 첫 장 자리로 조용히 옮겨 놓고 거기서 넘긴다. */
    const track = trackRef.current;
    if (drag.wrapped && drag.dx < 0 && track) {
      track.style.transition = "none";
      indexRef.current = 0;
      setX(0, drag.dx);
      void track.offsetHeight; // reflow
    }

    const threshold = swipeThreshold(e.currentTarget.clientWidth || 1);

    if (drag.dx <= -threshold) goTo(Math.min(indexRef.current + 1, count));
    else if (drag.dx >= threshold) goTo(Math.max(indexRef.current - 1, 0));
    else goTo(indexRef.current); // 임계값 미달 — 제자리로 되돌린다

    setAutoplayKey((k) => k + 1);
  };

  return (
    <div
      className="relative w-full touch-pan-y select-none overflow-hidden"
      style={{ aspectRatio: ratio }}
      aria-roledescription="carousel"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <div
        ref={trackRef}
        onTransitionEnd={handleTransitionEnd}
        className="flex h-full w-full"
      >
        {[...slides, slides[0]].map((slide, i) => (
          <div key={i} className="relative h-full w-full shrink-0">
            <Image
              src={asset(slide.src)}
              alt={i < count ? slide.alt : ""}
              aria-hidden={i >= count}
              fill
              priority={i === 0}
              draggable={false}
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* 컨트롤 — 배너 위에 얹는 점 인디케이터.
          배너 색이 매번 달라서 흰 점 + 옅은 그림자로 대비를 확보한다. */}
      {count > 1 && (
        <div
          /* 점을 누르는 건 드래그가 아니다 */
          onPointerDown={(e) => e.stopPropagation()}
          className="absolute inset-x-0 bottom-2 z-10 flex items-center justify-center gap-1.5"
        >
          {slides.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              aria-label={`${slide.alt} 배너 보기`}
              aria-current={i === current}
              onClick={() => {
                goTo(i);
                setAutoplayKey((k) => k + 1);
              }}
              className="flex size-6 items-center justify-center"
            >
              <span
                className={`h-[6px] rounded-full shadow-[0_1px_3px_rgba(43,27,61,0.35)] transition-all duration-200 ${
                  i === current ? "w-[16px] bg-white" : "w-[6px] bg-white/55"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
