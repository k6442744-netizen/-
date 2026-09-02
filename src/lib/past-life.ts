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

export type RelationGroup =
  | "연애"
  | "인연"
  | "친구"
  | "코믹"
  | "악연"
  | "특이";

export interface PastLifeRelation {
  id: string;
  /** 2~6글자. 여러 명이 한 화면에 쌓이므로 한눈에 읽혀야 한다 */
  label: string;
  emoji: string;
  group: RelationGroup;
  /** 현생 관계 키워드 — 목록에서 이름 옆에 붙는 짧은 말 */
  hint: string;
  /** 한 줄 설명 — 목록과 결과 화면 머리에 쓴다 */
  detail: string;
  /** 전생의 장면 한 문장 — 결과 풀이의 첫 문단 */
  story: string;
}

/**
 * 전생 관계 결과 60종.
 *
 * 한 화면에 여러 사람의 결과가 쌓이는 1:N 서비스라 이름이 짧고 서로 확실히 달라야 한다.
 * 진지한 결과만 이어지면 재미가 없어서 코믹·악연을 섞어 뒀다.
 */
export const relations: PastLifeRelation[] = [
  /* --- 연애 · 설렘 --- */
  { id: "spouse", label: "전생부부", emoji: "💍", group: "연애", hint: "편안함", detail: "한 생을 오래 함께 살았던 사이", story: "오래 한집에서 같은 아침을 맞던 장면이 보입니다." },
  { id: "ex", label: "옛연인", emoji: "🌹", group: "연애", hint: "미련", detail: "사랑했지만 결국 다른 길을 택한 사이", story: "같은 자리에서 등을 돌려 각자의 길로 갔던 흔적이 남아 있습니다." },
  { id: "firstlove", label: "첫사랑", emoji: "🌷", group: "연애", hint: "설렘", detail: "처음으로 마음이 흔들렸던 사이", story: "말도 붙이지 못한 채 멀리서 바라보던 시간이 길었습니다." },
  { id: "crush", label: "짝사랑", emoji: "💌", group: "연애", hint: "여운", detail: "한쪽만 오래 마음에 담아 둔 사이", story: "마음을 접어 둔 채로 곁을 지키던 자리였습니다." },
  { id: "forbidden", label: "금지된사랑", emoji: "🔒", group: "연애", hint: "아슬함", detail: "세상이 막아서 숨겨야 했던 사이", story: "남의 눈을 피해 만나던 시간이 대부분이었습니다." },
  { id: "arranged", label: "정략결혼", emoji: "🎎", group: "연애", hint: "의무감", detail: "집안이 맺어 준 사이", story: "서로를 고르지 못한 채 맺어졌던 자리입니다." },
  { id: "almost", label: "전생썸", emoji: "💭", group: "연애", hint: "애매함", detail: "끝내 시작하지 못한 사이", story: "몇 번이나 말을 꺼내려다 그대로 삼켰습니다." },
  { id: "unfinished", label: "못다한사랑", emoji: "🕯️", group: "연애", hint: "아쉬움", detail: "약속만 남기고 헤어진 사이", story: "다시 만나자는 약속만 남기고 흩어졌습니다." },
  { id: "runaway-love", label: "도망연인", emoji: "🏃", group: "연애", hint: "충동", detail: "손 잡고 함께 도망쳤던 사이", story: "짐도 없이 손만 잡고 길을 나섰던 밤이 있었습니다." },
  { id: "destined", label: "운명짝꿍", emoji: "🧵", group: "연애", hint: "재회", detail: "실이 계속 이어져 다시 만나던 사이", story: "헤어져도 다른 마을에서 또 마주치곤 했습니다." },
  { id: "mirror-love", label: "거울연인", emoji: "🪞", group: "연애", hint: "공감", detail: "서로를 너무 닮아 힘들었던 사이", story: "같은 성질이라 서로를 단번에 알아보고, 또 그만큼 힘들어했습니다." },
  { id: "rehearsal", label: "이별연습", emoji: "🌊", group: "연애", hint: "반복", detail: "만나고 헤어지길 반복한 사이", story: "붙었다 떨어지길 계절마다 반복했습니다." },
  { id: "letter-love", label: "편지연인", emoji: "📮", group: "연애", hint: "그리움", detail: "얼굴보다 글로 더 자주 만난 사이", story: "얼굴보다 글씨를 더 오래 들여다보던 사이였습니다." },
  { id: "night-guest", label: "밤손님", emoji: "🌙", group: "연애", hint: "비밀", detail: "밤에만 만날 수 있었던 사이", story: "해가 지고서야 문을 두드릴 수 있는 관계였습니다." },
  { id: "summer-love", label: "여름연인", emoji: "🎐", group: "연애", hint: "추억", detail: "한 계절만 뜨거웠던 사이", story: "한 계절이 지나자 약속도 없이 멀어졌습니다." },

  /* --- 좋은 인연 · 귀인 --- */
  { id: "benefactor", label: "귀인", emoji: "💎", group: "인연", hint: "행운", detail: "중요한 순간마다 도움을 준 사이", story: "결정적인 길목마다 이 사람이 서 있었습니다." },
  { id: "savior-debt", label: "은인", emoji: "🍀", group: "인연", hint: "감사", detail: "큰 은혜를 베풀어 준 사이", story: "갚을 수 없을 만큼 큰 것을 받았던 자리입니다." },
  { id: "guardian", label: "수호자", emoji: "🛡️", group: "인연", hint: "든든함", detail: "곁에서 묵묵히 지켜 주던 사이", story: "앞이 아니라 뒤에서 조용히 지켜보던 사람이었습니다." },
  { id: "rescuer", label: "구원자", emoji: "🕊️", group: "인연", hint: "안도", detail: "벼랑 끝에서 손을 내밀어 준 사이", story: "모두가 등을 돌렸을 때 혼자 손을 내밀었습니다." },
  { id: "guide", label: "길잡이", emoji: "🧭", group: "인연", hint: "방향", detail: "갈 길을 알려 주던 사이", story: "길을 잃을 때마다 방향을 일러 주었습니다." },
  { id: "king-strategist", label: "왕과책사", emoji: "👑", group: "인연", hint: "신뢰", detail: "한 사람이 다른 사람의 머리가 되어 준 사이", story: "한 사람이 결정하고 한 사람이 판을 읽었습니다." },
  { id: "teacher", label: "스승제자", emoji: "📖", group: "인연", hint: "배움", detail: "가르치고 배우던 사이", story: "배우는 쪽과 가르치는 쪽이 분명했습니다." },
  { id: "comrade", label: "전우", emoji: "🎖️", group: "인연", hint: "의리", detail: "같은 편에서 끝까지 버틴 사이", story: "같은 편에 서서 끝까지 자리를 지켰습니다." },
  { id: "business", label: "동업자", emoji: "🤝", group: "인연", hint: "협력", detail: "함께 일을 일으킨 사이", story: "함께 일을 벌이고 함께 키웠습니다." },
  { id: "fated-mate", label: "운명동료", emoji: "🧶", group: "인연", hint: "인연", detail: "어디서 다시 만나도 같은 일을 하던 사이", story: "어느 생에서 만나도 늘 같은 일을 하고 있었습니다." },
  { id: "village", label: "한마을", emoji: "🌾", group: "인연", hint: "익숙함", detail: "같은 땅에서 나고 자란 사이", story: "같은 우물을 쓰고 같은 계절을 났습니다." },
  { id: "healer", label: "약손", emoji: "🩹", group: "인연", hint: "위로", detail: "아플 때 곁에서 돌봐 주던 사이", story: "아플 때 약을 달이고 밤새 곁을 지켰습니다." },

  /* --- 친구 · 일상 --- */
  { id: "childhood", label: "소꿉친구", emoji: "🧸", group: "친구", hint: "편함", detail: "어릴 적부터 붙어 다니던 사이", story: "걷기도 전부터 붙어 다녔습니다." },
  { id: "drinking", label: "술친구", emoji: "🍻", group: "친구", hint: "수다", detail: "밤마다 이야기를 나누던 사이", story: "밤이 깊도록 이야기가 끊이지 않았습니다." },
  { id: "meal", label: "밥친구", emoji: "🍚", group: "친구", hint: "정", detail: "끼니를 나눠 먹던 사이", story: "넉넉하지 않아도 밥은 늘 나눠 먹었습니다." },
  { id: "traveler", label: "길동무", emoji: "🥾", group: "친구", hint: "동행", detail: "먼 길을 함께 걸은 사이", story: "목적지보다 함께 걷는 길이 좋았습니다." },
  { id: "troublemaker", label: "사고뭉치", emoji: "🧨", group: "친구", hint: "사고주의", detail: "붙어 다니며 사고를 치던 사이", story: "둘만 모이면 꼭 무슨 일이 벌어졌습니다." },
  { id: "escape-mate", label: "도망메이트", emoji: "🎒", group: "친구", hint: "도피", detail: "힘들면 같이 튀어 버리던 사이", story: "힘들어지면 말없이 같이 사라졌습니다." },
  { id: "bestie", label: "단짝", emoji: "🫧", group: "친구", hint: "찰떡", detail: "늘 둘이 하나처럼 붙어 있던 사이", story: "한 사람이 가면 다른 사람도 따라갔습니다." },
  { id: "neighbor", label: "이웃사촌", emoji: "🏠", group: "친구", hint: "친근함", detail: "담 하나를 사이에 두고 살던 사이", story: "담 하나를 사이에 두고 하루를 나눴습니다." },
  { id: "one-pot", label: "한솥밥", emoji: "🍲", group: "친구", hint: "가족같음", detail: "한집에서 같은 밥을 먹던 사이", story: "피는 섞이지 않았지만 한 상에서 먹었습니다." },

  /* --- 코믹 · 밈 --- */
  { id: "debtor", label: "빚쟁이", emoji: "💸", group: "코믹", hint: "돈 조심", detail: "돈 때문에 질겨져 버린 사이", story: "갚겠다는 말만 남기고 해가 몇 번 바뀌었습니다." },
  { id: "sponsor", label: "물주", emoji: "🏦", group: "코믹", hint: "지갑주의", detail: "한쪽이 계속 대 주던 사이", story: "계산할 때가 되면 늘 한쪽이 먼저 일어섰습니다." },
  { id: "bankrupt", label: "같이망함", emoji: "📉", group: "코믹", hint: "동업금지", detail: "크게 벌였다가 나란히 무너진 사이", story: "크게 벌였다가 나란히 빈손이 됐습니다." },
  { id: "accomplice", label: "공범", emoji: "🕵️", group: "코믹", hint: "비밀유지", detail: "둘이 붙어 다니며 일을 꾸미던 사이", story: "둘만 아는 일이 꽤 많았습니다." },
  { id: "freeloader", label: "얻어먹기", emoji: "🍜", group: "코믹", hint: "계산주의", detail: "늘 한쪽이 사 주던 사이", story: "얻어먹은 날이 사 준 날보다 훨씬 많았습니다." },
  { id: "bet", label: "내기상대", emoji: "🐔", group: "코믹", hint: "승부욕", detail: "사사건건 내기를 걸던 사이", story: "사소한 것까지 걸고 겨뤘습니다." },
  { id: "tab", label: "외상장부", emoji: "🧾", group: "코믹", hint: "정산필요", detail: "아직 갚을 것이 남은 사이", story: "장부에 이름이 계속 올라갔습니다." },
  { id: "errand", label: "심부름꾼", emoji: "🛒", group: "코믹", hint: "부탁주의", detail: "잔심부름을 도맡던 사이", story: "부탁이 또 다른 부탁을 불렀습니다." },
  { id: "trickster", label: "낚시꾼", emoji: "🎣", group: "코믹", hint: "속지말기", detail: "자꾸 속아 넘어가던 사이", story: "속는 줄 알면서도 매번 또 넘어갔습니다." },
  { id: "midnight-run", label: "야반도주", emoji: "🚪", group: "코믹", hint: "즉흥", detail: "한밤중에 같이 튀어 버린 사이", story: "뒷일은 생각도 않고 밤길을 나섰습니다." },
  { id: "cleanup", label: "뒷수습", emoji: "🧹", group: "코믹", hint: "수고", detail: "한쪽이 늘 뒤를 치워 주던 사이", story: "벌이는 사람과 치우는 사람이 정해져 있었습니다." },
  { id: "trap-mate", label: "덫동무", emoji: "🪤", group: "코믹", hint: "조심", detail: "서로를 자꾸 곤란하게 만들던 사이", story: "서로를 곤란하게 만드는 재주가 있었습니다." },

  /* --- 라이벌 · 악연 --- */
  { id: "nemesis", label: "숙적", emoji: "⚔️", group: "악연", hint: "경쟁", detail: "만날 때마다 서로를 이기려 한 사이", story: "마주칠 때마다 승부가 붙었습니다." },
  { id: "foe", label: "원수", emoji: "🔥", group: "악연", hint: "거리두기", detail: "크게 부딪혀 갈라선 사이", story: "한 번의 일로 완전히 갈라섰습니다." },
  { id: "feud", label: "앙숙", emoji: "😾", group: "악연", hint: "다툼", detail: "사소한 것마다 부딪히던 사이", story: "큰일보다 사소한 데서 늘 부딪혔습니다." },
  { id: "traitor", label: "배신자", emoji: "🐍", group: "악연", hint: "신중", detail: "믿음을 저버렸던 사이", story: "가장 믿었던 쪽이 등을 돌렸습니다." },
  { id: "revenge", label: "복수상대", emoji: "🗡️", group: "악연", hint: "매듭", detail: "아직 갚을 것이 남은 사이", story: "갚아야 할 것이 끝내 남았습니다." },
  { id: "lovehate", label: "애증관계", emoji: "🌗", group: "악연", hint: "복잡함", detail: "미워하면서도 놓지 못하던 사이", story: "미워하면서도 소식은 늘 궁금해했습니다." },
  { id: "rival", label: "경쟁자", emoji: "🏹", group: "악연", hint: "자극", detail: "같은 것을 두고 겨루던 사이", story: "같은 것을 두고 오래 겨뤘습니다." },
  { id: "watcher", label: "감시자", emoji: "👁️", group: "악연", hint: "긴장", detail: "서로를 지켜보던 사이", story: "서로의 움직임을 계속 지켜봤습니다." },
  { id: "tangled", label: "질긴인연", emoji: "⛓️", group: "악연", hint: "재회", detail: "끊으려 해도 계속 이어지던 사이", story: "끊었다고 생각하면 또 이어져 있었습니다." },

  /* --- 신박한 관계 --- */
  { id: "passerby", label: "스친인연", emoji: "🌫️", group: "특이", hint: "잔상", detail: "잠깐 스쳤는데 오래 남은 사이", story: "한 번 스쳤을 뿐인데 오래 기억에 남았습니다." },
  { id: "companion-animal", label: "전생반려", emoji: "🐈", group: "특이", hint: "무조건적", detail: "사람과 동물로 만났던 사이", story: "사람과 짐승으로 만나 말없이 곁을 지켰습니다." },
  { id: "voyage", label: "항해동료", emoji: "🚢", group: "특이", hint: "모험", detail: "같은 배를 타고 떠돌던 사이", story: "육지보다 바다 위에서 함께한 날이 길었습니다." },
];

