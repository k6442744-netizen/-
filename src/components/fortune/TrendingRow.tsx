import { MiniFortuneCard } from "./MiniFortuneCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { DotLabel } from "@/components/y2k/DotLabel";
import type { FortuneProduct } from "@/lib/products";

/**
 * Mini Window Grid (§12-4) — 모바일에서는 horizontal scroll로 노출 (§16).
 * Featured 상품과 위계가 겹치지 않도록 카드 크기를 확실히 줄인다 (§20-12).
 */
export function TrendingRow({ items }: { items: FortuneProduct[] }) {
  return (
    <section aria-labelledby="now-trending">
      <h2 id="now-trending" className="sr-only">
        지금 인기 있는 운세
      </h2>
      <SectionHeader
        title="지금 인기 운세"
        right={
          <DotLabel className="text-[13px] text-silver-mid">
            실시간 순위
          </DotLabel>
        }
      />

      {/* scroll-px 없이 snap-x를 쓰면 첫 카드가 좌측 패딩을 먹고 컨테이너 끝에 붙는다 */}
      <ul className="no-scrollbar -mx-[var(--page-padding)] mt-3.5 flex snap-x scroll-px-[var(--page-padding)] gap-2.5 overflow-x-auto px-[var(--page-padding)] pb-1">
        {items.map((product) => (
          <li key={product.id} className="w-[148px] shrink-0 snap-start">
            <MiniFortuneCard product={product} showRank className="h-full" />
          </li>
        ))}
      </ul>
    </section>
  );
}
