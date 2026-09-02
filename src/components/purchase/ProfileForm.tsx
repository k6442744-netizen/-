"use client";

import { useId, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import {
  calendarOptions,
  dateToDigits,
  digitsToDate,
  digitsToTime,
  emptyDraft,
  formatDateInput,
  formatTimeInput,
  genderOptions,
  relationOptions,
  timeToDigits,
  validateDraft,
  type CalendarKind,
  type Gender,
  type ProfileDraft,
  type Relation,
} from "@/lib/profiles";

const fieldClass =
  "min-h-[46px] w-full rounded-win border bg-white px-3 text-[15px] text-ink outline-none transition-colors placeholder:text-silver-mid focus:border-brand-pink";

type FieldKey = keyof ProfileDraft;
type Errors = Partial<Record<FieldKey, string>>;

interface ProfileFormProps {
  /** 수정할 때 넘기는 기존 값 */
  initial?: ProfileDraft;
  /** 새로 넣을 때 미리 골라 둘 관계 (첫 사람은 본인) */
  defaultRelation?: Relation;
  /** 나와의 관계를 물을 필요가 없는 자리에서는 감춘다 */
  showRelation?: boolean;
  submitLabel?: string;
  onSubmit: (draft: ProfileDraft) => void;
  onCancel?: () => void;
  /** 넘기면 삭제 버튼이 붙는다 */
  onDelete?: () => void;
}

/**
 * 사주정보 입력 폼.
 *
 * 사주는 태어난 시(時)와 음/양력까지 맞아야 풀이가 어긋나지 않으므로 여섯 항목을 받는다.
 * 생년월일·시간은 달력/시계 피커 대신 숫자로 직접 받고, 잘못 넣으면
 * 그 항목의 도움말 자리에 무엇이 잘못됐는지 대신 띄운다.
 */
export function ProfileForm({
  initial,
  defaultRelation = "self",
  showRelation = true,
  submitLabel = "저장하기",
  onSubmit,
  onCancel,
  onDelete,
}: ProfileFormProps) {
  const uid = useId();
  const [draft, setDraft] = useState<ProfileDraft>(
    initial ?? emptyDraft(defaultRelation),
  );

  /* 화면에 보이는 값은 숫자만 담고, 저장 형식으로는 그때그때 바꾼다 */
  const [birthDigits, setBirthDigits] = useState(() =>
    initial?.birthDate ? dateToDigits(initial.birthDate) : "",
  );
  const [timeDigits, setTimeDigits] = useState(() =>
    initial?.birthTime ? timeToDigits(initial.birthTime) : "",
  );
  /* 시간을 아직 안 적은 것과 `모름`은 다르게 다룬다 */
  const [unknownTime, setUnknownTime] = useState(
    () => initial?.birthTime === null,
  );

  /* 아직 손대지 않은 항목까지 빨갛게 만들지 않으려고 따로 기억해 둔다 */
  const [touched, setTouched] = useState<Partial<Record<FieldKey, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);

  const patch = (next: Partial<ProfileDraft>) =>
    setDraft((prev) => ({ ...prev, ...next }));

  const touch = (key: FieldKey) =>
    setTouched((prev) => (prev[key] ? prev : { ...prev, [key]: true }));

  const changeBirth = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 8);
    setBirthDigits(digits);
    patch({ birthDate: digitsToDate(digits) ?? "" });
  };

  const changeTime = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    setTimeDigits(digits);
    patch({ birthTime: digitsToTime(digits) });
  };

  const toggleUnknownTime = (checked: boolean) => {
    setUnknownTime(checked);
    if (checked) setTimeDigits("");
    patch({ birthTime: checked ? null : digitsToTime(timeDigits) });
  };

  /* 지금 값 기준 오류 — 고치는 즉시 다시 계산된다 */
  const errors: Errors = validateDraft(draft);

  if (!birthDigits) {
    errors.birthDate = "생년월일을 입력해 주세요.";
  } else if (birthDigits.length < 8) {
    errors.birthDate = "생년월일 8자리를 모두 입력해 주세요.";
  } else if (!digitsToDate(birthDigits)) {
    errors.birthDate = "없는 날짜예요. 월·일을 다시 확인해 주세요.";
  }

  if (!unknownTime) {
    if (!timeDigits) {
      errors.birthTime = "시간을 넣거나 모른다고 표시해 주세요.";
    } else if (timeDigits.length < 4) {
      errors.birthTime = "시간 4자리를 모두 입력해 주세요.";
    } else if (!digitsToTime(timeDigits)) {
      errors.birthTime = "없는 시각이에요. 00:00~23:59 안에서 넣어 주세요.";
    }
  }

  /* 한 번이라도 손댔거나 저장을 눌렀을 때만 보여 준다 */
  const errorOf = (key: FieldKey) =>
    submitted || touched[key] ? errors[key] : undefined;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (Object.keys(errors).length > 0) return;
    onSubmit({
      ...draft,
      name: draft.name.trim(),
      birthTime: unknownTime ? null : digitsToTime(timeDigits),
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <Field
        label="이름"
        htmlFor={`${uid}-name`}
        messageId={`${uid}-name-msg`}
        error={errorOf("name")}
      >
        <input
          id={`${uid}-name`}
          value={draft.name}
          onChange={(e) => patch({ name: e.target.value })}
          onBlur={() => touch("name")}
          placeholder="이름을 입력해 주세요"
          maxLength={12}
          autoComplete="off"
          aria-invalid={Boolean(errorOf("name"))}
          aria-describedby={`${uid}-name-msg`}
          className={`${fieldClass} ${errorOf("name") ? "border-brand-pink" : "border-line"}`}
        />
      </Field>

      {showRelation ? (
        <Chips
          label="나와의 관계"
          name={`${uid}-relation`}
          options={relationOptions}
          value={draft.relation}
          onChange={(relation: Relation) => patch({ relation })}
        />
      ) : null}

      <Field
        label="생년월일"
        htmlFor={`${uid}-birth`}
        messageId={`${uid}-birth-msg`}
        hint="숫자 8자리만 입력하면 돼요. 19940315 → 1994.03.15"
        error={errorOf("birthDate")}
      >
        <input
          id={`${uid}-birth`}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          value={formatDateInput(birthDigits)}
          onChange={(e) => changeBirth(e.target.value)}
          onBlur={() => touch("birthDate")}
          placeholder="예) 1994.03.15"
          maxLength={10}
          aria-invalid={Boolean(errorOf("birthDate"))}
          aria-describedby={`${uid}-birth-msg`}
          className={`${fieldClass} ${errorOf("birthDate") ? "border-brand-pink" : "border-line"}`}
        />
      </Field>

      <Segmented
        label="달력"
        name={`${uid}-calendar`}
        options={calendarOptions}
        value={draft.calendar}
        onChange={(calendar: CalendarKind) => patch({ calendar })}
      />

      <Field
        label="태어난 시간"
        htmlFor={`${uid}-time`}
        messageId={`${uid}-time-msg`}
        hint="24시 기준 숫자 4자리 — 오전 9시 30분(09:30)이면 0930. 시간을 넣으면 시주(時柱)까지 반영해요."
        error={errorOf("birthTime")}
      >
        <input
          id={`${uid}-time`}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          value={formatTimeInput(timeDigits)}
          disabled={unknownTime}
          onChange={(e) => changeTime(e.target.value)}
          onBlur={() => touch("birthTime")}
          placeholder="예) 09:30"
          maxLength={5}
          aria-invalid={Boolean(errorOf("birthTime"))}
          aria-describedby={`${uid}-time-msg`}
          className={`${fieldClass} ${errorOf("birthTime") ? "border-brand-pink" : "border-line"} disabled:bg-silver disabled:text-silver-mid`}
        />
        <label className="mt-2 flex min-h-[32px] w-fit cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={unknownTime}
            onChange={(e) => toggleUnknownTime(e.target.checked)}
            className="size-[18px] shrink-0 accent-[color:var(--pink-primary)]"
          />
          <span className="dot-text text-[14px] text-ink-soft">
            태어난 시간을 몰라요
          </span>
        </label>
      </Field>

      <Segmented
        label="성별"
        name={`${uid}-gender`}
        options={genderOptions}
        value={draft.gender}
        onChange={(gender: Gender) => patch({ gender })}
      />

      <div className="flex gap-2 pt-1">
        {onCancel ? (
          <Button tone="neutral" className="flex-1" onClick={onCancel}>
            취소
          </Button>
        ) : null}
        <button
          type="submit"
          className="inline-flex min-h-[44px] flex-[2] items-center justify-center rounded-win border border-[#ff8ec7] bg-white px-5 text-[15px] font-semibold text-brand-pink transition-colors duration-150 hover:bg-page-pink active:bg-[#ffdcee]"
        >
          {submitLabel}
        </button>
      </div>

      {onDelete ? (
        <button
          type="button"
          onClick={onDelete}
          className="mx-auto block min-h-[40px] px-3 text-[13px] text-silver-mid underline-offset-4 transition-colors hover:text-ink-soft hover:underline"
        >
          이 사주정보 삭제하기
        </button>
      ) : null}
    </form>
  );
}

