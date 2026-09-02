"use client";

import { useState } from "react";
import { MiniFortuneCard } from "./MiniFortuneCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { DotLabel } from "@/components/y2k/DotLabel";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import {
  categories,
  categoryEmoji,
  type Category,
  type FortuneProduct,
} from "@/lib/products";

const ALL = "전체" as const;
type Filter = typeof ALL | Category;

/** 한 번에 노출할 개수 — 모바일에서 목록이 지나치게 길어지지 않게 한다 */
const PAGE_SIZE = 8;

/**
 * Mini Window Grid (§12-4) — 전체 상품 2열 그리드 (§13 mobile-grid).
 * 카테고리 칩은 Square UI 기준 radius 2–4px를 유지한다 (§6).
 */
export function AllFortuneGrid({ items }: { items: FortuneProduct[] }) {
  const [filter, setFilter] = useState<Filter>(ALL);
  const [limit, setLimit] = useState(PAGE_SIZE);

  const matched = filter === ALL ? items : items.filter((p) => p.category === filter);
  const visible = matched.slice(0, limit);
  const rest = matched.length - visible.length;

  const changeFilter = (next: Filter) => {
    setFilter(next);
    setLimit(PAGE_SIZE);
  };

  return (
    <section aria-labelledby="all-fortune">
      <h2 id="all-fortune" className="sr-only">
        전체 운세 상품
      </h2>
      <SectionHeader
        title="전체 운세"
        right={
          <DotLabel className="text-[13px] text-ink-faint">
            총 <span className="text-ink">{matched.length}</span>개
          </DotLabel>
        }
      />

      <div
        role="tablist"
        aria-label="상품 카테고리"
        className="no-scrollbar -mx-[var(--page-padding)] mt-3.5 flex gap-1.5 overflow-x-auto px-[var(--page-padding)]"
      >
        {[ALL, ...categories].map((c) => {
          const active = filter === c;
          return (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => changeFilter(c)}
              /* 탭은 눌러야 할 영역이라 카드와 달리 경계를 남긴다. 그림자 없이 보더로만.
                 선택/비선택 높이가 어긋나지 않게 양쪽 다 1px 보더를 준다 */
              className={`h-9 shrink-0 rounded-win border px-3.5 text-[13px] font-semibold transition-colors ${
                active
                  ? "border-brand-pink bg-brand-pink text-page"
                  : "border-line bg-page text-ink-soft hover:bg-page-pink"
              }`}
            >
              {c}
              {c !== ALL ? (
                <span aria-hidden="true" className="ml-1">
                  {categoryEmoji[c]}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      <ul className="mt-3.5 grid grid-cols-2 gap-3">
        {visible.map((product) => (
          <li key={product.id}>
            <MiniFortuneCard product={product} className="h-full" />
          </li>
        ))}
      </ul>

      {rest > 0 ? (
        <Button
          variant="tertiary"
          className="mt-4 w-full"
          onClick={() => setLimit((n) => n + PAGE_SIZE)}
        >
          {rest}개 더 보기
          <Icon name="chevron-right" size={15} className="rotate-90" />
        </Button>
      ) : null}
    </section>
  );
}
