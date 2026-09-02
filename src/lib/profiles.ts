/**
 * 사주정보(프로필) — 상품을 볼 때 넣는 생년월일 정보.
 *
 * 처음 입력한 하나가 `기본 사주정보`가 되고, 이후에는 다른 사람을 추가해
 * 상품마다 골라서 볼 수 있다. 저장·조회는 `src/lib/account.ts` 훅이 맡는다.
 */

export type Gender = "female" | "male";
/** 목록에서 사람을 한눈에 구분하는 라벨 */
export type Relation = "self" | "partner" | "friend" | "family" | "other";
/** 음력은 평달/윤달을 나눠 받아야 사주 변환이 어긋나지 않는다 */
export type CalendarKind = "solar" | "lunar" | "lunar-leap";

export interface SajuProfile {
  id: string;
  name: string;
  /** YYYY-MM-DD */
  birthDate: string;
  /** HH:MM — 모르면 null (`시간 모름`) */
  birthTime: string | null;
  gender: Gender;
  calendar: CalendarKind;
  relation: Relation;
  createdAt: number;
  /** 마지막으로 이 사람으로 운세를 본 시각 — 목록 순서에 쓴다 */
  lastUsedAt?: number;
}

/** 저장 전 입력값 — id/createdAt 은 저장 시점에 붙는다 */
export type ProfileDraft = Omit<SajuProfile, "id" | "createdAt">;

export const genderLabel: Record<Gender, string> = {
  female: "여자",
  male: "남자",
};

export const relationLabel: Record<Relation, string> = {
  self: "본인",
  partner: "연인",
  friend: "친구",
  family: "가족",
  other: "기타",
};

export const calendarLabel: Record<CalendarKind, string> = {
  solar: "양력",
  lunar: "음력",
  "lunar-leap": "음력 윤달",
};

export const genderOptions = Object.entries(genderLabel) as [Gender, string][];
export const relationOptions = Object.entries(relationLabel) as [
  Relation,
  string,
][];
export const calendarOptions = Object.entries(calendarLabel) as [
  CalendarKind,
  string,
][];

/** 첫 사람은 대개 본인이고, 그다음부터는 다른 사람을 넣는다 */
export const emptyDraft = (relation: Relation = "self"): ProfileDraft => ({
  name: "",
  birthDate: "",
  birthTime: null,
  gender: "female",
  calendar: "solar",
  relation,
});

export const toDraft = (p: SajuProfile): ProfileDraft => ({
  name: p.name,
  birthDate: p.birthDate,
  birthTime: p.birthTime,
  gender: p.gender,
  calendar: p.calendar,
  relation: p.relation,
});

/** `1994.03.15` */
export const formatDate = (birthDate: string) => birthDate.replaceAll("-", ".");

/** `09:30` — 사주는 시(時)가 중요해서 모를 때도 그 사실을 그대로 적는다 */
export const formatTime = (birthTime: string | null) =>
  birthTime ?? "시간 모름";

/** 목록 한 줄 요약 — `본인 · 1994.03.15 · 09:30` (양력이면 달력 표기는 생략) */
export function summarizeProfile(p: SajuProfile) {
  const date =
    p.calendar === "solar"
      ? formatDate(p.birthDate)
      : `${calendarLabel[p.calendar]} ${formatDate(p.birthDate)}`;
  return [relationLabel[p.relation], date, formatTime(p.birthTime)].join(" · ");
}

/** 결제 확인처럼 정보를 빠짐없이 보여 줄 때 — `양력 1994.03.15 · 09:30 · 여자` */
export function describeProfile(p: SajuProfile) {
  return [
    `${calendarLabel[p.calendar]} ${formatDate(p.birthDate)}`,
    formatTime(p.birthTime),
    genderLabel[p.gender],
  ].join(" · ");
}

/** 만 나이 — 카드에 한 줄 덧붙이는 용도 */
export function ageOf(birthDate: string, today = new Date()) {
  const [y, m, d] = birthDate.split("-").map(Number);
  if (!y) return null;
  let age = today.getFullYear() - y;
  const passed =
    today.getMonth() + 1 > m ||
    (today.getMonth() + 1 === m && today.getDate() >= d);
  if (!passed) age -= 1;
  return age;
}

/* --- 숫자 입력 변환 ---
   생년월일·시간은 달력/시계 피커 대신 숫자로 직접 받는다.
   화면에는 `1994.03.15` / `09:30` 로 보이지만 저장은 늘 ISO 형식이다. */

export const dateToDigits = (iso: string) => iso.replaceAll("-", "");

/** `19940315` → `1994-03-15` (8자리가 아니거나 없는 날짜면 null) */
export function digitsToDate(digits: string) {
  if (!/^\d{8}$/.test(digits)) return null;
  const [y, m, d] = [
    digits.slice(0, 4),
    digits.slice(4, 6),
    digits.slice(6, 8),
  ];
  const date = new Date(`${y}-${m}-${d}T00:00:00`);
  if (Number.isNaN(date.getTime())) return null;
  /* 2월 31일처럼 없는 날짜는 Date 가 다음 달로 넘겨 버리므로 되돌려 확인한다 */
  if (date.getMonth() + 1 !== Number(m) || date.getDate() !== Number(d)) {
    return null;
  }
  return `${y}-${m}-${d}`;
}

/** 입력 중에도 읽히도록 점을 끼워 넣는다 — `1994.03.15` */
export const formatDateInput = (digits: string) =>
  [digits.slice(0, 4), digits.slice(4, 6), digits.slice(6, 8)]
    .filter(Boolean)
    .join(".");

export const timeToDigits = (time: string) => time.replace(":", "");

/** `0930` → `09:30` (24시 기준. 없는 시각이면 null) */
export function digitsToTime(digits: string) {
  if (!/^\d{4}$/.test(digits)) return null;
  const [h, m] = [Number(digits.slice(0, 2)), Number(digits.slice(2, 4))];
  if (h > 23 || m > 59) return null;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** 입력 중 `09:3` 처럼 콜론을 끼워 넣는다 */
export const formatTimeInput = (digits: string) =>
  digits.length > 2 ? `${digits.slice(0, 2)}:${digits.slice(2)}` : digits;

/** 사주 서비스가 다루는 가장 이른 생년 */
export const MIN_BIRTH_YEAR = 1900;

/** 입력 검증 — 필드별 오류 메시지. 비어 있으면 통과 */
export function validateDraft(draft: ProfileDraft) {
  const errors: Partial<Record<keyof ProfileDraft, string>> = {};

  const name = draft.name.trim();
  if (!name) errors.name = "이름을 입력해 주세요.";
  else if (name.length > 12) errors.name = "이름은 12자까지 넣을 수 있어요.";

  if (!draft.birthDate) {
    errors.birthDate = "생년월일을 입력해 주세요.";
  } else {
    const date = new Date(`${draft.birthDate}T00:00:00`);
    if (Number.isNaN(date.getTime())) {
      errors.birthDate = "생년월일을 다시 확인해 주세요.";
    } else if (date.getFullYear() < MIN_BIRTH_YEAR) {
      errors.birthDate = `${MIN_BIRTH_YEAR}년 이후만 입력할 수 있어요.`;
    } else if (date.getTime() > Date.now()) {
      errors.birthDate = "오늘보다 뒤의 날짜는 넣을 수 없어요.";
    }
  }

  return errors;
}

export const isValidDraft = (draft: ProfileDraft) =>
  Object.keys(validateDraft(draft)).length === 0;
