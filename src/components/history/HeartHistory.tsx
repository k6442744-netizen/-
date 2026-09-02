"use client";

import { useState } from "react";
import Link from "next/link";
import { HeartCoin } from "@/components/ui/HeartCoin";
import { buttonClass } from "@/components/ui/Button";
import { DotLabel } from "@/components/y2k/DotLabel";
import { useLedger, type LedgerEntry } from "@/lib/ledger";
import { useHydrated } from "@/lib/store";
import { findProduct } from "@/lib/products";

const filters = [
  ["all", "전체"],
  ["charge", "충전"],
  ["spend", "사용"],
] as const;

type Filter = (typeof filters)[number][0];

const formatWhen = (at: number) => {
  const date = new Date(at);
  const day = date.toLocaleDateString("ko-KR", {
    month: "2-digit",
    day: "2-digit",
  });
  const time = date.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return `${day.replace(/\.$/, "")} ${time}`;
};

/**
 * 하트 내역.
 *
 * 충전(+)과 사용(-)을 한 줄씩 시간순으로 섞어 둔다 — 잔액이 왜 이 숫자인지
 * 그대로 따라 읽히기 때문이다. 원화가 오간 충전 줄에만 결제 금액이 붙고,
 * 사용 줄은 보관함의 결과로 이어진다.
 */
export function HeartHistory() {
  const hydrated = useHydrated();
  const { entries, hearts } = useLedger();
  const [filter, setFilter] = useState<Filter>("all");

  const shown =
    filter === "all" ? entries : entries.filter((e) => e.type === filter);

  return (
    <>
      <section className="rounded-win border border-line bg-white px-4 py-4">
        <div className="flex items-center justify-between">
          <DotLabel className="text-[13px] text-silver-mid">보유 하트</DotLabel>
          <p className="flex items-center gap-1.5">
            <span className="dot-title text-[26px] leading-none text-heart">
              {hydrated ? hearts : "—"}
            </span>
            <HeartCoin size={22} />
          </p>
        </div>
      </section>

      <div
        role="tablist"
        aria-label="내역 종류"
        className="mt-4 flex gap-1.5"
      >
        {filters.map(([key, label]) => {
          const active = filter === key;
          return (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setFilter(key)}
              className={`min-h-[38px] rounded-win border px-4 text-[14px] font-semibold transition-colors ${
                active
                  ? "border-brand-pink bg-page-pink text-brand-pink"
                  : "border-line bg-white text-ink-soft hover:bg-hover"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {!hydrated ? (
        <ul className="mt-4 space-y-2" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <li
              key={i}
              className="h-[68px] rounded-win border border-line bg-white"
            />
          ))}
        </ul>
      ) : shown.length === 0 ? (
        <div className="py-14 text-center">
          <p className="dot-title text-[17px] text-ink">
            {filter === "charge"
              ? "충전 내역이 없어요"
              : filter === "spend"
                ? "사용 내역이 없어요"
                : "아직 하트 내역이 없어요"}
          </p>
          <p className="mt-2 dot-text text-[14px] leading-[1.7] text-ink-soft">
            하트를 충전하거나 운세를 보면 여기에 쌓여요.
          </p>
          <Link href="/" className={buttonClass({ className: "mt-6 px-8" })}>
            운세 보러 가기
          </Link>
        </div>
      ) : (
        <ul className="mt-4 divide-y divide-silver overflow-hidden rounded-win border border-line bg-white">
          {shown.map((entry) => (
            <li key={entry.id}>
              <HistoryRow entry={entry} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function HistoryRow({ entry }: { entry: LedgerEntry }) {
  if (entry.type === "charge") {
    return (
      <div className="flex items-center gap-3 px-3.5 py-3.5">
        <span className="min-w-0 flex-1">
          <span className="block dot-text text-[12px] text-silver-mid">
            {formatWhen(entry.createdAt)}
          </span>
          <span className="mt-0.5 block truncate text-[15px] font-bold text-ink">
            {entry.packageName} 충전
          </span>
        </span>
        <span className="shrink-0 text-right">
          <span className="flex items-center justify-end gap-1">
            <span className="dot-text text-[15px] font-bold leading-none text-heart">
              +{entry.hearts}
            </span>
            <HeartCoin size={14} />
          </span>
          <span className="mt-1 block dot-text text-[13px] text-ink-soft">
            {entry.price.toLocaleString()}원
          </span>
        </span>
      </div>
    );
  }

  const product = findProduct(entry.productId);

  return (
    <Link
      href={`/result/?id=${entry.archiveId}`}
      className="flex items-center gap-3 px-3.5 py-3.5 transition-colors hover:bg-hover"
    >
      <span className="min-w-0 flex-1">
        <span className="block dot-text text-[12px] text-silver-mid">
          {formatWhen(entry.createdAt)}
        </span>
        <span className="mt-0.5 block truncate text-[15px] font-bold text-ink">
          {product?.name ?? "지난 운세"}
        </span>
      </span>
      <span className="flex shrink-0 items-center gap-1">
        <span className="dot-text text-[15px] font-bold leading-none text-ink-soft">
          −{entry.hearts}
        </span>
        <HeartCoin size={14} className="opacity-45 grayscale" />
      </span>
    </Link>
  );
}
