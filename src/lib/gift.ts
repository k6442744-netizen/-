"use client";

import { useCallback } from "react";
import { KEY, useStore } from "./store";
import { asset } from "./asset";
import { fromBase64Url, toBase64Url } from "./code";

/**
 * 운세 선물.
 *
 * 서버가 없으므로 선물 내용을 **링크 안에** 담는다.
 * 어떤 상품인지와 메시지를 코드로 만들어 붙이기 때문에
 * 받는 사람이 다른 기기에서 열어도 그대로 열린다.
 * 대신 `이미 받았는지`는 받는 사람 브라우저에만 남는다.
 */

export interface GiftPayload {
  /** 상품 id */
  p: string;
  /** 보내는 사람이 남긴 한마디 */
  m?: string;
  /** 보낸 사람 이름 */
  f?: string;
  /** 보낸 시각 */
  t: number;
}

export const encodeGift = (payload: GiftPayload) =>
  toBase64Url(JSON.stringify(payload));

export function decodeGift(code: string): GiftPayload | null {
  try {
    const parsed = JSON.parse(fromBase64Url(code)) as GiftPayload;
    return typeof parsed?.p === "string" ? parsed : null;
  } catch {
    /* 잘린 링크나 남이 만든 코드 */
    return null;
  }
}

/** 받는 사람에게 보낼 전체 주소 */
export function giftUrl(code: string) {
  const origin = typeof window === "undefined" ? "" : window.location.origin;
  return `${origin}${asset("/gift/receive/")}?code=${code}`;
}

type ClaimedMap = Record<string, string>;
const NO_CLAIMS: ClaimedMap = {};

/** 이 브라우저에서 이미 받은 선물 — 코드 → 보관함 결과 id */
export function useClaimedGifts() {
  const [claimed, setClaimed] = useStore<ClaimedMap>(
    KEY.claimedGifts,
    NO_CLAIMS,
  );

  const claim = useCallback(
    (code: string, archiveId: string) => {
      setClaimed((prev) => ({ ...prev, [code]: archiveId }));
    },
    [setClaimed],
  );

  return { claimed, claim };
}
