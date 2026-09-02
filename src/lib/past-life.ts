"use client";

import { useCallback, useState } from "react";
import { KEY, readStore, useStore, writeStore } from "./store";
import { fromBase64Url, toBase64Url } from "./code";
import { hashString, newId } from "./id";
import { asset } from "./asset";
import type { CalendarKind, Gender, SajuProfile } from "./profiles";

/**
 * 전생 인맥.
 *
 * 내 고유 링크를 만들어 두면 친구가 그 링크로 들어와 자기 생시를 넣고,
 * 나와의 사주로 전생에 어떤 사이였는지 판정한다.
 * 서버가 없어서 사람 정보를 링크 안에 담아 주고받는다.
 */

export type RelationGroup = "연인" | "가족" | "친구" | "라이벌" | "기타";

export interface PastLifeRelation {
  id: string;
  label: string;
  emoji: string;
  group: RelationGroup;
  /** 목록에 붙는 한 줄 */
  hint: string;
  /** 결과 화면에서 읽는 설명 */
  detail: string;
  /** 이번 생에 남은 영향 */
  effect: string;
  /** 유의할 점 */
  caution: string;
}

export const relations: PastLifeRelation[] = [
  {
    id: "couple",
    label: "전생부부",
    emoji: "💗",
    group: "연인",
    hint: "찰떡궁합",
    detail:
      "전생에 한집에서 밥을 나눠 먹던 사이예요. 그래서 지금도 말 없이 통하는 순간이 잦습니다.",
    effect: "서로에게 편안함과 안정",
    caution: "익숙함에 소홀해지지 않기",
  },
  {
    id: "ex",
    label: "옛연인",
    emoji: "🌹",
    group: "연인",
    hint: "미련 있음",
    detail:
      "끝맺음이 아쉬웠던 관계예요. 이번 생에서는 서로에게 못 다 한 말을 대신 건네게 됩니다.",
    effect: "자꾸 신경 쓰이는 마음",
    caution: "지난 이야기를 되감지 않기",
  },
  {
    id: "firstlove",
    label: "첫사랑",
    emoji: "🌷",
    group: "연인",
    hint: "설렘 남음",
    detail:
      "멀리서 오래 바라보던 자리예요. 가까워지는 데 시간이 걸리지만 한번 닿으면 오래 갑니다.",
    effect: "설렘이 오래 가는 관계",
    caution: "혼자 앞서 나가지 않기",
  },
  {
    id: "guardian",
    label: "수호자",
    emoji: "🛡️",
    group: "가족",
    hint: "지켜주던 사람",
    detail:
      "전생에 이 사람이 당신을 지켜 주던 자리에 있었어요. 힘든 순간에 먼저 떠오르는 이유입니다.",
    effect: "힘들 때 먼저 떠오르는 사람",
    caution: "기대기만 하지 않기",
  },
  {
    id: "blood",
    label: "피붙이",
    emoji: "👪",
    group: "가족",
    hint: "한 핏줄",
    detail:
      "가족으로 얽혔던 인연이에요. 처음 만났는데 편했다면 그 자리에서 온 감각입니다.",
    effect: "처음부터 편한 사이",
    caution: "가깝다고 말을 함부로 하지 않기",
  },
  {
    id: "savior",
    label: "은인",
    emoji: "🍀",
    group: "가족",
    hint: "도움 받음",
    detail:
      "전생에 큰 도움을 받았던 사이예요. 이번 생에서는 갚는 쪽으로 방향이 놓여 있습니다.",
    effect: "갚고 싶은 마음이 남음",
    caution: "부담으로 만들지 않기",
  },
  {
    id: "bestie",
    label: "단짝",
    emoji: "🧸",
    group: "친구",
    hint: "늘 붙어 다님",
    detail:
      "어디를 가든 함께였던 자리예요. 오래 못 봐도 다시 만나면 어제 본 것 같습니다.",
    effect: "오래 못 봐도 그대로",
    caution: "연락을 너무 미루지 않기",
  },
  {
    id: "partner",
    label: "공범",
    emoji: "🎭",
    group: "친구",
    hint: "같이 사고 침",
    detail:
      "같이 일을 벌이던 사이예요. 둘이 모이면 지금도 일이 커집니다.",
    effect: "둘이 모이면 일이 커짐",
    caution: "충동적인 결정 함께 하지 않기",
  },
  {
    id: "teacher",
    label: "스승",
    emoji: "📖",
    group: "친구",
    hint: "배움을 줌",
    detail:
      "가르치고 배우던 자리예요. 이 사람의 말은 유난히 오래 남습니다.",
    effect: "이 사람 말이 오래 남음",
    caution: "조언을 그대로만 따르지 않기",
  },
  {
    id: "rival",
    label: "숙명의 적",
    emoji: "⚔️",
    group: "라이벌",
    hint: "만나면 싸움",
    detail:
      "서로를 겨루던 자리예요. 미워서가 아니라 닮아서 부딪히는 관계입니다.",
    effect: "서로를 자극해 성장시킴",
    caution: "이기려는 마음이 앞서지 않기",
  },
  {
    id: "debtor",
    label: "빚쟁이",
    emoji: "💰",
    group: "라이벌",
    hint: "돈 조심",
    detail:
      "셈이 남은 관계예요. 이번 생에서 돈이 오가면 마음까지 상하기 쉽습니다.",
    effect: "셈이 오갈 일이 생김",
    caution: "돈거래는 만들지 않기",
  },
  {
    id: "feud",
    label: "앙숙",
    emoji: "😾",
    group: "라이벌",
    hint: "사사건건 부딪힘",
    detail:
      "사소한 데서 계속 어긋나던 사이예요. 큰일에서는 오히려 손발이 맞습니다.",
    effect: "사소한 데서 자주 부딪힘",
    caution: "작은 일로 오래 끌지 않기",
  },
  {
    id: "benefactor",
    label: "귀인",
    emoji: "💎",
    group: "기타",
    hint: "귀한 인연",
    detail:
      "결정적인 순간에 길을 열어 주던 사람이에요. 이번 생에도 그 역할이 남아 있습니다.",
    effect: "결정적일 때 길을 열어 줌",
    caution: "필요할 때만 찾지 않기",
  },
  {
    id: "passerby",
    label: "스쳐간 인연",
    emoji: "🍃",
    group: "기타",
    hint: "잠깐 스침",
    detail:
      "짧게 스쳤던 자리예요. 인연의 실이 얇지만 끊어지지는 않았습니다.",
    effect: "얇지만 끊기지 않는 실",
    caution: "무리해서 붙잡지 않기",
  },
];

