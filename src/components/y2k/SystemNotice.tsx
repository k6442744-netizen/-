import type { ReactNode } from "react";
import { DotLabel } from "./DotLabel";

/**
 * 시스템 메시지 창 (§7의 System Window 축소판).
 * 안내·경고를 화면 흐름을 끊지 않고 그 자리에서 알릴 때 쓴다.
 */
export function SystemNotice({
  title = "시스템 메시지",
  onClose,
  children,
  className = "",
}: {
  title?: string;
  onClose?: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-win border border-[#a97cff] bg-white ${className}`}>
      <div className="flex items-center justify-between border-b border-[#cdb4ff] bg-[#eadcff] px-2.5 py-1.5">
        <DotLabel className="text-[12px] text-[#6b3fc7]">{title}</DotLabel>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="알림 닫기"
            className="flex h-[15px] w-[16px] items-center justify-center rounded-[1px] border border-silver-mid bg-white text-[9px] leading-none text-ink-soft"
          >
            ×
          </button>
        ) : null}
      </div>
      <div className="px-3 py-3 text-[13px] leading-[1.6] text-ink-soft">
        {children}
      </div>
    </div>
  );
}
