"use client";

import { useSyncExternalStore } from "react";
import { readJson, removeKey, writeJson } from "./storage";
import type { ProviderId } from "@/components/auth/providers";

/**
 * 로그인 상태 저장소.
 *
 * 서버가 없으므로 계정은 localStorage 한 곳에만 산다. 컴포넌트는 `useAccount()` 로만
 * 읽는다 — 헤더·마이페이지·로그인 화면이 같은 값을 보고 동시에 갱신되어야 하기 때문에
 * 각자 useState 로 들고 있으면 어긋난다.
 *
 * 실제 OAuth 가 붙으면 `login()` 안의 샘플 생성만 사업자 응답으로 바꾸면 된다.
 */

const ACCOUNT_KEY = "fortune.account";
const RETURN_KEY = "fortune.returnTo";

export interface Account {
  provider: ProviderId;
  /** 화면에 노출하는 사업자 이름 (카카오 · 네이버 …) */
  providerName: string;
  email: string;
  name: string;
  /** YYYY-MM-DD */
  birth: string;
  /** 재화 — 원화가 아니라 하트 개수 */
  hearts: number;
}

/** 샘플 계정 — 실제 연동 시 사업자 응답으로 교체한다 */
const SAMPLE = { name: "김소형", birth: "1999-04-02", hearts: 12 };

const sampleEmail: Record<ProviderId, string> = {
  kakao: "thgudd17625@naver.com",
  naver: "thgudd17625@naver.com",
  google: "thgudd17625@gmail.com",
  apple: "thgudd17625@icloud.com",
};

/* --- 스토어 --------------------------------------------------------------- */

let state: Account | null = null;
let hydrated = false;
let bound = false;

const listeners = new Set<() => void>();

const emit = () => listeners.forEach((listener) => listener());

/** 다른 탭에서 로그인·로그아웃하면 이 탭도 따라간다 */
function bindCrossTabSync() {
  if (bound || typeof window === "undefined") return;
  bound = true;
  window.addEventListener("storage", (e) => {
    /* key 가 null 이면 전체 삭제 — 그때도 다시 읽는다 */
    if (e.key !== null && e.key !== ACCOUNT_KEY) return;
    hydrated = false;
    read();
    emit();
  });
}

function read(): Account | null {
  if (!hydrated) {
    state = readJson<Account | null>("local", ACCOUNT_KEY, null);
    hydrated = true;
  }
  return state;
}

function subscribe(listener: () => void) {
  bindCrossTabSync();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * 프리렌더와 하이드레이션 시점에는 항상 비로그인으로 그린다.
 * 여기서 storage 를 읽으면 서버가 만든 HTML 과 달라져 하이드레이션이 깨진다.
 * React 가 마운트 직후 실제 값으로 한 번 더 그려 준다.
 */
const guestSnapshot = () => null;

function commit(next: Account | null) {
  state = next;
  hydrated = true;
  if (next) writeJson("local", ACCOUNT_KEY, next);
  else removeKey("local", ACCOUNT_KEY);
  emit();
}

/* --- 읽기 ----------------------------------------------------------------- */

/** 로그인했으면 계정, 아니면 null */
export function useAccount(): Account | null {
  return useSyncExternalStore(subscribe, read, guestSnapshot);
}

/** 렌더 밖(이벤트 핸들러)에서 현재 계정이 필요할 때 */
export const getAccount = () => read();

/* --- 쓰기 ----------------------------------------------------------------- */

export function login(provider: { id: ProviderId; name: string }): Account {
  // TODO: 실제 OAuth 응답으로 교체 (지금은 샘플 계정)
  const account: Account = {
    provider: provider.id,
    providerName: provider.name,
    email: sampleEmail[provider.id],
    ...SAMPLE,
  };
  commit(account);
  return account;
}

export function logout(): void {
  commit(null);
}

/** 하트 차감 — 잔액이 모자라면 아무것도 하지 않고 false */
export function spendHearts(amount: number): boolean {
  const current = read();
  if (!current || current.hearts < amount) return false;
  commit({ ...current, hearts: current.hearts - amount });
  return true;
}

export function addHearts(amount: number): void {
  const current = read();
  if (!current) return;
  commit({ ...current, hearts: current.hearts + amount });
}

/* --- 로그인 후 복귀 지점 --------------------------------------------------- */

/** `//evil.com` 같은 외부 주소로 튕기지 않도록 앱 내부 경로만 통과시킨다 */
const isInternalPath = (path: string) =>
  path.startsWith("/") && !path.startsWith("//");

export function rememberReturnTo(path: string): void {
  if (!isInternalPath(path)) return;
  writeJson("session", RETURN_KEY, path);
}

/** 한 번 읽으면 지운다 — 다음 로그인까지 남아 있으면 엉뚱한 곳으로 보낸다 */
export function takeReturnTo(): string | null {
  const path = readJson<string | null>("session", RETURN_KEY, null);
  removeKey("session", RETURN_KEY);
  return path && isInternalPath(path) ? path : null;
}
