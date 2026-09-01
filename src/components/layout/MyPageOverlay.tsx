"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { FortuneObject } from "@/components/fortune/FortuneObject";
import { Button } from "@/components/ui/Button";
import { HeartCoin } from "@/components/ui/HeartCoin";
import { Icon, type IconName } from "@/components/ui/Icon";
import { PixelDecoration } from "@/components/y2k/PixelDecoration";
import { PixelLabel } from "@/components/y2k/PixelLabel";
import { RetroWindow } from "@/components/y2k/RetroWindow";
import {
  logout,
  rememberReturnTo,
  useAccount,
  type Account,
} from "@/lib/account";

const menuItems: { icon: IconName; label: string }[] = [
  { icon: "faq", label: "문의하기" },
  { icon: "receipt", label: "결제내역" },
  { icon: "box", label: "보관함" },
  { icon: "gift", label: "선물하기" },
  { icon: "ticket", label: "쿠폰 등록하기" },
];

/** 닫히는 동안에도 패널이 남아 있어야 해서 closing 단계를 둔다 */
export type MyPagePhase = "closed" | "open" | "closing";

/**
 * 마이페이지 오버레이.
 *
 * 로그인 여부로 내용이 갈린다. 회원카드 자리는 로그인 유도로 바뀌고,
 * 보여줄 잔액이 없는 하트 창은 비로그인에서 아예 빠진다.
 *
 * 여는 주체가 헤더(메뉴 버튼 · 하트 칩) 둘이라 열림 상태는 헤더가 들고 있는다.
 */
export function MyPageOverlay({
  phase,
  onClose,
  onClosed,
}: {
  phase: MyPagePhase;
  /** 닫기 요청 — 부모가 phase 를 closing 으로 바꾼다 */
  onClose: () => void;
  /** 퇴장 애니메이션이 끝난 시점 */
  onClosed: () => void;
}) {
  const account = useAccount();
  const pathname = usePathname();
  const mounted = phase !== "closed";

  useEffect(() => {
    if (!mounted) return;
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
  }, [mounted, onClose]);

  /* 로그인 화면으로 보낼 때, 돌아올 자리를 남기고 오버레이는 닫는다 */
  const toLogin = useCallback(() => {
    rememberReturnTo(pathname);
    onClose();
  }, [pathname, onClose]);

  if (!mounted) return null;

  /* 헤더의 backdrop-blur 가 fixed 의 컨테이닝 블록이 되므로 body 로 포털한다 */
  return createPortal(
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="메뉴 닫기"
        onClick={onClose}
        className={`absolute inset-0 cursor-default bg-[#2a1a3a]/35 ${
          phase === "closing" ? "dim-out" : "dim-in"
        }`}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="마이페이지"
        onAnimationEnd={() => {
          if (phase === "closing") onClosed();
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
            onClick={onClose}
            aria-label="닫기"
            className="flex size-9 items-center justify-center rounded-win text-[#8f0f57] transition-colors hover:bg-white/50"
          >
            <Icon name="close" size={18} />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto overscroll-contain px-[var(--page-padding)] py-5">
          <PanelItem delay={60}>
            {account ? (
              <MemberCard account={account} />
            ) : (
              <GuestCard onLogin={toLogin} />
            )}
          </PanelItem>

          {/* 하트 창은 로그인 상태에서만 — 비로그인에는 보여줄 잔액이 없다 */}
          {account ? (
            <PanelItem delay={110}>
              <HeartCard hearts={account.hearts} />
            </PanelItem>
          ) : null}

          {/* 메뉴 — 리스트 대신 2열 아이콘 그리드 */}
          <PanelItem delay={account ? 160 : 110}>
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
                      {/* 로그인해야 볼 수 있는 항목들이라 비로그인이면 로그인으로 보낸다.
                          막아 두는 대신 눌리게 두는 쪽이 어디로 가는지 분명하다 (§17) */}
                      <Link
                        href={account ? "#" : "/login"}
                        onClick={account ? undefined : toLogin}
                        aria-label={account ? undefined : `${item.label} — 로그인 필요`}
                        className="flex min-h-[64px] flex-col items-center justify-center gap-1.5 px-2 transition-colors hover:bg-page-pink"
                      >
                        <Icon
                          name={item.icon}
                          size={20}
                          className={account ? "text-brand-lav" : "text-silver-mid"}
                        />
                        <span
                          className={`dot-text text-[14px] ${
                            account ? "text-ink" : "text-ink-soft"
                          }`}
                        >
                          {item.label}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </PanelItem>

          {account ? (
            <PanelItem delay={210}>
              <AccountActions />
            </PanelItem>
          ) : null}
        </div>
      </div>
    </div>,
    document.body,
  );
}

/** 패널이 자리를 잡는 동안 차례로 올라오는 칸 */
function PanelItem({
  delay,
  children,
}: {
  delay: number;
  children: ReactNode;
}) {
  return (
    <div className="menu-item" style={{ animationDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* --- 로그인 상태 ---------------------------------------------------------- */

function MemberCard({ account }: { account: Account }) {
  return (
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
          {account.providerName}
        </span>
        <p className="dot-text min-w-0 flex-1 truncate text-[13px] text-ink-soft">
          {account.email}
        </p>
      </div>
    </RetroWindow>
  );
}

function AccountActions() {
  return (
    <div className="flex items-center justify-center gap-3 pb-2 pt-1">
      <button
        type="button"
        onClick={() => logout()}
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
  );
}

/* --- 비로그인 상태 -------------------------------------------------------- */

function GuestCard({ onLogin }: { onLogin: () => void }) {
  return (
    <RetroWindow
      label="MEMBER CARD"
      labelFont="pixel"
      tone="pink"
      icon={<PixelDecoration shape="star" size={11} />}
    >
      <div className="relative overflow-hidden px-4 pb-4 pt-5">
        <FortuneObject
          name="padlock"
          size={72}
          alt=""
          className="float-soft pointer-events-none absolute -right-2 top-3 opacity-90"
        />

        <div className="relative max-w-[210px]">
          <p className="text-[17px] font-bold leading-[1.4] text-ink">
            로그인하고
            <br />내 운세를 확인하세요
          </p>
          <p className="dot-text mt-2 text-[13px] leading-[1.7] text-ink-soft">
            별도 가입 없이 3초면 시작할 수 있어요.
          </p>
        </div>

        <Link
          href="/login"
          onClick={onLogin}
          className="mt-4 flex min-h-[44px] w-full items-center justify-center gap-1.5 rounded-win border border-[#ff8ec7] bg-white px-5 text-[15px] font-semibold text-brand-pink transition-colors hover:bg-[#ffeef7] active:bg-[#ffdcee]"
        >
          로그인 / 회원가입
          <Icon name="arrow-right" size={15} />
        </Link>
      </div>
    </RetroWindow>
  );
}

/* --- 공통 ----------------------------------------------------------------- */

/** 하트 잔액 */
function HeartCard({ hearts }: { hearts: number }) {
  return (
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
            {hearts}
          </span>
          <HeartCoin size={30} />
        </p>

        <Button className="mt-4 w-full">하트 충전하기</Button>
      </div>
    </RetroWindow>
  );
}
