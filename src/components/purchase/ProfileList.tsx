"use client";

import { relationAvatar } from "@/lib/tone";
import { summarizeProfile, type SajuProfile } from "@/lib/profiles";

interface ProfileListProps {
  profiles: SajuProfile[];
  onSelect: (id: string) => void;
  onAdd: () => void;
  /** 기본 사주정보 — 뱃지를 붙인다 */
  defaultId?: string | null;
  /** 지금 이 자리에 들어가 있는 사람 */
  selectedId?: string | null;
  /** 다른 자리에서 이미 쓰는 사람 — 고를 수 없다 */
  disabledIds?: string[];
  /** 넘기면 각 줄에 수정 버튼이 붙는다 (사주정보 관리용) */
  onEdit?: (id: string) => void;
  addLabel?: string;
  /**
   * `go` — 고르면 다음 단계로 넘어간다
   * `assign` — 고르면 지금 자리에 들어간다 (들어간 자리를 이름으로 알려 준다)
   */
  mode?: "go" | "assign";
  /** assign 모드에서 그 사람이 이미 들어가 있는 자리 이름 */
  slotOf?: (id: string) => string | undefined;
}

/**
 * 저장된 사람 목록 — 줄을 누르면 그 사람으로 고른다.
 *
 * 다섯 명까지만 펼쳐 두고 그 아래는 목록 안에서 스크롤한다.
 * 팝업이 화면을 넘기지 않고 `추가하기` 버튼도 늘 같은 자리에 남는다.
 */
export function ProfileList({
  profiles,
  onSelect,
  onAdd,
  defaultId,
  selectedId,
  disabledIds = [],
  onEdit,
  addLabel = "새로운 사람 추가하기",
  mode = "go",
  slotOf,
}: ProfileListProps) {
  return (
    <div>
      {profiles.length === 0 ? (
        <p className="py-6 text-center dot-text text-[14px] leading-[1.7] text-ink-soft">
          저장된 사주정보가 없어요.
          <br />
          아래에서 먼저 추가해 주세요.
        </p>
      ) : (
              <ul className="max-h-[336px] divide-y divide-silver overflow-y-auto overscroll-contain">
          {profiles.map((profile) => {
            const disabled = disabledIds.includes(profile.id);
            const selected = profile.id === selectedId;
            const slot = slotOf?.(profile.id);
            return (
              <li key={profile.id} className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => onSelect(profile.id)}
                  className={`flex min-w-0 flex-1 items-center gap-3 rounded-win py-3 pl-1 pr-1 text-left transition-colors hover:bg-page-pink disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent ${
                    selected ? "bg-page-pink" : ""
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`flex size-11 shrink-0 items-center justify-center rounded-full text-[17px] font-bold ${relationAvatar[profile.relation]}`}
                  >
                    {profile.name.slice(0, 1)}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5">
                      <span className="truncate text-[16px] font-bold text-ink">
                        {profile.name}
                      </span>
                      {profile.id === defaultId ? (
                        <span className="shrink-0 rounded-tag bg-brand-pink-soft px-1.5 py-px text-[11px] font-bold text-white">
                          기본
                        </span>
                      ) : null}
                    </span>
                    <span className="mt-0.5 block truncate dot-text text-[13px] text-ink-soft">
                      {summarizeProfile(profile)}
                    </span>
                  </span>

                  {/* 이미 들어간 사람만 어느 자리인지 알려 주고, 나머지는 비워 둔다 */}
                  {onEdit || mode === "go" ? null : slot ? (
                    <span className="shrink-0 rounded-tag border border-line bg-page-pink px-1.5 py-0.5 text-[11px] font-bold text-brand-pink">
                      {slot} 자리
                    </span>
                  ) : null}
                </button>

                {onEdit ? (
                  <button
                    type="button"
                    onClick={() => onEdit(profile.id)}
                    className="h-8 shrink-0 rounded-win border border-line bg-white px-2.5 text-[13px] font-semibold text-ink-soft transition-colors hover:bg-hover"
                  >
                    수정
                  </button>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}

      <button
        type="button"
        onClick={onAdd}
        className="mt-4 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-win border border-[#ff8ec7] bg-white text-[15px] font-bold text-brand-pink transition-colors hover:bg-page-pink active:bg-[#ffdcee]"
      >
        <span aria-hidden="true" className="text-[17px] leading-none">
          +
        </span>
        {addLabel}
      </button>
    </div>
  );
}
