"use client";

import { useState, type ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";

export interface AccordionItem {
  id: string;
  /** 접힌 상태에서 보이는 줄 */
  head: ReactNode;
  body: ReactNode;
}

/**
 * 펼침 목록 — 공지·FAQ처럼 제목만 훑다가 필요한 것만 여는 화면에 쓴다.
 * 상세 페이지를 따로 만들지 않아 목록에서 바로 읽고 닫을 수 있다.
 */
export function Accordion({ items }: { items: AccordionItem[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <ul className="divide-y divide-silver overflow-hidden rounded-win border border-line bg-white shadow-card">
      {items.map((item) => {
        const open = openId === item.id;
        return (
          <li key={item.id}>
            <button
              type="button"
              aria-expanded={open}
              onClick={() => setOpenId(open ? null : item.id)}
              className="flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors hover:bg-hover"
            >
              <span className="min-w-0 flex-1">{item.head}</span>
              <Icon
                name="chevron-right"
                size={18}
                className={`mt-0.5 shrink-0 text-ink-faint transition-transform ${
                  open ? "rotate-90" : ""
                }`}
              />
            </button>

            {open ? (
              <div className="border-t border-silver bg-silver/60 px-4 py-4 dot-text text-[14px] leading-[1.85] text-ink-body">
                {item.body}
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
