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
import {
  decodePerson,
  judge,
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
          {owner.name}님과
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
  const link = reportUrl(me);

  const send = async () => {
    const text = `${owner.name}님, 우리는 전생에 ${relation.label}이었대요! 결과를 보내드릴게요.`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "전생 관계 결과", text, url: link });
        return;
      } catch {
        /* 공유창을 닫은 경우 — 복사로 넘어간다 */
      }
    }
    try {
      await navigator.clipboard.writeText(link);
      toast("결과 링크를 복사했어요");
    } catch {
      toast("링크를 길게 눌러 복사해 주세요");
    }
  };

  return (
    <Shell title="전생 관계 결과">
      <section className="border-b border-silver bg-[linear-gradient(180deg,#faf7ff_0%,#ffffff_70%)] px-[var(--page-padding)] pb-8 pt-8 text-center">
        <DotLabel className="text-[13px] text-ink-soft">
          {owner.name}님과 당신은
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

        <p className="mx-auto mt-6 max-w-[280px] dot-text text-[15px] leading-[1.85] text-ink-body">
          {relation.detail}
        </p>
      </section>

      <Padded className="pb-10 pt-6">
        <dl className="overflow-hidden rounded-win border border-line bg-white">
          {[
            ["인연의 깊이", `${strength}%`],
            ["이번 생 영향", relation.effect],
            ["유의할 점", relation.caution],
          ].map(([label, value], i) => (
            <div
              key={label}
              className={`flex items-center justify-between gap-3 px-3.5 py-3 ${i > 0 ? "border-t border-silver" : ""}`}
            >
              <dt className="shrink-0 dot-text text-[13px] text-ink-soft">
                {label}
              </dt>
              <dd className="text-right text-[14px] font-bold text-ink">
                {value}
              </dd>
            </div>
          ))}
        </dl>

        <button
          type="button"
          onClick={send}
          className="mt-6 flex min-h-[52px] w-full items-center justify-center rounded-win border border-[#a97cff] bg-white text-[16px] font-bold text-brand-lav transition-colors hover:bg-page-lav active:bg-[#e6d8ff]"
        >
          {owner.name}님에게 결과 보내기
        </button>

        {/* 참여한 김에 자기 판별기도 만들게 한다 */}
        <Link
          href="/past-life"
          className={buttonClass({ className: "mt-2.5 w-full" })}
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
