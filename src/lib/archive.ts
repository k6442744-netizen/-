"use client";

import { useCallback } from "react";
import { KEY, useStore } from "./store";
import { hashString, newId } from "./id";
import type { SajuProfile } from "./profiles";

export interface ArchiveEntry {
  id: string;
  productId: string;
  /** 볼 때 쓴 하트 */
  hearts: number;
  createdAt: number;
  /** 결과를 다시 만들 때 쓰는 씨앗 — 같은 씨앗이면 같은 결과가 나온다 */
  seed: number;
  /**
   * 본 사람의 사주정보를 그대로 복사해 둔다.
   * 나중에 그 사람을 지워도 이미 본 결과는 그대로 남아야 하기 때문이다.
   */
  people: SajuProfile[];
}

const NO_ENTRIES: ArchiveEntry[] = [];

/** 보관함 — 내가 어떤 운세를 봤는지와 그 결과를 다시 볼 수 있게 남긴다 */
export function useArchive() {
  const [entries, setEntries] = useStore<ArchiveEntry[]>(KEY.archive, NO_ENTRIES);

  const addEntry = useCallback(
    (input: { productId: string; hearts: number; people: SajuProfile[] }) => {
      const createdAt = Date.now();
      const entry: ArchiveEntry = {
        ...input,
        id: newId(),
        createdAt,
        seed: hashString(
          `${input.productId}|${input.people.map((p) => p.id).join(",")}|${createdAt}`,
        ),
      };
      /* 최근에 본 것이 위로 */
      setEntries((prev) => [entry, ...prev]);
      return entry;
    },
    [setEntries],
  );

  const findEntry = useCallback(
    (id: string) => entries.find((e) => e.id === id),
    [entries],
  );

  const removeEntry = useCallback(
    (id: string) => setEntries((prev) => prev.filter((e) => e.id !== id)),
    [setEntries],
  );

  return { entries, addEntry, findEntry, removeEntry };
}