export const relationGroups: RelationGroup[] = [
  "연애",
  "인연",
  "친구",
  "코믹",
  "악연",
  "특이",
];

/** 관계 유형별 색 — 사람이 많아져도 유형이 한눈에 갈리게 한다 */
export const groupColor: Record<
  RelationGroup,
  { solid: string; soft: string; text: string }
> = {
  연애: { solid: "bg-[#ff6fb5]", soft: "bg-[#ffd9ec]", text: "text-[#d1247e]" },
  인연: { solid: "bg-[#4fb0da]", soft: "bg-[#d3eefb]", text: "text-[#1f7fae]" },
  친구: { solid: "bg-[#5cbf8f]", soft: "bg-[#d6f2e5]", text: "text-[#1f7d55]" },
  코믹: { solid: "bg-[#efab35]", soft: "bg-[#ffeac2]", text: "text-[#9a6b12]" },
  악연: { solid: "bg-[#9b6bff]", soft: "bg-[#e5d8ff]", text: "text-[#6b3fc7]" },
  특이: { solid: "bg-silver-mid", soft: "bg-silver", text: "text-ink-soft" },
};

export const findRelation = (id: string) =>
  relations.find((r) => r.id === id) ?? relations[relations.length - 1];

/** 링크로 오가는 최소한의 사주정보 */
export interface PastLifePerson {
  name: string;
  birthDate: string;
  birthTime: string | null;
  gender: Gender;
  calendar: CalendarKind;
  /** 친구에게 보여 줄 이름 — 판정에는 쓰지 않는다 */
  alias?: string;
}

