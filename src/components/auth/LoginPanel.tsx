"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { providers, type Provider } from "./providers";
import { useSession } from "@/lib/session";

const [primary, ...secondary] = providers;

/**
 * 간편 로그인 패널.
 * 대표 수단(카카오)만 전체 폭 버튼으로 두고 나머지는 아이콘 버튼으로 두어
 * 브랜드 컬러가 화면을 지배하지 않게 한다 (§2 컬러 비율, §20-11).
 *
 * 실제 OAuth 연동 지점은 `handleLogin` 한 곳입니다.
 *
 * 상품을 누르다 로그인으로 넘어온 경우 `next` 에 원래 화면이 담겨 있어서,
 * 로그인이 끝나면 그 화면으로 되돌리고 하던 구매를 이어 간다.
 */
export function LoginPanel() {
  const [pending, setPending] = useState<Provider["id"] | null>(null);
  const router = useRouter();
  const params = useSearchParams();
  const { signIn } = useSession();

  const handleLogin = (provider: Provider) => {
    setPending(provider.id);

    // TODO: 각 사업자 OAuth 연동 (예: Kakao SDK authorize) 후 받은 정보로 signIn 호출
    window.setTimeout(() => {
      signIn(provider.id);
      const next = params.get("next");
      /* 외부 주소로 튕기지 않도록 우리 경로만 허용한다 */
      router.replace(next && next.startsWith("/") ? next : "/");
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

    </div>
  );
}
