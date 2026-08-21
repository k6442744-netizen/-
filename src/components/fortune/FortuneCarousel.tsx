"use client";

import { useCallback, useRef, useState } from "react";
import { FeaturedFortuneCard } from "./FeaturedFortuneCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PixelLabel } from "@/components/y2k/PixelLabel";
import type { FortuneProduct } from "@/lib/products";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Featured swipe card + Pagination (§13)
 * 모바일 상품 전체를 긴 1열 목록으로 만들지 않기 위해 스와이프 캐러셀로 구성한다 (§16).
 */
export function FortuneCarousel({ items }: { items: FortuneProduct[] }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);

  const goTo = useCallback((next: number) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(next, track.children.length - 1));
    const target = track.children[clamped] as HTMLElement | undefined;
    if (!target) return;
    track.scrollTo({ left: target.offsetLeft - track.offsetLeft, behavior: "smooth" });
    setIndex(clamped);
  }, []);

  const handleScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const first = track.children[0] as HTMLElement | undefined;
    const second = track.children[1] as HTMLElement | undefined;
    if (!first) return;
    const step = second ? second.offsetLeft - first.offsetLeft : first.offsetWidth;
    const next = Math.round(track.scrollLeft / step);
    setIndex(Math.max(0, Math.min(next, track.children.length - 1)));
  }, []);

  return (
    <section aria-labelledby="pick-your-fortune">
      <h2 id="pick-your-fortune" className="sr-only">
        추천운세
      </h2>
      <SectionHeader
        title="추천운세"
        right={
          <PixelLabel className="!text-[11px] text-silver-mid">
            <span className="text-ink">{pad(index + 1)}</span> / {pad(items.length)}
          </PixelLabel>
        }
      />

      <ul
        ref={trackRef}
        onScroll={handleScroll}
        className="no-scrollbar mt-3.5 flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain"
      >
        {items.map((product) => (
          <li key={product.id} className="w-full shrink-0 snap-start">
            <FeaturedFortuneCard product={product} />
          </li>
        ))}
      </ul>

      <div className="mt-4 flex items-center justify-center gap-1.5">
        {items.map((product, i) => (
          <button
            key={product.id}
            type="button"
            aria-label={`${product.name} 보기`}
            aria-current={i === index}
            onClick={() => goTo(i)}
            className="flex size-6 items-center justify-center"
          >
            <span
              className={`h-[7px] rounded-full transition-all duration-200 ${
                i === index ? "w-[18px] bg-brand-pink" : "w-[7px] bg-silver-mid/70"
              }`}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