/** 화면에 쓰는 이름 (별칭이 있으면 그것으로) */
export const displayName = (p: PastLifePerson) => p.alias?.trim() || p.name;

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

/* --- 결과 풀이 --- */

/** 카테고리별 — 이번 생에서 어떤 관계로 이어지는지 */
const groupReading: Record<RelationGroup, { flow: string; advice: string }> = {
  연애: {
    flow: "이번 생에서도 마음이 먼저 움직이는 관계로 이어집니다. 잘 지내다가도 한 번씩 온도 차가 크게 벌어지는데, 대개 한쪽이 먼저 지친 자리에서 벌어집니다.",
    advice: "표현을 미루지 마세요. 이 결의 관계는 말하지 않으면 상대가 끝까지 모릅니다.",
  },
  인연: {
    flow: "이번 생에서는 도움이 오가는 자리로 이어집니다. 급한 일이 생겼을 때 이 사람 이름이 먼저 떠오를 거예요.",
    advice: "받기만 하지 말고 한 번은 먼저 챙겨 보세요. 그때 관계가 한 단계 깊어집니다.",
  },
  친구: {
    flow: "이번 생에서도 편안한 거리에서 오래 가는 사이입니다. 특별한 일이 없어도 자연스럽게 이어지고, 오래 못 봐도 어색해지지 않습니다.",
    advice: "연락이 뜸해져도 걱정하지 마세요. 대신 한 번쯤은 먼저 안부를 물어 주세요.",
  },
  코믹: {
    flow: "이번 생에서는 웃을 일이 많은 대신 셈이 얽히기 쉬운 관계입니다. 즐겁게 지내다 돈이나 부탁에서 한 번 크게 어긋날 수 있어요.",
    advice: "돈과 부탁만 분명히 해 두면 이보다 편한 사이가 없습니다.",
  },
  악연: {
    flow: "이번 생에서는 서로를 자극하는 자리로 이어집니다. 부딪히는 만큼 각자 크게 자라지만, 그 과정이 늘 편하지는 않습니다.",
    advice: "이기려 들면 둘 다 지칩니다. 한 발 물러서는 쪽이 결국 앞서 갑니다.",
  },
  특이: {
    flow: "이번 생에서는 예상하지 못한 순간에 다시 닿는 관계입니다. 계획해서 만나지는 않지만 필요한 때에 나타납니다.",
    advice: "억지로 붙잡지 않아도 됩니다. 이 인연은 알아서 제자리를 찾습니다.",
  },
};

