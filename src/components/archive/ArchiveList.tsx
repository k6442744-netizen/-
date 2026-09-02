"use client";

import { useState } from "react";
import Link from "next/link";
import { FortuneObject } from "@/components/fortune/FortuneObject";
import { buttonClass } from "@/components/ui/Button";
import { DotLabel } from "@/components/y2k/DotLabel";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useArchive } from "@/lib/archive";
import { useHydrated } from "@/lib/store";
import { paleBg, toneText } from "@/lib/tone";
import { findProduct } from "@/lib/products";

const formatWhen = (at: number) =>
  new Date(at)
    .toLocaleDateString("ko-KR", {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
    })
    /* `26. 09. 02.` 처럼 나오는 걸 `26.09.02` 로 다듬는다 */
    .replace(/\s/g, "")
    .replace(/\.$/, "");

/** 한 번에 보여 줄 개수 — 되찾기용 목록이라 무한 스크롤 대신 끊어서 펼친다 */
const PAGE_SIZE = 20;

/** 보관함 — 지금까지 본 운세와 그 결과로 다시 들어가는 목록 */
export function ArchiveList() {
  const hydrated = useHydrated();
  const { entries } = useArchive();
  const [limit, setLimit] = useState(PAGE_SIZE);

  const visible = entries.slice(0, limit);
  const rest = entries.length - visible.length;

  if (!hydrated) {
    return (
      <ul className="space-y-2.5" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <li key={i} className="h-[92px] rounded-win border border-line bg-white" />
        ))}
      </ul>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="py-14 text-center">
        <FortuneObject name="envelope" size={92} className="float-soft" />
        <p className="mt-6 dot-title text-[17px] text-ink">
          아직 본 운세가 없어요
        </p>
        <p className="mt-2 dot-text text-[14px] leading-[1.7] text-ink-soft">
          운세를 보면 결과가 여기에 쌓여요.
        </p>
        <Link href="/" className={buttonClass({ className: "mt-6 px-8" })}>
          운세 보러 가기
        </Link>
      </div>
    );
  }

  return (
    <>
      <ul className="space-y-2.5">
        {visible.map((entry) => {
          const product = findProduct(entry.productId);
          const names = entry.people.map((p) => p.name).join(" × ");

          return (
            <li key={entry.id}>
              <Link
                href={`/result/?id=${entry.id}`}
                className="flex items-center gap-3 rounded-win border border-line bg-white p-3 shadow-card transition-shadow hover:shadow-win"
              >
                <span
                  className={`flex size-16 shrink-0 items-center justify-center rounded-win ${product ? paleBg[product.tone] : "bg-silver"}`}
                >
                  <FortuneObject
                    name={product?.object ?? "crystal-ball"}
                    src={product?.image}
                    size={52}
                  />
                </span>

                <span className="min-w-0 flex-1">
                  {/* 언제 봤는지는 메타 정보라 카테고리 줄에 함께 둔다 */}
                  <span className="flex items-center gap-1.5">
                    <DotLabel
                      className={`text-[11px] ${product ? toneText[product.tone] : "text-silver-mid"}`}
                    >
                      {product?.type ?? "지난 상품"}
                    </DotLabel>
                    <span aria-hidden="true" className="text-[11px] text-silver">
                      ·
                    </span>
                    <span className="dot-text text-[11px] text-silver-mid">
                      {formatWhen(entry.createdAt)}
                    </span>
                  </span>

                  <span className="mt-0.5 block truncate text-[15px] font-bold text-ink">
                    {product?.name ?? "이름을 알 수 없는 운세"}
                  </span>
                  <span className="mt-1 block truncate dot-text text-[12px] text-ink-soft">
                    {names}
                  </span>
                </span>

                {/* 이미 값을 치른 결과라 가격은 두지 않는다 — 하트 흐름은 `하트 내역`이 맡는다 */}
                <span className="shrink-0 rounded-win border border-line px-2.5 py-1.5 text-[12px] font-semibold text-ink-soft">
                  다시 보기
                </span>
              </Link>
            </li>
            );
        })}
      </ul>

      {rest > 0 ? (
        <Button
          tone="neutral"
          className="mt-4 w-full"
          onClick={() => setLimit((n) => n + PAGE_SIZE)}
        >
          {rest}개 더 보기
          <Icon name="chevron-right" size={15} className="rotate-90" />
        </Button>
      ) : null}
    </>
  );
}
