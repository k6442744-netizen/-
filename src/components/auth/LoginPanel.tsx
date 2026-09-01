"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { providers, type Provider } from "./providers";
import { HeartCoin } from "@/components/ui/HeartCoin";
import { Icon } from "@/components/ui/Icon";
import { DotLabel } from "@/components/y2k/DotLabel";
import { login, logout, takeReturnTo, useAccount } from "@/lib/account";

const [primary, ...secondary] = providers;

/**
 * 간편 로그인 패널.
 * 대표 수단(카카오)만 전체 폭 버튼으로 두고 나머지는 아이콘 버튼으로 두어
 * 브랜드 컬러가 화면을 지배하지 않게 한다 (§2 컬러 비율, §20-11).
 *
 * 실제 OAuth 연동 지점은 `handleLogin` 한 곳입니다.
 * 지금은 `login()` 이 샘플 계정을 만들어 localStorage 에 넣습니다.
 */
export function LoginPanel() {
  const account = useAccount();
  const router = useRouter();
  const [pending, setPending] = useState<Provider["id"] | null>(null);

  const handleLogin = (provider: Provider) => {
    setPending(provider.id);

    // TODO: 각 사업자 OAuth 연동 (예: signIn(provider.id) / Kakao SDK authorize)
    window.setTimeout(() => {
      login(provider);
      /* 뒤로가기로 로그인 화면에 되돌아오지 않도록 replace */
      router.replace(takeReturnTo() ?? "/");
    }, 500);
  };

  /* 연결 중에는 아직 로그인 화면을 유지한다 — 이동 직전에 패널이 바뀌면 깜빡인다 */
  if (account && !pending) return <SignedIn />;

  const busy = pending !== null;

  return (
    <div>
      <button
        type="button"
        onClick={() => handleLogin(primary)}
        disabled={busy}
        aria-busy={pending === primary.id}
        className={`relative flex h-[52px] w-full items-center justify-center rounded-win border text-[15px] font-semibold transition disabled:opacity-60 ${primary.className}`}
      >
        <span className="absolute left-4 flex items-center">{primary.logo}</span>
        {pending === primary.id ? "연결 중..." : primary.label}
      </button>

      <div className="my-4 flex items-center gap-3">
        <span aria-hidden="true" className="h-px flex-1 bg-silver" />
        <p className="shrink-0 text-[12px] text-silver-mid">다른 방법으로 로그인</p>
        <span aria-hidden="true" className="h-px flex-1 bg-silver" />
      </div>

      <ul className="grid grid-cols-3 gap-2.5">
        {secondary.map((provider) => (
          <li key={provider.id}>
            <button
              type="button"
              onClick={() => handleLogin(provider)}
              disabled={busy}
              aria-label={`${provider.name}로 시작하기`}
              aria-busy={pending === provider.id}
              className={`flex h-[52px] w-full items-center justify-center rounded-win border transition disabled:opacity-60 ${provider.iconClassName}`}
            >
              {provider.logo}
            </button>
            <p className="mt-1.5 text-center text-[12px] text-ink-soft">
              {pending === provider.id ? "연결 중" : provider.name}
            </p>
          </li>
        ))}
      </ul>

      {/* 실제 연동 전까지 무엇이 일어나는지 숨기지 않는다 */}
      <div className="mt-4 rounded-win border border-[#a97cff] bg-white">
        <div className="flex items-center border-b border-[#cdb4ff] bg-[#eadcff] px-2.5 py-1.5">
          <DotLabel className="text-[12px] text-[#6b3fc7]">시스템 메시지</DotLabel>
        </div>
        <p className="px-3 py-3 text-[13px] leading-[1.6] text-ink-soft">
          사업자 연동 전이라 지금은{" "}
          <span className="font-semibold text-ink">샘플 계정</span>으로
          로그인됩니다. 어느 버튼을 눌러도 같은 계정이 들어와요.
        </p>
      </div>
    </div>
  );
}

/** 이미 로그인한 채로 이 화면에 들어온 경우 */
function SignedIn() {
  const account = useAccount();
  if (!account) return null;

  return (
    <div>
      <div className="flex items-center gap-3.5 rounded-win border border-line bg-white p-3.5 shadow-card">
        <span className="flex size-12 shrink-0 items-center justify-center bg-brand-pink-soft">
          <span className="dot-text text-[18px] font-bold text-white">
            {account.name.slice(0, 1)}
          </span>
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-[16px] font-bold leading-tight text-ink">
            {account.name}님
          </p>
          <p className="dot-text mt-1 truncate text-[13px] text-ink-soft">
            {account.providerName} · {account.email}
          </p>
        </div>

        <span className="flex shrink-0 items-center gap-1">
          <span className="dot-text text-[15px] font-bold leading-none text-heart">
            {account.hearts}
          </span>
          <HeartCoin size={15} />
        </span>
      </div>

      <p className="mt-4 dot-text text-[14px] leading-[1.7] text-ink-soft">
        이미 로그인되어 있어요.
      </p>

      <Link
        href="/"
        className="mt-3 flex min-h-[48px] w-full items-center justify-center gap-1.5 rounded-win border border-[#ff8ec7] bg-white px-5 text-[15px] font-semibold text-brand-pink transition-colors hover:bg-[#ffeef7] active:bg-[#ffdcee]"
      >
        내 운세 보러가기
        <Icon name="arrow-right" size={15} />
      </Link>

      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={() => logout()}
          className="min-h-[44px] px-3 text-[13px] text-silver-mid underline-offset-4 transition-colors hover:text-ink-soft hover:underline"
        >
          다른 계정으로 로그인
        </button>
      </div>
    </div>
  );
}