/** 인연도 구간별 — 실이 얼마나 굵게 남았는지 */
export function depthReading(strength: number) {
  if (strength >= 85) {
    return "인연의 실이 굵고 짧습니다. 전생의 기억이 거의 그대로 남아 있어서, 처음 만났는데도 익숙했을 거예요.";
  }
  if (strength >= 65) {
    return "인연의 실이 알맞게 이어져 있습니다. 자주 보지 않아도 필요한 순간에는 다시 닿습니다.";
  }
  return "인연의 실이 가늘게 남아 있습니다. 스치듯 지나간 자리지만 완전히 끊어지지는 않았어요.";
}

/** 결과 화면에서 읽는 풀이 묶음 */
export function readVerdict(relation: PastLifeRelation, strength: number) {
  const { flow, advice } = groupReading[relation.group];
  return {
    story: `${relation.detail}예요. ${relation.story}`,
    flow,
    depth: depthReading(strength),
    advice,
  };
}

/* --- 한 줄평 --- */

/** 내 사주를 두고 하는 한마디 — 같은 사주면 늘 같은 문장 */
const myReadings = [
  "곁에 사람이 끊이지 않는 사주예요",
  "한번 맺은 인연을 길게 끌고 가는 사주예요",
  "먼저 다가가기보다 불러들이는 사주예요",
  "귀인이 자주 스쳐 가는 사주예요",
  "정을 주고 마음을 쓰는 자리에 서는 사주예요",
  "시작보다 마무리가 좋은 사주예요",
  "말보다 행동으로 사람을 남기는 사주예요",
  "낯선 자리에서 인연이 트이는 사주예요",
  "오래 두고 봐야 진가가 보이는 사주예요",
  "사람을 끌어모으는 기운이 강한 사주예요",
  "혼자 있는 시간이 오히려 인연을 부르는 사주예요",
  "돌아온 인연이 더 깊어지는 사주예요",
];

