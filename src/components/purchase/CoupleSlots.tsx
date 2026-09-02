"use client";

import { HeartCoin } from "@/components/ui/HeartCoin";
import { Icon } from "@/components/ui/Icon";
import { relationAvatar } from "@/lib/tone";
import { formatDate, relationLabel, type SajuProfile } from "@/lib/profiles";

interface CoupleSlotsProps {
  /** 자리마다 들어간 사람 (없으면 null) */
  filled: (SajuProfile | null)[];
  captions: string[];
  /** 다음에 고른 사람이 들어갈 자리 */
  activeSlot: number;
  onFocusSlot: (slot: number) => void;
  onClearSlot: (slot: number) => void;
}

/**
 * 궁합처럼 두 사람이 필요한 상품의 자리 카드.
 *
 * 두 자리를 한 화면에 놓아 누구와 누구인지 바로 보이게 하고,
 * 자리를 누르면 그 자리를 채울 차례로 바꾼다.
 * 두 자리가 다 차면 가운데 하트가 튀어나와 준비됐다는 걸 알린다.
 */
export function CoupleSlots({
  filled,
  captions,
  activeSlot,
  onFocusSlot,
  onClearSlot,
}: CoupleSlotsProps) {
  const ready = filled.every(Boolean);

  return (
    <div className="flex items-center justify-center gap-1.5">
      <Slot
        profile={filled[0]}
        caption={captions[0]}
        active={activeSlot === 0}
        onFocus={() => onFocusSlot(0)}
        onClear={() => onClearSlot(0)}
      />

      <span
        aria-hidden="true"
        className="flex size-11 shrink-0 items-center justify-center"
      >
        {/* 비어 있을 때도 하트 자리를 그대로 두고 색만 빼 둔다 */}
        <HeartCoin
          size={32}
          className={ready ? "heart-pop" : "opacity-30 grayscale"}
        />
      </span>

      <Slot
        profile={filled[1]}
        caption={captions[1]}
        active={activeSlot === 1}
        onFocus={() => onFocusSlot(1)}
        onClear={() => onClearSlot(1)}
      />
    </div>
  );
}

function Slot({
  profile,
  caption,
  active,
  onFocus,
  onClear,
}: {
  profile: SajuProfile | null;
  caption: string;
  active: boolean;
  onFocus: () => void;
  onClear: () => void;
}) {
  return (
    <div className="relative min-w-0 flex-1">
      <button
        type="button"
        onClick={onFocus}
        aria-pressed={active}
        className={`flex w-full flex-col items-center gap-1.5 rounded-win border px-2 py-3.5 transition-colors ${
          active
            ? "border-brand-pink bg-page-pink"
            : profile
              ? "border-line bg-white hover:bg-page-pink"
              : "border-dashed border-brand-pink-soft bg-white hover:bg-page-pink"
        }`}
      >
        <span className="dot-label text-[11px] text-silver-mid">{caption}</span>

        {profile ? (
          <>
            <span
              aria-hidden="true"
              className={`flex size-12 items-center justify-center rounded-full text-[18px] font-bold ${relationAvatar[profile.relation]}`}
            >
              {profile.name.slice(0, 1)}
            </span>
            <span className="w-full truncate text-[14px] font-bold text-ink">
              {profile.name}
            </span>
            <span className="dot-text text-[11px] leading-tight text-ink-soft">
              {relationLabel[profile.relation]} ·{" "}
              {formatDate(profile.birthDate)}
            </span>
          </>
        ) : (
          <>
            <span
              aria-hidden="true"
              className="flex size-12 items-center justify-center rounded-full border border-dashed border-brand-pink-soft text-[22px] leading-none text-brand-pink-soft"
            >
              +
            </span>
            <span className="dot-text text-[12px] text-ink-soft">
              비어 있어요
            </span>
            <span className="dot-text text-[11px] text-silver-mid">
              아래에서 골라 주세요
            </span>
          </>
        )}
      </button>

      {profile ? (
        <button
          type="button"
          onClick={onClear}
          aria-label={`${caption} 자리 비우기`}
          className="absolute right-1 top-1 flex size-7 items-center justify-center rounded-win text-silver-mid transition-colors hover:bg-white hover:text-ink"
        >
          <Icon name="close" size={14} />
        </button>
      ) : null}
    </div>
  );
}
