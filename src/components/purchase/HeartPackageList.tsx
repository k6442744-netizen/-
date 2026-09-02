"use client";

import { HeartCoin } from "@/components/ui/HeartCoin";
import { heartPackages } from "@/lib/hearts";

/**
 * 하트 충전 상품 목록.
 *
 * 고르는 것과 결제하는 것을 나눈다 — 여기서는 선택만 하고,
 * 결제는 아래 `충전하기` 버튼에서 결제창으로 넘긴다.
 */
export function HeartPackageList({
  selected,
  onSelect,
}: {
  selected: number | null;
  onSelect: (hearts: number) => void;
}) {
  return (
    <ul className="space-y-2">
      {heartPackages.map((pkg) => {
        const active = pkg.hearts === selected;
        return (
          <li key={pkg.hearts}>
            <label
              className={`flex min-h-[62px] cursor-pointer items-center gap-2.5 py-2.5 rounded-win border px-3.5 transition-colors ${
                active
                  ? "border-brand-pink bg-page-pink"
                  : "border-line bg-white hover:bg-hover"
              }`}
            >
              <input
                type="radio"
                name="heart-package"
                value={pkg.hearts}
                checked={active}
                onChange={() => onSelect(pkg.hearts)}
                className="size-[18px] shrink-0 accent-[color:var(--pink-primary)]"
              />
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5">
                  <span className="text-[15px] font-bold text-ink">
                    {pkg.name}
                  </span>
                  {"badge" in pkg && pkg.badge ? (
                    <span className="rounded-tag bg-brand-pink-soft px-1.5 py-px text-[11px] font-bold text-white">
                      {pkg.badge}
                    </span>
                  ) : null}
                </span>
                <span className="mt-0.5 flex items-center gap-1">
                  <span className="dot-text text-[14px] font-bold leading-none text-accent">
                    {pkg.hearts}
                  </span>
                  <HeartCoin size={13} />
                </span>
              </span>
              <span className="shrink-0 text-[15px] font-semibold text-ink">
                {pkg.price.toLocaleString()}원
              </span>
            </label>
          </li>
        );
      })}
    </ul>
  );
}
