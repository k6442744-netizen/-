"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";
import { asset } from "@/lib/asset";

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
 */
export function HeroCarousel({
  slides,
  ratio,
  interval = 4000,
}: HeroCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(0);
  const count = slides.length;

  const goTo = useCallback((next: number) => {
    const track = trackRef.current;
    if (!track) return;
    indexRef.current = next;
    track.style.transition = "transform 620ms cubic-bezier(0.4, 0, 0.2, 1)";
    track.style.transform = `translateX(-${next * 100}%)`;
  }, []);

  useEffect(() => {
    if (count < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = window.setInterval(() => {
      goTo(indexRef.current + 1);
    }, interval);
    return () => window.clearInterval(id);
  }, [count, interval, goTo]);

  /* 사본에 도달하면 애니메이션 없이 첫 장으로 되돌린다 */
  const handleTransitionEnd = () => {
    const track = trackRef.current;
    if (!track || indexRef.current !== count) return;
    track.style.transition = "none";
    track.style.transform = "translateX(0)";
    indexRef.current = 0;
    void track.offsetHeight; // reflow — 다음 전환에 transition이 다시 붙도록
  };

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ aspectRatio: ratio }}
      aria-roledescription="carousel"
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
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
