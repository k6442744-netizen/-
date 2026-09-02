"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Icon } from "@/components/ui/Icon";
import { buttonClass } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

type View = { mode: "menu" } | { mode: "alias" } | { mode: "delete" };

const ALIAS_MAX = 12;

/**
 * 전생 인맥 관리.
 *
 * 되돌릴 수 없는 동작(전체 삭제)이 섞여 있어 본문이 아니라 헤더의 `⋯` 에 둔다.
 */
export function NetworkMenu({
  open,
  onClose,
  name,
  alias,
  onSaveAlias,
  onEditProfile,
  onClearAll,
  linkCount,
}: {
  open: boolean;
  onClose: () => void;
  /** 사주정보에 적힌 실제 이름 */
  name: string;
  alias: string;
  onSaveAlias: (next: string) => void;
  onEditProfile: () => void;
  onClearAll: () => void;
  linkCount: number;
}) {
  const toast = useToast();
  const [view, setView] = useState<View>({ mode: "menu" });
  const [draft, setDraft] = useState(alias);

  const close = () => {
    setView({ mode: "menu" });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={close}
      title={
        view.mode === "alias"
          ? "표시 이름 수정"
          : view.mode === "delete"
            ? "인연 기록 삭제"
            : "전생 인맥 관리"
      }
      subtitle={
        view.mode === "menu" ? "나의 전생 인맥과 내 정보를 관리해요" : undefined
      }
      onBack={view.mode === "menu" ? undefined : () => setView({ mode: "menu" })}
    >
      {view.mode === "menu" ? (
        <div className="space-y-2">
          <MenuRow
            title="표시 이름 수정"
            desc="친구에게 보이는 이름이에요. 판정 결과는 그대로예요."
            onClick={() => {
              setDraft(alias);
              setView({ mode: "alias" });
            }}
          />
          <MenuRow
            title="내 사주정보 수정"
            desc="생년월일과 태어난 시를 바꾸면 인맥을 다시 계산해요."
            onClick={() => {
              close();
              onEditProfile();
            }}
          />
          <MenuRow
            title="인연 기록 삭제"
            desc={`모은 인연 ${linkCount}명이 사라져요. 되돌릴 수 없어요.`}
            tone="danger"
            onClick={() => setView({ mode: "delete" })}
          />
        </div>
      ) : null}

      {view.mode === "alias" ? (
        <div>
          <label
            htmlFor="past-life-alias"
            className="mb-1.5 block text-[13px] font-semibold text-ink"
          >
            표시 이름
          </label>
          <input
            id="past-life-alias"
            value={draft}
            onChange={(e) => setDraft(e.target.value.slice(0, ALIAS_MAX))}
            placeholder={name}
            className="min-h-[46px] w-full rounded-win border border-line bg-white px-3 text-[15px] text-ink outline-none transition-colors placeholder:text-silver-mid focus:border-brand-pink"
          />
          <p className="mt-1.5 dot-text text-[12px] leading-[1.7] text-silver-mid">
            비워 두면 사주정보의 이름({name})이 그대로 쓰여요. 실명을 알리고
            싶지 않을 때 별명을 넣어 주세요.
          </p>

          <div className="mt-5 flex gap-2">
            <button
              type="button"
              onClick={() => setView({ mode: "menu" })}
              className={buttonClass({ tone: "neutral", className: "flex-1" })}
            >
              취소
            </button>
            <button
              type="button"
              onClick={() => {
                onSaveAlias(draft.trim());
                toast("표시 이름을 바꿨어요");
                close();
              }}
              className={buttonClass({ className: "flex-[2]" })}
            >
              저장하기
            </button>
          </div>
        </div>
      ) : null}

      {view.mode === "delete" ? (
        <div>
          <p className="rounded-win border border-[#ff8ec7] bg-page-pink px-3.5 py-3 dot-text text-[14px] leading-[1.7] text-ink">
            모은 인연 <span className="font-bold">{linkCount}명</span>이 모두
            사라져요. 친구들이 남긴 결과도 함께 지워지고 되돌릴 수 없어요.
          </p>

          <div className="mt-5 flex gap-2">
            <button
              type="button"
              onClick={() => setView({ mode: "menu" })}
              className={buttonClass({ tone: "neutral", className: "flex-[2]" })}
            >
              그대로 둘게요
            </button>
            <button
              type="button"
              onClick={() => {
                onClearAll();
                toast("인연 기록을 지웠어요");
                close();
              }}
              className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-win border border-[#ff8ec7] bg-brand-pink px-4 text-[15px] font-semibold text-white transition-colors hover:brightness-95"
            >
              삭제
            </button>
          </div>
        </div>
      ) : null}
    </Modal>
  );
}

function MenuRow({
  title,
  desc,
  onClick,
  tone = "default",
}: {
  title: string;
  desc: string;
  onClick: () => void;
  tone?: "default" | "danger";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-win border border-line bg-white px-3.5 py-3 text-left transition-colors hover:bg-hover"
    >
      <span className="min-w-0 flex-1">
        <span
          className={`block text-[15px] font-bold ${tone === "danger" ? "text-brand-pink" : "text-ink"}`}
        >
          {title}
        </span>
        <span className="mt-0.5 block dot-text text-[12px] leading-[1.6] text-ink-soft">
          {desc}
        </span>
      </span>
      <Icon
        name="chevron-right"
        size={18}
        className="shrink-0 text-silver-mid"
      />
    </button>
  );
}
