"use client";

import { useCallback } from "react";
import { KEY, readStore, useStore } from "./store";
import { newId } from "./id";
import type { ProfileDraft, SajuProfile } from "./profiles";

/* useSyncExternalStore 의 서버 스냅샷으로 쓰이므로 모듈 상수여야 한다 */
const NO_PROFILES: SajuProfile[] = [];
const NO_DEFAULT: string | null = null;

/**
 * 사주정보 목록.
 *
 * 처음 저장한 하나가 자동으로 기본 사주정보가 되고(`defaultProfile`),
 * 이후 추가한 사람은 상품 화면에서 골라 쓰거나 기본으로 바꿀 수 있다.
 */
export function useProfiles() {
  const [profiles, setProfiles] = useStore<SajuProfile[]>(
    KEY.profiles,
    NO_PROFILES,
  );
  const [storedDefaultId, setStoredDefaultId] = useStore<string | null>(
    KEY.defaultProfile,
    NO_DEFAULT,
  );

  /* 지정된 기본이 없거나 지워졌으면 가장 먼저 넣은 사람이 기본이 된다 */
  const defaultProfile =
    profiles.find((p) => p.id === storedDefaultId) ?? profiles[0] ?? null;

  /* 목록 순서 — 기본 사주정보가 맨 위, 그다음은 최근에 쓴 순.
     사람이 늘어나 목록을 스크롤하게 돼도 자주 쓰는 사람이 위에 남는다 */
  const ordered = [...profiles].sort((a, b) => {
    if (a.id === defaultProfile?.id) return -1;
    if (b.id === defaultProfile?.id) return 1;
    return (b.lastUsedAt ?? b.createdAt) - (a.lastUsedAt ?? a.createdAt);
  });

  const addProfile = useCallback(
    (draft: ProfileDraft) => {
      const profile: SajuProfile = {
        ...draft,
        name: draft.name.trim(),
        id: newId(),
        createdAt: Date.now(),
      };
      setProfiles((prev) => [...prev, profile]);
      return profile;
    },
    [setProfiles],
  );

  const updateProfile = useCallback(
    (id: string, draft: ProfileDraft) => {
      setProfiles((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, ...draft, name: draft.name.trim() } : p,
        ),
      );
    },
    [setProfiles],
  );

  const removeProfile = useCallback(
    (id: string) => {
      setProfiles((prev) => prev.filter((p) => p.id !== id));
      if (readStore(KEY.defaultProfile, NO_DEFAULT) === id) {
        setStoredDefaultId(null);
      }
    },
    [setProfiles, setStoredDefaultId],
  );

  /** 이 사람으로 운세를 본 시각을 남긴다 */
  const touchProfile = useCallback(
    (id: string) => {
      setProfiles((prev) =>
        prev.map((p) => (p.id === id ? { ...p, lastUsedAt: Date.now() } : p)),
      );
    },
    [setProfiles],
  );

  return {
    profiles: ordered,
    defaultProfile,
    defaultId: defaultProfile?.id ?? null,
    addProfile,
    updateProfile,
    removeProfile,
    touchProfile,
    setDefaultProfile: setStoredDefaultId,
  };
}
