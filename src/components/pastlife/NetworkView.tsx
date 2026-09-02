"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AppFrame, Padded } from "@/components/layout/AppFrame";
import { SubHeader } from "@/components/layout/SubHeader";
import { Footer } from "@/components/layout/Footer";
import { buttonClass } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { DotLabel } from "@/components/y2k/DotLabel";
import { MyProfileModal } from "@/components/purchase/MyProfileModal";
import { RelationMap } from "./RelationMap";
import { OrbitBadge } from "./OrbitBadge";
import { useProfiles } from "@/lib/account";
import { useHydrated } from "@/lib/store";
import {
  decodePerson,
  findRelation,
  inviteUrl,
  isNewLink,
  toPerson,
  useNetwork,
} from "@/lib/past-life";
import { formatDate, formatTime } from "@/lib/profiles";

type Tab = "map" | "list";

/**
 * 내 전생 인맥.
 *
 * 내 사주정보로 고유 링크를 만들어 친구를 모으고,
 * 모인 인연을 맵·목록·랭킹으로 본다.
 */
export function NetworkView() {
  const params = useSearchParams();
  const hydrated = useHydrated();
  const { defaultProfile } = useProfiles();
  const { links, addLink, counts, ranking, newCount, openedAt } =
    useNetwork(defaultProfile);
  const toast = useToast();

  const [tab, setTab] = useState<Tab>("map");
  const [editing, setEditing] = useState(false);

  /* 친구가 보내온 결과 링크(`?add=`)로 들어오면 인맥에 넣는다 */
  const added = useRef<string | null>(null);
  const addCode = params.get("add");
  useEffect(() => {
    if (!addCode || !defaultProfile || added.current === addCode) return;
    const person = decodePerson(addCode);
    if (!person) return;
    added.current = addCode;
    const link = addLink(person);
    if (link) {
      const relation = findRelation(link.relationId);
      toast(
        `${person.name}님과는 전생에 ${relation.emoji} ${relation.label}!`,
      );
    }
  }, [addCode, addLink, defaultProfile, toast]);

  const share = async () => {
    if (!defaultProfile) return;
    const url = inviteUrl(toPerson(defaultProfile));
    const text = `나랑 전생에 어떤 사이였을까? 생년월일 넣으면 바로 나와!`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "전생관계 판별기", text, url });
        return;
      } catch {
        /* 공유창을 닫은 경우 — 복사로 넘어간다 */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      toast("내 링크를 복사했어요");
    } catch {
      toast("링크를 길게 눌러 복사해 주세요");
    }
  };

  if (!hydrated) {
    return (
      <Shell>
        <Padded className="py-16"> </Padded>
      </Shell>
    );
  }

  /* 기준이 될 사주정보가 있어야 판정할 수 있다 */
  if (!defaultProfile) {
    return (
      <Shell>
        <Padded className="py-16 text-center">
          <p className="dot-title text-[18px] text-ink">
            먼저 내 사주정보가 필요해요
          </p>
          <p className="mt-2 dot-text text-[14px] leading-[1.7] text-ink-soft">
            내 사주를 기준으로 친구들과의 전생 관계를 봐요.
          </p>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className={buttonClass({ className: "mt-6 px-8" })}
          >
            사주정보 입력하기
          </button>
        </Padded>
        <MyProfileModal open={editing} onClose={() => setEditing(false)} />
      </Shell>
    );
  }

  return (
    <Shell>
      <Padded className="pb-8 pt-6">
        {/* 기준이 되는 나 */}
        <section className="flex items-center gap-3 rounded-win border border-line bg-white px-3.5 py-3">
          <span
            aria-hidden="true"
            className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-lav text-[17px] font-bold text-white"
          >
            {defaultProfile.name.slice(0, 1)}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[16px] font-bold text-ink">
              {defaultProfile.name}
            </span>
            <span className="mt-0.5 block dot-text text-[13px] text-ink-soft">
              {formatDate(defaultProfile.birthDate)}{" "}
              {formatTime(defaultProfile.birthTime)}
            </span>
          </span>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="h-8 shrink-0 rounded-win border border-line bg-white px-3 text-[13px] font-semibold text-ink-soft transition-colors hover:bg-hover"
          >
            수정
          </button>
        </section>

        {/* 발견한 인연 수 + 유형별 */}
        <section className="mt-3 overflow-hidden rounded-win border border-line bg-[linear-gradient(140deg,#faf7ff_0%,#ffffff_58%,#fff6fb_100%)] px-4 py-4 shadow-card">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <DotLabel className="text-[13px] text-ink-soft">
                발견한 전생 인연
              </DotLabel>
              <p className="mt-1 flex items-end gap-1">
                <span className="dot-title text-[38px] leading-none text-brand-lav">
                  {links.length}
                </span>
                <span className="dot-text pb-1 text-[15px] font-bold text-ink-soft">
                  명
                </span>
              </p>
              {newCount > 0 ? (
                <p className="mt-2.5">
                  <span className="badge-pop inline-block rounded-full bg-brand-pink px-2.5 py-1 text-[11px] font-bold text-white">
                    NEW {newCount}
                  </span>
                </p>
              ) : null}
            </div>

            <OrbitBadge />
          </div>

          <dl className="mt-4 grid grid-cols-5 divide-x divide-silver rounded-win border border-line bg-white text-center">
            {counts.map(({ group, count }) => (
              <div key={group} className="px-1 py-2.5">
                <dt className="dot-text text-[11px] leading-tight text-silver-mid">
                  {group}
                </dt>
                <dd className="mt-1 text-[16px] font-bold text-ink">{count}</dd>
              </div>
            ))}
          </dl>
        </section>

        {links.length === 0 ? (
          <div className="py-12 text-center">
            <p className="dot-title text-[17px] text-ink">
              아직 찾은 인연이 없어요
            </p>
            <p className="mt-2 dot-text text-[14px] leading-[1.7] text-ink-soft">
              내 링크를 친구에게 보내면
              <br />
              전생에 어떤 사이였는지 바로 나와요.
            </p>
          </div>
        ) : (
          <>
            <div
              role="tablist"
              aria-label="보기 방식"
              className="mt-5 grid grid-cols-2 gap-1 rounded-win border border-line bg-white p-1"
            >
              {(
                [
                  ["map", "인연맵"],
                  ["list", "목록보기"],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={tab === key}
                  onClick={() => setTab(key)}
                  className={`min-h-[40px] rounded-win text-[14px] font-bold transition-colors ${
                    tab === key
                      ? "bg-page-lav text-brand-lav"
                      : "text-ink-soft hover:bg-hover"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {tab === "map" ? (
              <div className="mt-5">
                <RelationMap
                  ownerName={defaultProfile.name}
                  links={links}
                />
              </div>
            ) : (
              <ul className="mt-4 divide-y divide-silver overflow-hidden rounded-win border border-line bg-white">
                {links.map((link, i) => {
                  const relation = findRelation(link.relationId);
                  return (
                    <li
                      key={link.id}
                      className="row-in flex items-center gap-3 px-3.5 py-3 transition-colors hover:bg-page-lav/50"
                      /* 위에서부터 하나씩 떠오르게 한다 */
                      style={{ animationDelay: `${Math.min(i, 8) * 45}ms` }}
                    >
                      <span
                        aria-hidden="true"
                        className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(140deg,#ffb3dc_0%,#c9a6ff_100%)] text-[16px] font-bold text-white"
                      >
                        {link.person.name.slice(0, 1)}
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-1.5">
                          <span className="truncate text-[15px] font-bold text-ink">
                            {link.person.name}
                          </span>
                          {isNewLink(link, openedAt) ? (
                            <span className="badge-pop shrink-0 rounded-tag bg-brand-pink px-1.5 py-px text-[10px] font-bold text-white">
                              NEW
                            </span>
                          ) : null}
                        </span>
                        <span className="mt-1 flex flex-wrap items-center gap-1.5">
                          <span className="flex items-center gap-1 rounded-full bg-page-lav px-2 py-0.5 text-[12px] font-bold text-brand-lav">
                            <span aria-hidden="true">{relation.emoji}</span>
                            {relation.label}
                          </span>
                          <span className="rounded-full border border-line px-1.5 py-0.5 dot-text text-[11px] text-silver-mid">
                            {relation.hint}
                          </span>
                        </span>
                      </span>

                      <span className="shrink-0 text-right">
                        <span className="block dot-text text-[15px] font-bold leading-none text-brand-lav">
                          {link.strength}%
                        </span>
                        <span className="mt-1 block dot-text text-[11px] text-silver-mid">
                          인연도
                        </span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}

            {/* 랭킹 */}
            <section className="mt-6">
              <h3 className="dot-title text-[17px] text-ink">인연 랭킹</h3>
              <ol className="mt-3 space-y-2">
                {ranking.slice(0, 3).map((link, i) => {
                  const relation = findRelation(link.relationId);
                  return (
                    <li
                      key={link.id}
                      className={`flex items-center gap-3 rounded-win border px-3.5 py-3 ${
                        i === 0
                          ? "border-brand-pink bg-page-pink"
                          : "border-line bg-white"
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`dot-title w-5 shrink-0 text-[16px] ${i === 0 ? "text-brand-pink" : "text-silver-mid"}`}
                      >
                        {i + 1}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[15px] font-bold text-ink">
                          {link.person.name}
                        </span>
                        <span className="mt-0.5 block dot-text text-[13px] text-ink-soft">
                          {relation.emoji} {relation.label}
                        </span>
                      </span>
                      <span className="shrink-0 dot-text text-[15px] font-bold text-brand-lav">
                        {link.strength}%
                      </span>
                    </li>
                  );
                })}
              </ol>
            </section>
          </>
        )}
      </Padded>

      {/* 링크 공유 — 이 화면의 핵심 행동이라 아래에 붙여 둔다 */}
      <div className="sticky bottom-0 z-20 border-t border-silver bg-page/95 px-[var(--page-padding)] pb-[max(14px,env(safe-area-inset-bottom))] pt-3 backdrop-blur-[6px]">
        <button
          type="button"
          onClick={share}
          className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-win border border-[#a97cff] bg-white text-[16px] font-bold text-brand-lav transition-colors hover:bg-page-lav active:bg-[#e6d8ff]"
        >
          링크 공유하고 더 많은 인연 찾기
        </button>
      </div>

      <MyProfileModal open={editing} onClose={() => setEditing(false)} />
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <AppFrame>
      <SubHeader title="나의 전생 인맥" />
      <main className="flex-1">{children}</main>
      <Footer />
    </AppFrame>
  );
}