export const relationGroups: RelationGroup[] = [
  "연인",
  "가족",
  "친구",
  "라이벌",
  "기타",
];

export const findRelation = (id: string) =>
  relations.find((r) => r.id === id) ?? relations[relations.length - 1];

/** 링크로 오가는 최소한의 사주정보 */
export interface PastLifePerson {
  name: string;
  birthDate: string;
  birthTime: string | null;
  gender: Gender;
  calendar: CalendarKind;
}

export const toPerson = (p: {
  name: string;
  birthDate: string;
  birthTime: string | null;
  gender: Gender;
  calendar: CalendarKind;
}): PastLifePerson => ({
  name: p.name,
  birthDate: p.birthDate,
  birthTime: p.birthTime,
  gender: p.gender,
  calendar: p.calendar,
});

/** 사람을 가리키는 열쇠 — 같은 사람이면 늘 같은 문자열 */
export const personKey = (p: PastLifePerson) =>
  [p.name.trim(), p.birthDate, p.birthTime ?? "", p.gender, p.calendar].join("|");

export interface Verdict {
  relation: PastLifeRelation;
  /** 인연의 세기 (랭킹에 쓴다) */
  strength: number;
}

/**
 * 두 사람의 전생 관계 판정.
 * 순서를 정렬해서 섞으므로 누가 먼저 열어도 결과가 같다.
 */