export const readMySaju = (owner: PastLifePerson) =>
  myReadings[hashString(personKey(owner)) % myReadings.length];

/** 모인 결과를 두고 어떤 복이 많은지 한 줄로 정리한다 */
const luckByGroup: Record<RelationGroup, { title: string; detail: string }> = {
  연애: {
    title: "인연복",
    detail: "마음이 오가는 인연이 유난히 많이 붙어요",
  },
  인연: {
    title: "귀인복",
    detail: "결정적인 순간에 도와주는 사람이 많아요",
  },
  친구: {
    title: "사람복",
    detail: "곁을 지켜 주는 사람이 넉넉한 인생이에요",
  },
  코믹: {
    title: "웃음복",
    detail: "같이 사고 치고 같이 웃을 사람이 많아요",
  },
  악연: {
    title: "자극복",
    detail: "부딪히면서 크게 자라는 인연이 많아요",
  },
  특이: {
    title: "묘한복",
    detail: "예상 못 한 자리에서 인연이 트이는 편이에요",
  },
};

export function summarizeLuck(counts: { group: RelationGroup; count: number }[]) {
  const total = counts.reduce((sum, c) => sum + c.count, 0);
  if (total === 0) return null;

  /* 같은 수면 앞선 유형(연애 → 인연 → …)을 택한다 */
  const top = counts.reduce((best, item) =>
    item.count > best.count ? item : best,
  );
  return { ...luckByGroup[top.group], group: top.group, count: top.count, total };
}

