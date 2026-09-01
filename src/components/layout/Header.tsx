"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import { HeartCoin } from "@/components/ui/HeartCoin";
import { Icon } from "@/components/ui/Icon";
import { PixelDecoration } from "@/components/y2k/PixelDecoration";
import { PixelLabel } from "@/components/y2k/PixelLabel";
import { rememberReturnTo, useAccount } from "@/lib/account";
import { MyPageOverlay, type MyPagePhase } from "./MyPageOverlay";

/**
 * 좌: 메뉴 / 중앙: 로고 / 우: 로그인 상태
 *
 * 우측 자리가 로그인 여부를 알리는 지점이다.
 * 비로그인이면 로그인 버튼, 로그인 상태면 하트 잔액 — 재화가 하나뿐이라
 * 잔액이 곧 "로그인되어 있다"는 신호가 된다.
 *
 * 마이페이지를 여는 곳이 메뉴 버튼과 하트 칩 둘이라 열림 상태는 여기서 들고 있는다.
 */
export function Header() {
  const account = useAccount();
  const pathname = usePathname();
  const [phase, setPhase] = useState<MyPagePhase>("closed");
  const menuOpen = phase === "open";

  const openMenu = useCallback(() => setPhase("open"), []);
  /* 닫을 때는 퇴장 애니메이션이 끝난 뒤에 언마운트한다 */
  const closeMenu = useCallback(
    () => setPhase((p) => (p === "open" ? "closing" : p)),
    [],
  );
  const finishClose = useCallback(() => setPhase("closed"), []);

  return (
    <header className="sticky top-0 z-30 border-b border-silver bg-page/95 backdrop-blur-[6px]">
      <div className="relative flex h-14 items-center justify-between px-[calc(var(--page-padding)-8px)]">
        <button
          type="button"
          aria-label="메뉴 열기"
          aria-expanded={menuOpen}
          onClick={openMenu}
          className="flex size-11 shrink-0 items-center justify-center rounded-win text-ink transition-colors hover:bg-page-lav"
        >
          <Icon name="menu" size={22} />
        </button>

        <Link
          href="/"
          aria-label="FORTUNE PORTAL 홈"
          className="absolute left-1/2 flex -translate-x-1/2 items-center gap-1.5"
        >
          <PixelDecoration shape="star" size={11} className="text-[#ffa6d2]" />
          <PixelLabel className="!text-[15px] font-bold tracking-[0.03em] text-[#ff8ec7]">
            FORTUNE PORTAL
          </PixelLabel>
          <PixelDecoration shape="star" size={11} className="text-[#ffa6d2]" />
        </Link>

        {account ? (
          <button
            type="button"
            onClick={openMenu}
            aria-expanded={menuOpen}
            aria-label={`내 하트 ${account.hearts}개 · 마이페이지 열기`}
            className="flex h-9 shrink-0 items-center gap-1.5 rounded-win border border-[#ff8ec7] bg-white pl-2.5 pr-2 transition-colors hover:bg-[#ffeef7]"
          >
            <span className="dot-text text-[14px] font-bold leading-none text-heart">
              {account.hearts}
            </span>
            <HeartCoin size={15} />
          </button>
        ) : (
          <Link
            href="/login"
            /* 로그인 후 보고 있던 화면으로 돌아온다 */
            onClick={() => rememberReturnTo(pathname)}
            className="flex h-9 shrink-0 items-center rounded-win border border-[#ff8ec7] bg-white px-3 text-[13px] font-semibold text-brand-pink transition-colors hover:bg-[#ffeef7]"
          >
            로그인
          </Link>
        )}
      </div>

      <MyPageOverlay phase={phase} onClose={closeMenu} onClosed={finishClose} />
    </header>
  );
}
