/**
 * 브라우저 저장소 접근 단일 창구.
 *
 * 정적 export(`output: "export"`)라 서버가 없어서 로그인 상태·구매 진행이 전부
 * 브라우저에 남는다. 컴포넌트가 storage 를 직접 만지지 않고 여기만 거치게 두면
 * 나중에 실제 API 로 옮길 때 이 파일만 바꾸면 된다.
 *
 * 프리렌더에는 window 가 없고, 사파리 프라이빗 모드는 접근 자체가 예외를 던진다.
 * 두 경우 모두 여기서 흡수하고 메모리로 대체한다 — 앱이 죽는 것보다 낫다.
 */

export type StorageKind = "local" | "session";

const memory: Record<StorageKind, Map<string, string>> = {
  local: new Map(),
  session: new Map(),
};

const resolved = new Map<StorageKind, Storage | null>();
let blocked = false;

function backend(kind: StorageKind): Storage | null {
  if (typeof window === "undefined") return null;

  const cached = resolved.get(kind);
  if (cached !== undefined) return cached;

  let store: Storage | null = null;
  try {
    const candidate =
      kind === "local" ? window.localStorage : window.sessionStorage;
    /* 읽기는 되고 쓰기에서 던지는 환경이 있어서 실제로 써 봐야 안다 */
    const probe = "__fortune_probe__";
    candidate.setItem(probe, "1");
    candidate.removeItem(probe);
    store = candidate;
  } catch {
    blocked = true;
  }

  resolved.set(kind, store);
  return store;
}

export function readJson<T>(kind: StorageKind, key: string, fallback: T): T {
  const raw = backend(kind)?.getItem(key) ?? memory[kind].get(key) ?? null;
  if (raw === null) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    /* 손상된 값은 없는 것으로 친다 */
    return fallback;
  }
}

export function writeJson(kind: StorageKind, key: string, value: unknown): void {
  const raw = JSON.stringify(value);
  /* 저장이 막혀도 한 세션 안에서는 동작하도록 메모리에도 남긴다 */
  memory[kind].set(key, raw);
  try {
    backend(kind)?.setItem(key, raw);
  } catch {
    blocked = true;
  }
}

export function removeKey(kind: StorageKind, key: string): void {
  memory[kind].delete(key);
  try {
    backend(kind)?.removeItem(key);
  } catch {
    blocked = true;
  }
}

/** 저장이 막힌 환경인지 — "새로고침하면 사라져요" 안내가 필요할 때 쓴다 */
export const isStorageBlocked = () => blocked;
