"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AppFrame, Padded } from "@/components/layout/AppFrame";
import { SubHeader } from "@/components/layout/SubHeader";
import { buttonClass } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { PixelDecoration } from "@/components/y2k/PixelDecoration";
import { DotLabel } from "@/components/y2k/DotLabel";
import { ProfileForm } from "@/components/purchase/ProfileForm";
import { VerdictMap } from "./VerdictMap";
import {
  decodePerson,
  displayName,
  judge,
  readVerdict,
  reportUrl,
  type PastLifePerson,
} from "@/lib/past-life";
import type { ProfileDraft } from "@/lib/profiles";

/**
 * 친구 참여 화면.
 *
 * 링크에 담긴 초대자의 사주로 나와의 전생 관계를 판정한다.
 * 결과를 본 뒤에는 초대자에게 결과를 돌려보내거나,
 * 자기 판별기를 만들러 갈 수 있다.
 */
export function JoinView() {
  const params = useSearchParams();
  const code = params.get("i");
  const owner = code ? decodePerson(code) : null;
  const [me, setMe] = useState<PastLifePerson | null>(null);

  if (!owner) {
    return (
      <Shell>
        <Padded className="py-16 text-center">
          <p className="dot-title text-[18px] text-ink">
            열 수 없는 링크예요
          </p>
          <p className="mt-2 dot-text text-[14px] leading-[1.7] text-ink-soft">
            주소가 잘렸을 수 있어요. 보낸 분에게 링크를 다시 받아 주세요.
          </p>
          <Link href="/" className={buttonClass({ className: "mt-6 px-8" })}>
            홈으로 가기
          </Link>
        </Padded>
      </Shell>
    );
  }

  if (me) {
    return <VerdictView owner={owner} me={me} onRetry={() => setMe(null)} />;
  }

  return (
    <Shell>
      <section className="relative overflow-hidden border-b border-silver bg-[linear-gradient(180deg,#faf7ff_0%,#f3ecff_100%)] px-[var(--page-padding)] pb-7 pt-7">
        <PixelDecoration
          shape="star"
          size={14}
          className="absolute right-6 top-7 text-brand-lav-soft"
        />
        <PixelDecoration
          shape="sparkle"
          size={11}
          className="absolute right-14 top-[52px] text-brand-pink-soft"
        />

        <h2 className="max-w-[240px] text-[24px] font-bold leading-[1.38] tracking-[-0.02em] text-ink">
          {displayName(owner)}님과
          <br />
          당신은 전생에
          <br />
          어떤 사이였을까요?
        </h2>
        <p className="mt-3 dot-text text-[13px] leading-[1.7] text-ink-soft">
          정확한 결과를 위해
          <br />
          생년월일과 태어난 시간을 입력해 주세요
        </p>
      </section>

      <Padded className="pb-10 pt-6">
        <ProfileForm
          showRelation={false}
          submitLabel="결과 확인하기"
          onSubmit={(draft: ProfileDraft) =>
            setMe({
              name: draft.name,
              birthDate: draft.birthDate,
              birthTime: draft.birthTime,
              gender: draft.gender,
              calendar: draft.calendar,
            })
          }
        />

        <p className="mt-4 text-center dot-text text-[12px] leading-[1.7] text-silver-mid">
          입력한 정보는 결과 분석에만 쓰이고 이 기기에 저장되지 않아요.
        </p>
      </Padded>
    </Shell>
  );
}

