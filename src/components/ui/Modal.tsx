"use client";

import { useEffect, useId, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Icon } from "./Icon";

type Phase = "closed" | "open" | "closing";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  /** 가운데 제목 */
  title: string;
  /** 제목 아래 한 줄 안내 */
  subtitle?: ReactNode;
  /** 넘기면 제목 왼쪽에 뒤로가기가 붙는다 */
  onBack?: () => void;
  children: ReactNode;
  /** 스크롤과 상관없이 팝업 아래에 붙어 있는 액션 */
  footer?: ReactNode;
}

/**
 * 가운데 팝업 — 상품을 고른 뒤의 흐름(사주정보 선택 → 결제)은 화면을 옮기지 않고
 * 이 팝업 안에서 단계만 바꾼다.
 *
 * 헤더의 `backdrop-blur` 가 fixed 의 컨테이닝 블록이 되므로 body 로 포털한다.
 * 닫힐 때 내용까지 사라지지 않도록 닫힘 애니메이션이 끝난 뒤에 언마운트한다.
 */
export function Modal({
  open,
  onClose,
  title,
  subtitle,
  onBack,
  children,
  footer,
}: ModalProps) {
  const titleId = useId();
  /* 카드에서 열 때는 open=true 인 채로 마운트되므로 첫 단계를 prop 에서 잡는다 */
  const [phase, setPhase] = useState<Phase>(open ? "open" : "closed");
  /* 그다음부터는 open 이 바뀐 순간을 렌더 중에 잡는다 (prop 변화 대응 패턴) */
  const [prevOpen, setPrevOpen] = useState(open);
  if (prevOpen !== open) {
    setPrevOpen(open);
    setPhase(open ? "open" : phase === "open" ? "closing" : "closed");
  }

  const visible = phase !== "closed";

  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [visible, onClose]);

  if (!visible) return null;
  const closing = phase === "closing";

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center px-5">
      <button
        type="button"
        aria-label="닫기"
        onClick={onClose}
        className={`absolute inset-0 cursor-default bg-[#2a1a3a]/35 ${
          closing ? "dim-out" : "dim-in"
        }`}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onAnimationEnd={() => {
          if (closing) setPhase("closed");
        }}
        className={`relative flex max-h-[84dvh] w-full max-w-[340px] flex-col overflow-hidden rounded-win border border-line bg-white shadow-win ${
          closing ? "pop-out" : "pop-in"
        }`}
      >
        <div className="relative shrink-0 border-b border-silver px-12 pb-4 pt-5 text-center">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              aria-label="뒤로"
              className="absolute left-2 top-3.5 flex size-9 items-center justify-center rounded-win text-ink-soft transition-colors hover:bg-hover"
            >
              <Icon name="chevron-left" size={19} />
            </button>
          ) : null}

          <h2 id={titleId} className="dot-title text-[19px] leading-[1.35] text-ink">
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-1.5 dot-text text-[13px] leading-[1.6] text-ink-soft">
              {subtitle}
            </p>
          ) : null}

          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="absolute right-2 top-3.5 flex size-9 items-center justify-center rounded-win text-ink-soft transition-colors hover:bg-hover"
          >
            <Icon name="close" size={19} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-5 pb-5 pt-4">
          {children}
        </div>

        {footer ? (
          <div className="shrink-0 border-t border-silver bg-white px-5 pb-4 pt-3">
            {footer}
          </div>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
