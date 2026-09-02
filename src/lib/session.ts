"use client";

import { useCallback } from "react";
import { KEY, useStore } from "./store";
import type { ProviderId } from "@/components/auth/providers";

/**
 * 로그인 세션.
 *
 * 실제 OAuth 연동 전이라 간편 로그인 버튼을 누르면 이 세션만 만들어 둔다.
 * 연동할 때는 `LoginPanel` 의 `handleLogin` 에서 받은 사용자 정보로
 * `signIn` 을 부르면 나머지 화면은 그대로 동작한다.
 */

export interface Session {
  provider: ProviderId;
  email: string;
  loggedInAt: number;
}

const NO_SESSION: Session | null = null;

export function useSession() {
  const [session, setSession] = useStore<Session | null>(
    KEY.session,
    NO_SESSION,
  );

  const signIn = useCallback(
    (provider: ProviderId, email = "fortune@example.com") => {
      setSession({ provider, email, loggedInAt: Date.now() });
    },
    [setSession],
  );

  const signOut = useCallback(() => setSession(null), [setSession]);

  return { session, signIn, signOut };
}