/** 판정 결과 */
function VerdictView({
  owner,
  me,
  onRetry,
}: {
  owner: PastLifePerson;
  me: PastLifePerson;
  onRetry: () => void;
}) {
  const toast = useToast();
  const { relation, strength } = judge(owner, me);
  const reading = readVerdict(relation, strength);
  const link = reportUrl(me);
  /* 결과를 보내고 나면 다음에 무엇을 해야 하는지 알려 준다 */
  const [sent, setSent] = useState(false);

  const send = async () => {
    const text = `${displayName(owner)}님, 우리는 전생에 ${relation.label}이었대요! 결과를 보내드릴게요.`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "전생 관계 결과", text, url: link });
        setSent(true);
        return;
      } catch {
        /* 공유창을 닫은 경우 — 복사로 넘어간다 */
      }
    }
    try {
      await navigator.clipboard.writeText(link);
      setSent(true);
      toast("결과 링크를 복사했어요");
    } catch {
      toast("링크를 길게 눌러 복사해 주세요");
    }
  };

  return (
    <Shell title="전생 관계 결과">
      <section className="border-b border-silver bg-[linear-gradient(180deg,#faf7ff_0%,#ffffff_70%)] px-[var(--page-padding)] pb-8 pt-8 text-center">
        <DotLabel className="text-[13px] text-ink-soft">
          {displayName(owner)}님과 당신은
        </DotLabel>

        <p className="mt-3 flex items-center justify-center gap-2">
          <span aria-hidden="true" className="text-[30px] leading-none">
            {relation.emoji}
          </span>
          <span className="dot-title text-[32px] leading-none text-brand-lav">
            {relation.label}
          </span>
        </p>

        <p className="mt-4">
          <span className="inline-block rounded-full bg-page-pink px-3.5 py-1.5 text-[13px] font-bold text-brand-pink">
            {relation.hint}
          </span>
        </p>

        <div className="mt-6">
          <VerdictMap
            ownerName={displayName(owner)}
            myName={me.name}
            relation={relation}
            strength={strength}
          />
        </div>
      </section>

      <Padded className="pb-10 pt-6">
        <div className="rounded-win border border-line bg-white px-3.5 py-3.5">
          <div className="flex items-center justify-between">
            <span className="dot-text text-[13px] text-ink-soft">인연의 깊이</span>
            <span className="dot-text text-[16px] font-bold leading-none text-brand-lav">
              {strength}%
            </span>
          </div>
          <div
            aria-hidden="true"
            className="mt-2 h-2 w-full overflow-hidden rounded-full bg-silver"
          >
            <span
              className="block h-full rounded-full bg-brand-lav-soft"
              style={{ width: `${strength}%` }}
            />
          </div>

          <div className="mt-3.5 flex items-center justify-between border-t border-silver pt-3">
            <span className="dot-text text-[13px] text-ink-soft">
              현생 키워드
            </span>
            <span className="rounded-full bg-page-pink px-2.5 py-1 text-[13px] font-bold text-brand-pink">
              {relation.hint}
            </span>
          </div>
        </div>

        {/* 풀이 */}
        <div className="mt-6 space-y-5">
          {[
            ["전생의 두 사람", reading.story],
            ["이번 생의 흐름", reading.flow],
            ["인연의 세기", reading.depth],
          ].map(([title, body]) => (
            <section key={title}>
              <h3 className="dot-title text-[16px] text-ink">{title}</h3>
              <p className="mt-1.5 dot-text text-[15px] leading-[1.85] text-ink-body">
                {body}
              </p>
            </section>
          ))}

          <section className="rounded-win border border-line bg-page-lav/60 px-3.5 py-3">
            <h3 className="dot-title text-[15px] text-ink">이렇게 해보세요</h3>
            <p className="mt-1 dot-text text-[14px] leading-[1.75] text-ink-body">
              {reading.advice}
            </p>
          </section>
        </div>

        <div className="mt-7 border-t border-silver pt-6">
          <button
            type="button"
            onClick={send}
            className="flex min-h-[52px] w-full items-center justify-center rounded-win border border-[#a97cff] bg-white text-[16px] font-bold text-brand-lav transition-colors hover:bg-page-lav active:bg-[#e6d8ff]"
          >
            {displayName(owner)}님에게 결과 보내기
          </button>

          <p className="mt-2.5 dot-text text-[12px] leading-[1.7] text-silver-mid">
            {sent ? (
              <>
                링크가 준비됐어요. 카카오톡 등으로 {displayName(owner)}님께
                보내면 {displayName(owner)}님의 전생 인맥에 내가 추가돼요.
              </>
            ) : (
              <>
                누르면 내 결과가 담긴 링크가 만들어져요. 그 링크를{" "}
                {displayName(owner)}님께 보내면 {displayName(owner)}님의 전생
                인맥에 내가 추가됩니다.
              </>
            )}
          </p>
        </div>

        {/* 참여한 김에 자기 판별기도 만들게 한다 */}
        <Link
          href="/past-life"
          className={buttonClass({ className: "mt-3 w-full" })}
        >
          나도 전생 판별기 만들기
        </Link>

        <button
          type="button"
          onClick={onRetry}
          className="mx-auto mt-5 block min-h-[40px] px-3 text-[13px] text-silver-mid underline-offset-4 transition-colors hover:text-ink-soft hover:underline"
        >
          정보를 잘못 넣었어요
        </button>
      </Padded>
    </Shell>
  );
}

function Shell({
  title = "친구 참여하기",
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <AppFrame>
      <SubHeader title={title} />
      <main className="flex-1">{children}</main>
    </AppFrame>
  );
}
