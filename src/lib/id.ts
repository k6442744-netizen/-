/** 브라우저에서 만드는 짧은 고유 id (구형 브라우저용 대비책 포함) */
export const newId = () =>
  globalThis.crypto?.randomUUID?.() ??
  `id_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

/** 문자열 → 32비트 정수 (FNV-1a). 결과를 다시 만들 씨앗으로 쓴다 */
export function hashString(input: string) {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash = Math.imul(hash ^ input.charCodeAt(i), 16777619);
  }
  return hash >>> 0;
}
