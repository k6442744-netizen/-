"use client";

import { Accordion } from "./Accordion";
import { notices } from "@/lib/support";

/** 공지사항 — 제목만 훑다가 필요한 것만 펼쳐 읽는다 */
export function NoticeList() {
  return (
    <Accordion
      items={notices.map((notice) => ({
        id: notice.id,
        head: (
          <>
            <span className="flex items-center gap-1.5">
              {notice.pinned ? (
                <span className="shrink-0 rounded-tag bg-page-pink px-1.5 py-px text-[11px] font-bold text-accent">
                  중요
                </span>
              ) : null}
              <span className="text-[15px] font-bold text-ink">
                {notice.title}
              </span>
            </span>
            <span className="mt-1 block dot-text text-[12px] text-ink-faint">
              {notice.date}
            </span>
          </>
        ),
        body: <p className="whitespace-pre-line">{notice.body}</p>,
      }))}
    />
  );
}
