"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { HeartCoin } from "@/components/ui/HeartCoin";
import { HeartChargeModal } from "@/components/purchase/HeartChargeModal";
import { MyProfileModal } from "@/components/purchase/MyProfileModal";
import { useProfiles } from "@/lib/account";
import { useHearts } from "@/lib/ledger";
import { useSession } from "@/lib/session";
import { summarizeProfile } from "@/lib/profiles";
import { KAKAO_CHANNEL_URL } from "@/lib/links";
import { providers } from "@/components/auth/providers";
import { Icon, type IconName } from "@/components/ui/Icon";
import { PixelLabel } from "@/components/y2k/PixelLabel";
import { RetroWindow } from "@/components/y2k/RetroWindow";

const menuItems: {
  icon: IconName;
  label: string;
  href?: string;
  /** 서비스 밖으로 나가는 링크 — 새 탭으로 연다 */
  external?: boolean;
}[] = [
  { icon: "faq", label: "문의하기", href: KAKAO_CHANNEL_URL, external: true },
  { icon: "receipt", label: "하트 내역", href: "/history" },
  { icon: "box", label: "보관함", href: "/archive" },
  { icon: "gift", label: "선물하기", href: "/gift" },
  /* 쿠폰은 아직 준비 전이라 가려 둔다 — 열 때 이 줄만 되살리면 된다
  { icon: "ticket", label: "쿠폰 등록하기" }, */
];

/** 메뉴 그리드 열 수 — 항목이 홀수면 마지막 하나가 두 칸을 쓴다 */
const MENU_COLUMNS = 2;

type Phase = "closed" | "open" | "closing";

type MenuItem = (typeof menuItems)[number];

/** 메뉴 한 칸 — 외부 링크(카카오 채널)는 새 탭으로 연다 */
function MenuLink({
  item,
  onNavigate,
}: {
  item: MenuItem;
  onNavigate: () => void;
}) {
  const className =
    "flex min-h-[64px] flex-col items-center justify-center gap-1.5 px-2 transition-colors hover:bg-hover";
  const content = (
    <>
      <Icon name={item.icon} size={20} className="text-brand-lav" />
      <span className="dot-text text-[14px] text-ink">{item.label}</span>
    </>
  );

  if (item.external && item.href) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onNavigate}
        className={className}
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      href={item.href ?? "#"}
      onClick={item.href ? onNavigate : undefined}
      className={className}
    >
      {content}
    </Link>
  );
}

