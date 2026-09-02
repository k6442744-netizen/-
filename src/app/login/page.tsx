import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { AppFrame, Padded } from "@/components/layout/AppFrame";
import { SubHeader } from "@/components/layout/SubHeader";
import { LoginPanel } from "@/components/auth/LoginPanel";
import { FortuneObject } from "@/components/fortune/FortuneObject";
import { RetroWindow } from "@/components/y2k/RetroWindow";
import { PixelDecoration } from "@/components/y2k/PixelDecoration";
import { StatusBadge } from "@/components/y2k/StatusBadge";

export const metadata: Metadata = {
  title: "로그인 — FORTUNE PORTAL",
  description: "간편 로그인하고 내 운세를 확인하세요.",
};

export default function LoginPage() {
  return (
    <AppFrame>
      <SubHeader title="로그인" />

      <main className="flex-1">
        {/* --- 인트로 (Hero 규칙 축소 적용: 밝은 배경 + 3D object 1개 + 소량 장식) --- */}
        <section className="relative overflow-hidden border-b border-silver bg-[linear-gradient(180deg,#fff8fc_0%,#ffeef7_100%)] px-[var(--page-padding)] pb-7 pt-6">
          <PixelDecoration
            shape="sparkle"
            size={12}
            className="absolute left-[52%] top-7 text-brand-pink-soft"
          />
          <PixelDecoration
            shape="heart"
            size={10}
            className="absolute right-[18%] top-[104px] text-[#ffc2e2]"
          />
          <PixelDecoration
            shape="star"
            size={14}
            className="absolute right-5 top-[46px] text-brand-lav-soft"
          />

          <FortuneObject
            name="padlock"
            size={104}
            className="float-soft pointer-events-none absolute -right-2 bottom-3"
          />

          <div className="relative">
            <StatusBadge label="MEMBER LOGIN" />
            <h2 className="mt-5 text-[26px] font-bold leading-[1.32] tracking-[-0.02em] text-ink">
              간편하게 로그인하고
              <br />내 운세를 확인하세요
            </h2>
            <p className="mt-2.5 max-w-[230px] dot-text text-[14px] leading-[1.7] text-ink-soft">
              별도 가입 없이 3초면 시작할 수 있어요.
            </p>
          </div>
        </section>

        <Padded className="pb-4 pt-7">
          <RetroWindow label="LOGIN.EXE" tone="pink" bodyClassName="px-4 pb-5 pt-5">
            <p className="mb-4 text-[13px] font-semibold text-ink-soft">
              간편 로그인
            </p>

            <Suspense
              fallback={<div className="h-[52px] rounded-win bg-silver" />}
            >
              <LoginPanel />
            </Suspense>

            <p className="mt-5 dot-text text-[12px] leading-[1.8] text-ink-faint">
              로그인 시{" "}
              <Link href="#" className="text-ink-soft underline underline-offset-2">
                이용약관
              </Link>
              과{" "}
              <Link href="#" className="text-ink-soft underline underline-offset-2">
                개인정보처리방침
              </Link>
              에 동의하는 것으로 간주합니다.
            </p>
          </RetroWindow>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="inline-flex min-h-[44px] items-center px-3 text-[14px] font-medium text-ink-soft underline-offset-4 hover:underline"
            >
              그냥 둘러볼래요
            </Link>
          </div>
        </Padded>
      </main>
    </AppFrame>
  );
}
