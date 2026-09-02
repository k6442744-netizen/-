"use client";

import { useState } from "react";
import { Accordion } from "./Accordion";
import { faqs, type Faq } from "@/lib/support";

const categories = ["전체", "결제", "사주정보", "결과", "이벤트"] as const;
type Filter = (typeof categories)[number];

/** 자주 묻는 질문 — 주제로 좁힌 뒤 필요한 답만 펼친다 */
export function FaqList() {
  const [filter, setFilter] = useState<Filter>("전체");
  const shown =
    filter === "전체"
      ? faqs
      : faqs.filter((f) => f.category === (filter as Faq["category"]));

  return (
    <>
      <div
        role="tablist"
        aria-label="질문 주제"
        className="no-scrollbar -mx-[var(--page-padding)] flex gap-1.5 overflow-x-auto px-[var(--page-padding)] pb-1"
      >
        {categories.map((name) => {
          const active = filter === name;
          return (
            <button
              key={name}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setFilter(name)}
              className={`min-h-[36px] shrink-0 rounded-win border px-3.5 text-[13px] font-semibold transition-colors ${
                active
                  ? "border-brand-pink bg-page-pink text-accent"
                  : "border-line bg-white text-ink-soft hover:bg-hover"
              }`}
            >
              {name}
            </button>
          );
        })}
      </div>

      <div className="mt-4">
        <Accordion
          items={shown.map((faq) => ({
            id: faq.id,
            head: (
              <>
                <span className="dot-text text-[12px] text-ink-faint">
                  {faq.category}
                </span>
                <span className="mt-0.5 block text-[15px] font-bold text-ink">
                  {faq.question}
                </span>
              </>
            ),
            body: <p>{faq.answer}</p>,
          }))}
        />
      </div>
    </>
  );
}
