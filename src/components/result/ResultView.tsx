"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AppFrame, Padded } from "@/components/layout/AppFrame";
import { SubHeader } from "@/components/layout/SubHeader";
import { Footer } from "@/components/layout/Footer";
import { FortuneLoading } from "./FortuneLoading";
import { DotLabel } from "@/components/y2k/DotLabel";
import { HeartCoin } from "@/components/ui/HeartCoin";
import { buttonClass } from "@/components/ui/Button";
import { useArchive } from "@/lib/archive";
import { useHydrated } from "@/lib/store";
import { buildResult } from "@/lib/fortune-result";
import { relationAvatar, toneText } from "@/lib/tone";
import { describeProfile } from "@/lib/profiles";
import { findProduct, peopleOf } from "@/lib/products";

/** 풀이 연출을 보여 주는 시간 */
const LOADING_MS = 1800;

const formatWhen = (at: number) =>
  new Date(at).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

/**
 * 운세 결과지.
 *
 * 읽는 화면이라 장식은 두지 않는다 — 남기는 그래픽은 점수와 막대 그래프뿐이다.
 * 결과 자체는 보관함에 저장된 씨앗으로 다시 만들어 내므로,
 * 보관함에서 몇 번을 열어도 처음 본 것과 같은 내용이 나온다.
 */