/**
 * 라벨 + 입력 + 메시지 한 세트.
 * 도움말과 오류는 같은 자리를 쓴다 — 오류가 있으면 도움말 대신 오류를 띄운다.
 */
function Field({
  label,
  htmlFor,
  messageId,
  hint,
  error,
  children,
}: {
  label: string;
  htmlFor?: string;
  /** 입력의 `aria-describedby` 와 연결되는 메시지 id */
  messageId: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-[13px] font-semibold text-ink"
      >
        {label}
      </label>
      {children}
      <p
        id={messageId}
        role={error ? "alert" : undefined}
        className={`mt-1.5 dot-text text-[12px] leading-[1.6] ${
          error ? "text-brand-pink" : "text-silver-mid"
        } ${error || hint ? "" : "hidden"}`}
      >
        {error ?? hint}
      </p>
    </div>
  );
}

/** 관계처럼 항목이 많아 한 줄에 다 안 들어가는 값 — 칩으로 흘려 놓는다 */
function Chips<T extends string>({
  label,
  name,
  options,
  value,
  onChange,
}: {
  label: string;
  name: string;
  options: [T, string][];
  value: T;
  onChange: (next: T) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-1.5 block text-[13px] font-semibold text-ink">
        {label}
      </legend>
      <div className="flex flex-wrap gap-1.5">
        {options.map(([key, text]) => {
          const active = key === value;
          return (
            <label
              key={key}
              className={`flex min-h-[38px] cursor-pointer items-center rounded-win border px-3.5 text-[14px] font-semibold transition-colors ${
                active
                  ? "border-brand-pink bg-page-pink text-brand-pink"
                  : "border-line bg-white text-ink-soft hover:bg-silver"
              }`}
            >
              <input
                type="radio"
                name={name}
                value={key}
                checked={active}
                onChange={() => onChange(key)}
                className="sr-only"
              />
              {text}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

/** 성별·달력처럼 값이 두셋뿐인 항목 — 셀렉트 대신 한 줄에 펼쳐 놓는다 */
function Segmented<T extends string>({
  label,
  name,
  options,
  value,
  onChange,
}: {
  label: string;
  name: string;
  options: [T, string][];
  value: T;
  onChange: (next: T) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-1.5 block text-[13px] font-semibold text-ink">
        {label}
      </legend>
      <div className="flex gap-1.5">
        {options.map(([key, text]) => {
          const active = key === value;
          return (
            <label
              key={key}
              className={`flex min-h-[44px] flex-1 cursor-pointer items-center justify-center rounded-win border text-[14px] font-semibold transition-colors ${
                active
                  ? "border-brand-pink bg-page-pink text-brand-pink"
                  : "border-line bg-white text-ink-soft hover:bg-silver"
              }`}
            >
              <input
                type="radio"
                name={name}
                value={key}
                checked={active}
                onChange={() => onChange(key)}
                className="sr-only"
              />
              {text}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