export function MobileMenu() {
  /* 닫힐 때도 같은 경로로 되돌아가야 해서 closing 단계를 둔다 */
  const [phase, setPhase] = useState<Phase>("closed");
  const [profileOpen, setProfileOpen] = useState(false);
  const [chargeOpen, setChargeOpen] = useState(false);
  const { defaultProfile } = useProfiles();
  const { hearts } = useHearts();
  const { session, signOut } = useSession();
  const provider = providers.find((p) => p.id === session?.provider);
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
        className="flex size-11 shrink-0 items-center justify-center rounded-win text-ink transition-colors hover:bg-hover"
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
                  <RetroWindow label="내 정보" tone="pink">
                    <div className="flex items-center gap-3.5 px-4 pb-4 pt-4">
                      <span className="flex size-14 shrink-0 items-center justify-center bg-brand-pink-soft">
                        <span className="dot-text text-[20px] font-bold text-white">
                          {defaultProfile ? defaultProfile.name.slice(0, 1) : "?"}
                        </span>
                      </span>

                      <div className="min-w-0 flex-1">
                        <p className="flex items-center gap-1.5 text-[17px] font-bold text-ink">
                          {defaultProfile ? defaultProfile.name : "사주정보 없음"}
                          {defaultProfile ? (
                            <span className="rounded-tag border border-line px-1.5 py-px text-[11px] font-medium text-ink-soft">
                              기본
                            </span>
                          ) : null}
                        </p>
                        <p className="dot-text mt-1 text-[14px] text-ink-soft">
                          {defaultProfile
                            ? summarizeProfile(defaultProfile)
                            : "운세를 보려면 사주정보가 필요해요"}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setProfileOpen(true)}
                        className="h-8 shrink-0 rounded-win border border-line bg-white px-3 text-[13px] font-semibold text-ink-soft transition-colors hover:bg-hover"
                      >
                        {defaultProfile ? "변경" : "입력"}
                      </button>
                    </div>

                    {session ? (
                      <div className="flex items-center gap-2 bg-[#fff5fa] px-4 py-2.5">
                        <span className="rounded-tag border border-line bg-white px-1.5 py-px text-[11px] font-bold text-ink-soft">
                          {provider?.name ?? "간편 로그인"}
                        </span>
                        <p className="dot-text min-w-0 flex-1 truncate text-[13px] text-ink-soft">
                          {session.email}
                        </p>
                      </div>
                    ) : (
                      <Link
                        href="/login"
                        onClick={close}
                        className="flex items-center justify-between gap-2 bg-[#fff5fa] px-4 py-2.5 transition-colors hover:bg-page-pink"
                      >
                        <span className="dot-text text-[13px] text-ink-soft">
                          로그인하고 내 운세를 저장하세요
                        </span>
                        <span className="shrink-0 text-[13px] font-semibold text-brand-pink">
                          로그인
                        </span>
                      </Link>
                    )}
                  </RetroWindow>

                  {/* 하트 잔액 */}
                  <RetroWindow label="보유 하트" tone="lavender">
                    <div className="px-4 pb-4 pt-5 text-center">
                      <p className="flex items-center justify-center gap-2">
                        <span className="dot-text text-[32px] font-bold leading-none text-heart">
                          {hearts}
                        </span>
                        <HeartCoin size={30} />
                      </p>

                      <Button
                        className="mt-4 w-full"
                        onClick={() => setChargeOpen(true)}
                      >
                        하트 충전하기
                      </Button>
                    </div>
                  </RetroWindow>

                  {/* 이벤트 — 계정 메뉴와 성격이 달라 따로 두되 생김새는 맞춘다 */}
                  <Link
                    href={
                      session
                        ? "/past-life"
                        : `/login/?next=${encodeURIComponent("/past-life")}`
                    }
                    onClick={close}
                    className="flex min-h-[64px] items-center gap-2.5 rounded-win border border-line bg-white px-4 shadow-card transition-colors hover:bg-hover"
                  >
                    <Icon
                      name="star"
                      size={20}
                      className="shrink-0 text-brand-lav"
                    />
                    <span className="flex items-center gap-1.5">
                      <span className="dot-text text-[14px] text-ink">
                        전생관계 판별기
                      </span>
                      <span className="rounded-tag bg-brand-lav px-1.5 py-px text-[10px] font-bold text-white">
                        무료
                      </span>
                    </span>
                  </Link>

                  {/* 메뉴 — 리스트 대신 2열 아이콘 그리드 */}
                  <nav aria-label="계정 메뉴">
                    <ul className="grid grid-cols-2 overflow-hidden rounded-win border border-line bg-white shadow-card">
                      {menuItems.map((item, i) => {
                        const rows = Math.ceil(menuItems.length / MENU_COLUMNS);
                        /* 항목이 홀수일 때만 마지막 하나가 한 줄을 다 쓴다 */
                        const wide =
                          menuItems.length % MENU_COLUMNS === 1 &&
                          i === menuItems.length - 1;
                        const lastRow = Math.floor(i / MENU_COLUMNS) === rows - 1;
                        return (
                          <li
                            key={item.label}
                            className={`${wide ? "col-span-2" : ""} ${
                              !wide && i % MENU_COLUMNS === 0
                                ? "border-r border-silver"
                                : ""
                            } ${lastRow ? "" : "border-b border-silver"}`}
                          >
                            <MenuLink item={item} onNavigate={close} />
                          </li>
                        );
                      })}
                    </ul>
                  </nav>

                  {/* 계정 */}
                  <div className="flex items-center justify-center gap-3 pb-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        signOut();
                        close();
                      }}
                      disabled={!session}
                      className="text-[13px] text-silver-mid underline-offset-4 transition-colors hover:text-ink-soft hover:underline disabled:opacity-40 disabled:hover:no-underline"
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

              <MyProfileModal
                open={profileOpen}
                onClose={() => setProfileOpen(false)}
              />

              <HeartChargeModal
                open={chargeOpen}
                onClose={() => setChargeOpen(false)}
              />
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