export function ResultView() {
  const params = useSearchParams();
  const id = params.get("id");
  /* 방금 결제하고 넘어온 경우에만 풀이 연출을 보여 준다 */
  const isNew = params.get("new") === "1";

  const hydrated = useHydrated();
  const { findEntry } = useArchive();
  const entry = id ? findEntry(id) : undefined;

  const [reading, setReading] = useState(isNew);
  useEffect(() => {
    if (!isNew) return;
    const timer = window.setTimeout(() => setReading(false), LOADING_MS);
    return () => window.clearTimeout(timer);
  }, [isNew]);

  const product = entry ? findProduct(entry.productId) : undefined;

  if (!hydrated || reading) {
    return (
      <AppFrame>
        <SubHeader title="운세 결과" />
        <main className="flex flex-1 flex-col">
          <FortuneLoading object={product?.object} image={product?.image} />
        </main>
      </AppFrame>
    );
  }

  if (!entry || !product) {
    return (
      <AppFrame>
        <SubHeader title="운세 결과" />
        <main className="flex flex-1 flex-col items-center justify-center px-[var(--page-padding)] py-16 text-center">
          <p className="dot-title text-[18px] text-ink">결과를 찾을 수 없어요</p>
          <p className="mt-2 dot-text text-[14px] leading-[1.7] text-ink-soft">
            링크가 만료됐거나 보관함에서 지워진 결과예요.
          </p>
          <Link href="/" className={buttonClass({ className: "mt-6 px-8" })}>
            홈으로 가기
          </Link>
        </main>
        <Footer />
      </AppFrame>
    );
  }

  const { tone, name, type } = product;
  const result = buildResult(product, entry.people, entry.seed);
  const couple = peopleOf(product) === 2;

  return (
    <AppFrame>
      <SubHeader title="운세 결과" />

      <main className="flex-1">
        <Padded className="pb-8 pt-7">
          {/* --- 무엇을, 누구의 것으로 봤는지 --- */}
          <header className="border-b border-silver pb-5">
            <DotLabel className={`text-[12px] ${toneText[tone]}`}>
              {type}
            </DotLabel>
            <h2 className="mt-1.5 text-[24px] font-bold leading-[1.32] tracking-[-0.02em] text-ink">
              {name}
            </h2>
            <p className="mt-1.5 dot-text text-[13px] text-silver-mid">
              {formatWhen(entry.createdAt)}
            </p>

            <ul className="mt-4 space-y-1.5">
              {entry.people.map((person) => (
                <li key={person.id} className="flex items-center gap-2.5">
                  <span
                    aria-hidden="true"
                    className={`flex size-7 shrink-0 items-center justify-center rounded-full text-[12px] font-bold ${relationAvatar[person.relation]}`}
                  >
                    {person.name.slice(0, 1)}
                  </span>
                  <span className="text-[14px] font-bold text-ink">
                    {person.name}
                  </span>
                  <span className="min-w-0 truncate dot-text text-[13px] text-ink-soft">
                    {describeProfile(person)}
                  </span>
                </li>
              ))}
            </ul>
          </header>

          {/* --- 수치 --- */}
          <section
            aria-label={result.scoreLabel}
            className="mt-6 rounded-win border border-line bg-white px-4 py-6"
          >
            <div className="text-center">
              <DotLabel className="text-[12px] text-silver-mid">
                {result.scoreLabel}
              </DotLabel>
              <p className="mt-1.5 flex items-end justify-center gap-1">
                <span className="dot-title text-[44px] leading-none text-heart">
                  {result.score}
                </span>
                <span className="dot-text pb-1 text-[15px] font-bold text-ink-soft">
                  점
                </span>
              </p>

              <div
                aria-hidden="true"
                className="mt-3.5 h-2 w-full overflow-hidden rounded-full bg-silver"
              >
                <span
                  className="block h-full rounded-full bg-brand-pink-soft"
                  style={{ width: `${result.score}%` }}
                />
              </div>

              <p className="mt-4 dot-title text-[17px] leading-[1.45] text-ink">
                {result.headline}
              </p>
            </div>

            {/* 총점을 항목별로 쪼갠 막대 */}
            <dl className="mt-5 space-y-2.5 border-t border-silver pt-5">
              {result.breakdown.map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <dt className="w-12 shrink-0 dot-text text-[13px] text-ink-soft">
                    {item.label}
                  </dt>
                  <dd className="flex flex-1 items-center gap-2.5">
                    <span
                      aria-hidden="true"
                      className="h-1.5 flex-1 overflow-hidden rounded-full bg-silver"
                    >
                      <span
                        className="block h-full rounded-full bg-brand-lav-soft"
                        style={{ width: `${item.value}%` }}
                      />
                    </span>
                    <span className="w-7 shrink-0 text-right dot-text text-[13px] font-bold tabular-nums text-ink">
                      {item.value}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          {/* --- 본문 --- */}
          <p className="mt-7 dot-text text-[15px] leading-[1.85] text-ink-body">
            {result.intro}
          </p>

          <p className="mt-4 border-l-2 border-brand-pink-soft bg-page-pink/60 px-3.5 py-3 dot-text text-[13px] leading-[1.75] text-ink-body">
            {result.highlight}
          </p>

          <div className="mt-2">
            {result.sections.map((section) => (
              <section
                key={section.title}
                className="mt-6 border-t border-silver pt-6 first:border-t-0"
              >
                <h3 className="dot-title text-[17px] text-ink">
                  {section.title}
                </h3>
                <div className="mt-2.5 space-y-3">
                  {section.paragraphs.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="dot-text text-[15px] leading-[1.85] text-ink-body"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* --- 정리 --- */}
          <section className="mt-8 border-t border-silver pt-6">
            <h3 className="dot-title text-[17px] text-ink">이렇게 해보세요</h3>
            <ol className="mt-3 space-y-2.5">
              {result.advice.map((line, i) => (
                <li key={line} className="flex items-start gap-2.5">
                  <span
                    aria-hidden="true"
                    className="mt-px w-4 shrink-0 dot-text text-[14px] font-bold text-brand-pink"
                  >
                    {i + 1}
                  </span>
                  <span className="dot-text text-[15px] leading-[1.6] text-ink-body">
                    {line}
                  </span>
                </li>
              ))}
            </ol>
          </section>

          <dl className="mt-6 grid grid-cols-3 divide-x divide-silver overflow-hidden rounded-win border border-line bg-white">
            {[
              ["행운의 색", result.lucky.color],
              ["행운의 물건", result.lucky.item],
              ["행운의 요일", result.lucky.day],
            ].map(([label, value]) => (
              <div key={label} className="px-2 py-4 text-center">
                <dt className="dot-text text-[12px] text-silver-mid">{label}</dt>
                <dd className="mt-1.5 text-[14px] font-bold leading-[1.4] text-ink">
                  {value}
                </dd>
              </div>
            ))}
          </dl>

          <p className="mt-7 flex items-center justify-center gap-1.5 dot-text text-[13px] text-silver-mid">
            하트 {entry.hearts}개
            <HeartCoin size={13} />를 써서 본 {couple ? "궁합" : "운세"}예요.
          </p>

          <div className="mt-3 flex gap-2">
            {/* 결과를 다 읽은 뒤의 이동 버튼 — 강조할 자리가 아니라 무채색으로 둔다 */}
            <Link
              href="/archive"
              className={buttonClass({ tone: "neutral", className: "flex-1" })}
            >
              보관함 보기
            </Link>
            <Link
              href="/"
              className={buttonClass({ tone: "neutral", className: "flex-1" })}
            >
              홈으로
            </Link>
          </div>
        </Padded>
      </main>

      <Footer />
    </AppFrame>
  );
}
