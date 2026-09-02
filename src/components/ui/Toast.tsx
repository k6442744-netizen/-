"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

/** 토스트가 떠 있는 시간 */
const TOAST_MS = 2600;

const ToastContext = createContext<((message: ReactNode) => void) | null>(null);

/** 화면을 가리지 않고 결과만 알릴 때 쓴다 */
export function useToast() {
  const show = useContext(ToastContext);
  if (!show) {
    throw new Error("useToast 는 ToastProvider 안에서만 쓸 수 있어요.");
  }
  return show;
}

/**
 * 토스트 알림.
 *
 * 팝업 위에도 떠야 해서 모달(z-50)보다 위에 둔다.
 * 진행 중인 화면을 멈추지 않는 알림이라 버튼은 두지 않고 시간이 지나면 사라진다.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<{ id: number; message: ReactNode } | null>(
    null,
  );

  const show = useCallback((message: ReactNode) => {
    setToast({ id: Date.now(), message });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), TOAST_MS);
    return () => window.clearTimeout(timer);
  }, [toast]);

  return (
    <ToastContext.Provider value={show}>
      {children}
      {toast
        ? createPortal(
            <div
              key={toast.id}
              role="status"
              aria-live="polite"
              className="toast-in fixed bottom-7 left-1/2 z-[60] flex w-[calc(100%-40px)] min-w-[280px] max-w-[380px] items-center justify-center gap-2 rounded-win border border-line bg-white px-4 py-3.5 text-center text-[14px] font-semibold text-ink shadow-win"
            >
              {toast.message}
            </div>,
            document.body,
          )
        : null}
    </ToastContext.Provider>
  );
}
