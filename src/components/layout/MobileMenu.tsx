"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/Button";
import { HeartCoin } from "@/components/ui/HeartCoin";
import { Icon, type IconName } from "@/components/ui/Icon";
import { PixelDecoration } from "@/components/y2k/PixelDecoration";
import { PixelLabel } from "@/components/y2k/PixelLabel";
import { RetroWindow } from "@/components/y2k/RetroWindow";

/** 샘플 계정 정보 — 실제 로그인 연동 시 교체 */
const account = {
  provider: "카카오",
  email: "thgudd17625@naver.com",
  name: "김소형",
  birth: "1999-04-02",
  hearts: 12,
};

const menuItems: { icon: IconName; label: string }[] = [
  { icon: "faq", label: "문의하기" },
  { icon: "receipt", label: "결제내역" },
  { icon: "box", label: "보관함" },
  { icon: "gift", label: "선물하기" },
  { icon: "ticket", label: "쿠폰 등록하기" },
];

type Phase = "closed" | "open" | "closing";

export function MobileMenu() {
  /* 닫힐 때도 같은 경로로 되돌아가야 해서 closing 단계를 둔다 */
  const [phase, setPhase] = useState<Phase>("closed");
  const open = phase !== "closed";
  const close = useCallback(() => {
    setPhase((p) => (p === "open" ? "closing" : p));
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close]);

  return (
    <>
      <button
        type="button"
        aria-label="메뉴 열기"
        aria-expanded={phase === "open"}
        onClick={() => setPhase("open")}
        className="flex size-11 shrink-0 items-center justify-center rounded-win text-ink transition-colors hover:bg-page-lav"
      >
        <Icon name="menu" size={22} />
      </button>

      {/* 헤더의 backdrop-blur가 fixed의 컨테이닝 블록이 되므로 body로 포털한다 */}
      {open
        ? createPortal(
            <div className="fixed inset-0 z-50">
              <button
                type="button"
                aria-label="메뉴 닫기"
                onClick={close}
                className={`absolute inset-0 cursor-default bg-[#2a1a3a]/35 ${
                  phase === "closing" ? "dim-out" : "dim-in"
                }`}
              />

              <div
                role="dialog"
                aria-modal="true"
                aria-label="마이페이지"
                onAnimationEnd={() => {
                  if (phase === "closing") setPhase("closed");
                }}
                className={`absolute inset-y-0 left-1/2 flex w-full min-w-[360px] -translate-x-1/2 flex-col bg-page min-[480px]:max-w-[420px] min-[480px]:border-x min-[480px]:border-silver ${
                  phase === "closing" ? "menu-out" : "menu-in"
                }`}
              >
                {/* 상단 바 */}
                <div className="flex h-12 shrink-0 items-center justify-between bg-[#ffc9e6] pl-4 pr-2">
                  <PixelLabel className="!text-[12px] text-[#8f0f57]">
                    MY PAGE.EXE
                  </PixelLabel>
                  <button
                    type="button"
                    onClick={close}
                    aria-label="닫기"
                    className="flex size-9 items-center justify-center rounded-win text-[#8f0f57] transition-colors hover:bg-white/50"
                  >
                    <Icon name="close" size={18} />
                  </button>
                </div>

                <div className="flex-1 space-y-4 overflow-y-auto overscroll-contain px-[var(--page-padding)] py-5">
                  {/* 회원카드 — 로그인 정보 + 대표프로필을 한 장으로 */}
                  <RetroWindow
                    label="MEMBER CARD"
                    labelFont="pixel"
                    tone="pink"
                    icon={<PixelDecoration shape="star" size={11} />}
                  >
                    <div className="flex items-center gap-3.5 px-4 pb-4 pt-4">
                      <span className="flex size-14 shrink-0 items-center justify-center bg-brand-pink-soft">
                        <span className="dot-text text-[20px] font-bold text-white">
                          {account.name.slice(0, 1)}
                        </span>
                      </span>

                      <div className="min-w-0 flex-1">
                        <p className="flex items-center gap-1.5 text-[17px] font-bold text-ink">
                          {account.name}
                          <span className="rounded-tag border border-line px-1.5 py-px text-[11px] font-medium text-ink-soft">
                            본인
                          </span>
                        </p>
                        <p className="dot-text mt-1 text-[14px] text-ink-soft">
                          {account.birth}
                        </p>
                      </div>

                      <button
                        type="button"
                        className="h-8 shrink-0 rounded-win border border-line bg-white px-3 text-[13px] font-semibold text-ink-soft transition-colors hover:bg-page-lav"
                      >
                        변경
                      </button>
                    </div>

                    <div className="flex items-center gap-2 bg-[#fff5fa] px-4 py-2.5">
                      <span className="rounded-tag bg-kakao px-1.5 py-px text-[11px] font-bold text-kakao-ink">
                        {account.provider}
                      </span>
                      <p className="dot-text min-w-0 flex-1 truncate text-[13px] text-ink-soft">
                        {account.email}
                      </p>
                    </div>
                  </RetroWindow>

                  {/* 하트 잔액 */}
                  <RetroWindow label="HEART.EXE" labelFont="pixel" tone="lavender">
                    <div className="px-4 pb-4 pt-5 text-center">
                      <PixelLabel
                        as="p"
                        className="!text-[10px] tracking-[0.08em] text-brand-lav"
                      >
                        MY HEART
                      </PixelLabel>

                      <p className="mt-2.5 flex items-center justify-center gap-2">
                        <span className="dot-text text-[32px] font-bold leading-none text-heart">
                          {account.hearts}
                        </span>
                        <HeartCoin size={30} />
                      </p>

                      <Button className="mt-4 w-full">하트 충전하기</Button>
                    </div>
                  </RetroWindow>

                  {/* 메뉴 — 리스트 대신 2열 아이콘 그리드 */}
                  <nav aria-label="계정 메뉴">
                    <ul className="grid grid-cols-2 overflow-hidden rounded-win border border-line bg-white shadow-card">
                      {menuItems.map((item, i) => {
                        const isLast = i === menuItems.length - 1;
                        return (
                          <li
                            key={item.label}
                            className={`${isLast ? "col-span-2" : ""} ${
                              !isLast && i % 2 === 0 ? "border-r border-silver" : ""
                            } ${i < menuItems.length - 1 ? "border-b border-silver" : ""}`}
                          >
                            <a
                              href="#"
                              className="flex min-h-[64px] flex-col items-center justify-center gap-1.5 px-2 transition-colors hover:bg-page-pink"
                            >
                              <Icon
                                name={item.icon}
                                size={20}
                                className="text-brand-lav"
                              />
                              <span className="dot-text text-[14px] text-ink">
                                {item.label}
                              </span>
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </nav>

                  {/* 계정 */}
                  <div className="flex items-center justify-center gap-3 pb-2 pt-1">
                    <button
                      type="button"
                      className="text-[13px] text-silver-mid underline-offset-4 transition-colors hover:text-ink-soft hover:underline"
                    >
                      로그아웃
                    </button>
                    <span aria-hidden="true" className="h-3 w-px bg-silver" />
                    <button
                      type="button"
                      className="text-[13px] text-silver-mid underline-offset-4 transition-colors hover:text-ink-soft hover:underline"
                    >
                      회원탈퇴
                    </button>
                  </div>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
