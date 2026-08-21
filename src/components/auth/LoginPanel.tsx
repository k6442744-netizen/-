"use client";

import { useState } from "react";
import { providers, type Provider } from "./providers";
import { CeramicLabel } from "@/components/y2k/CeramicLabel";

const [primary, ...secondary] = providers;

/**
 * 간편 로그인 패널.
 * 대표 수단(카카오)만 전체 폭 버튼으로 두고 나머지는 아이콘 버튼으로 두어
 * 브랜드 컬러가 화면을 지배하지 않게 한다 (§2 컬러 비율, §20-11).
 *
 * 실제 OAuth 연동 지점은 `handleLogin` 한 곳입니다.
 */
export function LoginPanel() {
  const [pending, setPending] = useState<Provider["id"] | null>(null);
  const [notice, setNotice] = useState<Provider | null>(null);

  const handleLogin = (provider: Provider) => {
    setNotice(null);
    setPending(provider.id);

    // TODO: 각 사업자 OAuth 연동 (예: signIn(provider.id) / Kakao SDK authorize)
    window.setTimeout(() => {
      setPending(null);
      setNotice(provider);
    }, 500);
  };

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

      <div aria-live="polite">
        {notice ? (
          <div className="mt-4 rounded-win border border-[#a97cff] bg-white">
            <div className="flex items-center justify-between border-b border-[#cdb4ff] bg-[#eadcff] px-2.5 py-1.5">
              <CeramicLabel className="text-[12px] text-[#6b3fc7]">
                시스템 메시지
              </CeramicLabel>
              <button
                type="button"
                onClick={() => setNotice(null)}
                aria-label="알림 닫기"
                className="flex h-[15px] w-[16px] items-center justify-center rounded-[1px] border border-silver-mid bg-white text-[9px] leading-none text-ink-soft"
              >
                ×
              </button>
            </div>
            <p className="px-3 py-3 text-[13px] leading-[1.6] text-ink-soft">
              <span className="font-semibold text-ink">{notice.name}</span> 간편
              로그인은 연동 준비 중이에요. 조금만 기다려주세요.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
