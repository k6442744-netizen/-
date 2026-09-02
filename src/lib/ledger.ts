"use client";

import { useCallback } from "react";
import { KEY, readStore, useStore, writeStore } from "./store";
import { newId } from "./id";

/**
 * 하트 원장.
 *
 * 충전(+)과 사용(-)을 한 줄씩 쌓고, **잔액은 이 원장의 합으로 계산한다.**
 * 잔액을 따로 저장하지 않으므로 내역과 숫자가 어긋날 일이 없다.
 */

interface LedgerBase {
  id: string;
  createdAt: number;
  /** 오간 하트 수 (항상 양수, 방향은 type 이 정한다) */
  hearts: number;
}

export interface ChargeEntry extends LedgerBase {
  type: "charge";
  /** 원화 결제 금액 */
  price: number;
  /** 충전 상품 이름 (예: 하트 파우치) */
  packageName: string;
  /** PG 승인 번호 — 영수증·환불의 근거 */
  paymentId: string;
}

export interface SpendEntry extends LedgerBase {
  type: "spend";
  productId: string;
  /** 이 사용으로 만들어진 보관함 결과 (선물로 보낸 경우에는 없다) */
  archiveId?: string;
  /** 남에게 선물로 보낸 건지 */
  gift?: boolean;
}

export type LedgerEntry = ChargeEntry | SpendEntry;

/** 신규 계정에 넣어 두는 하트 — 결제 흐름을 바로 확인할 수 있게 한다 */
export const INITIAL_HEARTS = 12;

const NO_ENTRIES: LedgerEntry[] = [];

export const balanceOf = (entries: LedgerEntry[]) =>
  entries.reduce(
    (sum, e) => (e.type === "charge" ? sum + e.hearts : sum - e.hearts),
    INITIAL_HEARTS,
  );

/** 하트 내역 — 최근 것이 위 */
export function useLedger() {
  const [entries] = useStore<LedgerEntry[]>(KEY.ledger, NO_ENTRIES);
  return { entries, hearts: balanceOf(entries) };
}

/** 재화(하트) 잔액과 입출금 */
export function useHearts() {
  const [entries] = useStore<LedgerEntry[]>(KEY.ledger, NO_ENTRIES);

  const append = useCallback((entry: LedgerEntry) => {
    const current = readStore<LedgerEntry[]>(KEY.ledger, NO_ENTRIES);
    writeStore(KEY.ledger, [entry, ...current]);
  }, []);

  const charge = useCallback(
    (input: {
      hearts: number;
      price: number;
      packageName: string;
      paymentId: string;
    }) => {
      append({
        ...input,
        type: "charge",
        id: newId(),
        createdAt: Date.now(),
      });
    },
    [append],
  );

  /** 잔액이 모자라면 아무것도 남기지 않고 false */
  const spend = useCallback(
    (input: {
      hearts: number;
      productId: string;
      archiveId?: string;
      gift?: boolean;
    }) => {
      /* 다른 탭에서 먼저 썼을 수도 있으니 저장소의 최신 원장으로 다시 계산한다 */
      const current = readStore<LedgerEntry[]>(KEY.ledger, NO_ENTRIES);
      if (balanceOf(current) < input.hearts) return false;

      writeStore(KEY.ledger, [
        {
          ...input,
          type: "spend" as const,
          id: newId(),
          createdAt: Date.now(),
        },
        ...current,
      ]);
      return true;
    },
    [],
  );

  return { hearts: balanceOf(entries), charge, spend };
}
