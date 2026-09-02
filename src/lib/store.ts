"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * localStorage 기반 클라이언트 저장소.
 *
 * 정적 export(서버 없음) 서비스라 회원 상태·재화·보관함을 모두 브라우저에 둔다.
 * 화면 여러 곳(헤더 잔액 / 결제 시트 / 보관함)이 같은 값을 봐야 해서
 * `useSyncExternalStore` 로 구독을 공유한다.
 *
 * 서버 스냅샷은 항상 `fallback` 이므로 hydration 직후 한 번 다시 그려진다.
 * 그래서 `fallback` 은 반드시 모듈 상수를 넘겨야 한다 (매 렌더 새 객체 금지).
 */

/** 저장 키 — 값 구조가 바뀌면 뒤 버전을 올린다 */
export const KEY = {
  profiles: "fp.profiles.v2",
  defaultProfile: "fp.profile.default.v2",
  ledger: "fp.ledger.v1",
  archive: "fp.archive.v1",
  claimedGifts: "fp.gifts.claimed.v1",
  pastLife: "fp.pastlife.v1",
} as const;

const listeners = new Map<string, Set<() => void>>();
/** 파싱 결과 캐시 — getSnapshot 이 매번 같은 참조를 돌려줘야 한다 */
const snapshots = new Map<string, unknown>();

function notify(key: string) {
  const subs = listeners.get(key);
  if (!subs) return;
  for (const cb of subs) cb();
}

/* 다른 탭에서 바뀐 값도 따라간다 */
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === null) {
      snapshots.clear();
      for (const subs of listeners.values()) for (const cb of subs) cb();
      return;
    }
    snapshots.delete(e.key);
    notify(e.key);
  });
}

function subscribe(key: string, cb: () => void) {
  let subs = listeners.get(key);
  if (!subs) {
    subs = new Set();
    listeners.set(key, subs);
  }
  subs.add(cb);
  return () => {
    subs.delete(cb);
  };
}

export function readStore<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  if (snapshots.has(key)) return snapshots.get(key) as T;

  let value = fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw !== null) value = JSON.parse(raw) as T;
  } catch {
    /* 손상된 값은 기본값으로 되돌린다 */
  }
  snapshots.set(key, value);
  return value;
}

export function writeStore<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  snapshots.set(key, value);
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* 저장이 막혀도(시크릿 모드 등) 이번 세션은 메모리 값으로 계속 쓴다 */
  }
  notify(key);
}

/** `useState` 와 같은 모양으로 쓰되 값은 저장소에 남는다 */
export function useStore<T>(key: string, fallback: T) {
  const value = useSyncExternalStore(
    useCallback((cb: () => void) => subscribe(key, cb), [key]),
    () => readStore(key, fallback),
    () => fallback,
  );

  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      const prev = readStore(key, fallback);
      writeStore(
        key,
        typeof next === "function" ? (next as (p: T) => T)(prev) : next,
      );
    },
    [key, fallback],
  );

  return [value, set] as const;
}

const noopSubscribe = () => () => {};

/**
 * 브라우저에서 다시 그려졌는지 여부.
 * 정적 HTML 에는 저장된 값이 없으므로, 값이 없다고 단정하기 전에 이걸 먼저 본다.
 */
export const useHydrated = () =>
  useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