/* --- 링크 --- */

export const encodePerson = (p: PastLifePerson) =>
  toBase64Url(
    JSON.stringify([
      p.name,
      p.birthDate,
      p.birthTime,
      p.gender,
      p.calendar,
      /* 여섯 번째 값은 나중에 붙인 것이라 없어도 예전 링크가 열린다 */
      p.alias ?? "",
    ]),
  );

export function decodePerson(code: string): PastLifePerson | null {
  try {
    const [name, birthDate, birthTime, gender, calendar, alias] = JSON.parse(
      fromBase64Url(code),
    ) as [string, string, string | null, Gender, CalendarKind, string?];
    if (!name || !birthDate) return null;
    return { name, birthDate, birthTime, gender, calendar, alias: alias || undefined };
  } catch {
    return null;
  }
}

const origin = () =>
  typeof window === "undefined" ? "" : window.location.origin;

/** 친구에게 뿌리는 내 고유 링크 */
export const inviteUrl = (owner: PastLifePerson) =>
  `${origin()}${asset("/past-life/join/")}?i=${encodePerson(owner)}`;

/** 표시 이름 — 링크와 지도에 보이는 이름만 바꾼다 */
export function useAlias() {
  const [alias, setAlias] = useStore<string>(KEY.pastLifeAlias, "");
  return { alias, setAlias };
}

/** 친구가 나에게 결과를 돌려보내는 링크 */
export const reportUrl = (friend: PastLifePerson) =>
  `${origin()}${asset("/past-life/")}?add=${encodePerson(friend)}`;

/* --- 내가 모은 인연 --- */

export interface PastLifeLink {
  id: string;
  /** 화면 확인용으로 넣은 샘플인지 — 한 번에 비울 수 있게 표시해 둔다 */
  sample?: boolean;
  /** 어느 사주정보 기준으로 맺은 인연인지 */
  ownerKey: string;
  person: PastLifePerson;
  relationId: string;
  strength: number;
  foundAt: number;
}

const NO_LINKS: PastLifeLink[] = [];

/** 화면을 채워 보기 위한 샘플 — 실제 참여자와 섞이지 않도록 표시를 달고 넣는다 */
export const samplePeople: PastLifePerson[] = [
  { name: "민지", birthDate: "1997-05-23", birthTime: "14:30", gender: "female", calendar: "solar" },
  { name: "수빈", birthDate: "1995-11-08", birthTime: "03:10", gender: "female", calendar: "solar" },
  { name: "현우", birthDate: "1993-02-17", birthTime: null, gender: "male", calendar: "lunar" },
  { name: "서연", birthDate: "1999-08-30", birthTime: "21:45", gender: "female", calendar: "solar" },
  { name: "지현", birthDate: "1996-12-05", birthTime: "09:20", gender: "female", calendar: "solar" },
  { name: "애진", birthDate: "1992-07-14", birthTime: "17:05", gender: "female", calendar: "lunar" },
  { name: "유진", birthDate: "2000-03-02", birthTime: null, gender: "female", calendar: "solar" },
  { name: "민석", birthDate: "1994-09-26", birthTime: "11:55", gender: "male", calendar: "solar" },
];