export function judge(a: PastLifePerson, b: PastLifePerson): Verdict {
  const seed = hashString([personKey(a), personKey(b)].sort().join("//"));
  return {
    relation: relations[seed % relations.length],
    strength: 41 + ((seed >>> 8) % 59),
  };
}

/* --- 링크 --- */

export const encodePerson = (p: PastLifePerson) =>
  toBase64Url(
    JSON.stringify([p.name, p.birthDate, p.birthTime, p.gender, p.calendar]),
  );

export function decodePerson(code: string): PastLifePerson | null {
  try {
    const [name, birthDate, birthTime, gender, calendar] = JSON.parse(
      fromBase64Url(code),
    ) as [string, string, string | null, Gender, CalendarKind];
    if (!name || !birthDate) return null;
    return { name, birthDate, birthTime, gender, calendar };
  } catch {
    return null;
  }
}

const origin = () =>
  typeof window === "undefined" ? "" : window.location.origin;

/** 친구에게 뿌리는 내 고유 링크 */
export const inviteUrl = (owner: PastLifePerson) =>
  `${origin()}${asset("/past-life/join/")}?i=${encodePerson(owner)}`;

/** 친구가 나에게 결과를 돌려보내는 링크 */
export const reportUrl = (friend: PastLifePerson) =>
  `${origin()}${asset("/past-life/")}?add=${encodePerson(friend)}`;

/* --- 내가 모은 인연 --- */

export interface PastLifeLink {
  id: string;
  /** 어느 사주정보 기준으로 맺은 인연인지 */
  ownerKey: string;
  person: PastLifePerson;
  relationId: string;
  strength: number;
  foundAt: number;
}

const NO_LINKS: PastLifeLink[] = [];
/** 이 시간 안에 들어온 인연은 새 인연으로 본다 */
const NEW_MS = 24 * 60 * 60 * 1000;

export function useNetwork(owner: SajuProfile | null) {
  const [all, setAll] = useStore<PastLifeLink[]>(KEY.pastLife, NO_LINKS);
  /* 이 화면을 연 시각 — 렌더할 때마다 시계를 읽으면 결과가 흔들린다 */
  const [openedAt] = useState(() => Date.now());
  const ownerKey = owner ? personKey(toPerson(owner)) : null;

  const links = ownerKey
    ? all
        .filter((l) => l.ownerKey === ownerKey)
        .sort((a, b) => b.foundAt - a.foundAt)
    : NO_LINKS;

  /** 이미 있는 사람이면 다시 넣지 않는다 */
  const addLink = useCallback(
    (person: PastLifePerson) => {
      if (!owner || !ownerKey) return null;

      /* 저장소의 최신 목록으로 확인한다 — 같은 사람은 두 번 넣지 않는다 */
      const current = readStore<PastLifeLink[]>(KEY.pastLife, NO_LINKS);
      const key = personKey(person);
      const found = current.find(
        (l) => l.ownerKey === ownerKey && personKey(l.person) === key,
      );
      if (found) return found;

      const verdict = judge(toPerson(owner), person);
      const link: PastLifeLink = {
        id: newId(),
        ownerKey,
        person,
        relationId: verdict.relation.id,
        strength: verdict.strength,
        foundAt: Date.now(),
      };
      writeStore(KEY.pastLife, [link, ...current]);
      return link;
    },
    [owner, ownerKey],
  );

  const removeLink = useCallback(
    (id: string) => setAll((prev) => prev.filter((l) => l.id !== id)),
    [setAll],
  );

  /** 그룹별 인원 */
  const counts = relationGroups.map((group) => ({
    group,
    count: links.filter((l) => findRelation(l.relationId).group === group).length,
  }));

  const ranking = [...links].sort((a, b) => b.strength - a.strength);
  const newCount = links.filter((l) => isNewLink(l, openedAt)).length;

  return { links, addLink, removeLink, counts, ranking, newCount, openedAt };
}

/** 화면을 연 시각 기준으로 새 인연인지 본다 (렌더 중에 시계를 읽지 않기 위해) */
export const isNewLink = (link: PastLifeLink, now: number) =>
  now - link.foundAt < NEW_MS;