/** 샘플을 조금씩 앞당겨 넣어 최근 순서가 자연스럽게 보이게 한다 */
const SAMPLE_GAP_MS = 5 * 60 * 60 * 1000;

/** 많은 인원으로 화면을 확인할 때 쓰는 이름 풀 */
const sampleNames = [
  "민지", "수빈", "현우", "서연", "지현", "애진", "유진", "민석",
  "하윤", "다은", "예린", "채원", "소율", "지안", "은서", "가온",
  "태윤", "준서", "도현", "시우", "하진", "연우", "지호", "선우",
  "보라", "새롬", "다미", "여름", "가을", "봄이", "라온", "해나",
  "윤아", "세인", "지우", "리아", "수아", "나연", "정민", "혜리",
];

/** n명짜리 샘플을 만든다 — 생일·시간을 골고루 흩어 관계가 다양하게 나오게 한다 */
export function makeSamplePeople(count: number): PastLifePerson[] {
  return Array.from({ length: count }, (_, i) => {
    const year = 1988 + (i * 7) % 18;
    const month = 1 + (i * 5) % 12;
    const day = 1 + (i * 11) % 28;
    const hour = (i * 13) % 24;
    const minute = (i * 17) % 60;
    const suffix = i < sampleNames.length ? "" : String(Math.floor(i / sampleNames.length) + 1);

    return {
      name: `${sampleNames[i % sampleNames.length]}${suffix}`,
      birthDate: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
      birthTime: i % 5 === 0 ? null : `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
      gender: i % 3 === 0 ? ("male" as const) : ("female" as const),
      calendar: i % 7 === 0 ? ("lunar" as const) : ("solar" as const),
    };
  });
}
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

  /** 샘플 인연을 한 번에 채운다 */
  const addSamples = useCallback(
    (count = samplePeople.length) => {
    if (!owner || !ownerKey) return;
    const current = readStore<PastLifeLink[]>(KEY.pastLife, NO_LINKS);
    const now = Date.now();

    const people =
      count <= samplePeople.length
        ? samplePeople.slice(0, count)
        : makeSamplePeople(count);

    const additions = people
      .filter(
        (person) =>
          !current.some(
            (l) =>
              l.ownerKey === ownerKey && personKey(l.person) === personKey(person),
          ),
      )
      .map((person, i) => {
        const verdict = judge(toPerson(owner), person);
        return {
          id: newId(),
          ownerKey,
          person,
          relationId: verdict.relation.id,
          strength: verdict.strength,
          foundAt: now - i * SAMPLE_GAP_MS,
          sample: true,
        } satisfies PastLifeLink;
      });

      writeStore(KEY.pastLife, [...additions, ...current]);
    },
    [owner, ownerKey],
  );

  /** 샘플만 골라 비운다 */
  const clearSamples = useCallback(() => {
    const current = readStore<PastLifeLink[]>(KEY.pastLife, NO_LINKS);
    writeStore(
      KEY.pastLife,
      current.filter((l) => !l.sample),
    );
  }, []);

  const removeLink = useCallback(
    (id: string) => setAll((prev) => prev.filter((l) => l.id !== id)),
    [setAll],
  );

  /** 이 사주정보로 모은 인연을 전부 지운다 */
  const clearAll = useCallback(() => {
    if (!ownerKey) return;
    setAll((prev) => prev.filter((l) => l.ownerKey !== ownerKey));
  }, [ownerKey, setAll]);

  /** 그룹별 인원 */
  const counts = relationGroups.map((group) => ({
    group,
    count: links.filter((l) => findRelation(l.relationId).group === group).length,
  }));

  const ranking = [...links].sort((a, b) => b.strength - a.strength);
  const newCount = links.filter((l) => isNewLink(l, openedAt)).length;

  return {
    links,
    addLink,
    removeLink,
    addSamples,
    clearSamples,
    clearAll,
    hasSample: links.some((l) => l.sample),
    counts,
    ranking,
    newCount,
    openedAt,
  };
}

/** 화면을 연 시각 기준으로 새 인연인지 본다 (렌더 중에 시계를 읽지 않기 위해) */
export const isNewLink = (link: PastLifeLink, now: number) =>
  now - link.foundAt < NEW_MS;
