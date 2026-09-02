"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AppFrame, Padded } from "@/components/layout/AppFrame";
import { SubHeader } from "@/components/layout/SubHeader";
import { Footer } from "@/components/layout/Footer";
import { Button, buttonClass } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { DotLabel } from "@/components/y2k/DotLabel";
import { MyProfileModal } from "@/components/purchase/MyProfileModal";
import { Icon } from "@/components/ui/Icon";
import { NetworkMenu } from "./NetworkMenu";
import { RelationMap } from "./RelationMap";
import { OrbitBadge } from "./OrbitBadge";
import { useProfiles } from "@/lib/account";
import { useSession } from "@/lib/session";
import { useHydrated } from "@/lib/store";
import {
  decodePerson,
  displayName,
  findRelation,
  groupColor,
  inviteUrl,
  isNewLink,
  readMySaju,
  relationGroups,
  summarizeLuck,
  toPerson,
  useAlias,
  useNetwork,
  type RelationGroup,
} from "@/lib/past-life";
import { describeProfile } from "@/lib/profiles";

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
  const { session } = useSession();
  const { alias, setAlias } = useAlias();
  const {
    links,
    addLink,
    addSamples,
    clearSamples,
    clearAll,
    hasSample,
    counts,
    ranking,
    newCount,
    openedAt,
  } = useNetwork(defaultProfile);
  const toast = useToast();

  const [tab, setTab] = useState<Tab>("map");
  const [editing, setEditing] = useState(false);
  /* 유형을 눌러 좁혀 볼 수 있게 — 사람이 많아질수록 이게 목록을 읽게 해 준다 */
  const [group, setGroup] = useState<RelationGroup | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

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

  const luck = summarizeLuck(counts);

  const shownLinks = group
    ? links.filter((l) => findRelation(l.relationId).group === group)
    : links;

  const share = async () => {
    if (!defaultProfile) return;
    const url = inviteUrl({ ...toPerson(defaultProfile), alias });
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

  /* 내 링크를 만들고 인연을 모으려면 계정이 있어야 한다 */
  if (!session) {
    return (
      <Shell>
        <Padded className="py-16 text-center">
          <p className="dot-title text-[18px] text-ink">
            로그인하고 시작해요
          </p>
          <p className="mt-2 dot-text text-[14px] leading-[1.7] text-ink-soft">
            내 링크와 모은 인연을 저장하려면 로그인이 필요해요.
            <br />
            친구가 참여하는 건 로그인 없이도 됩니다.
          </p>
          <Link
            href={`/login/?next=${encodeURIComponent("/past-life")}`}
            className={buttonClass({ variant: "primary", className: "mt-6 px-8" })}
          >
            로그인하기
          </Link>
        </Padded>
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
            className={buttonClass({ variant: "primary", className: "mt-6 px-8" })}
          >
            사주정보 입력하기
          </button>
        </Padded>
        <MyProfileModal open={editing} onClose={() => setEditing(false)} />
      </Shell>
    );
  }

  return (
    <Shell onMenu={() => setMenuOpen(true)}>
      <Padded className="pb-8 pt-6">
        {/* 기준이 되는 나 */}
        <section className="rounded-win border border-line bg-white px-4 py-3.5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[17px] font-bold text-ink">
                {displayName({ ...toPerson(defaultProfile), alias })}
              </p>
              <p className="mt-1 dot-text text-[13px] text-ink-soft">
                {describeProfile(defaultProfile)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="h-8 shrink-0 rounded-win border border-line bg-white px-3 text-[13px] font-semibold text-ink-soft transition-colors hover:bg-hover"
            >
              수정
            </button>
          </div>

          {/* 내 사주 한 줄평 */}
          <p className="mt-3 border-t border-silver pt-3 dot-text text-[14px] leading-[1.6] text-ink">
            <span aria-hidden="true" className="mr-1">
              🔮
            </span>
            {readMySaju(toPerson(defaultProfile))}
          </p>
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

          {/* 유형 칸이 곧 필터이자 색 범례가 된다 */}
          <div className="mt-4 grid grid-cols-3 gap-1.5">
            {counts.map((item) => {
              const active = group === item.group;
              const color = groupColor[item.group];
              return (
                <button
                  key={item.group}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setGroup(active ? null : item.group)}
                  className={`flex items-center justify-center gap-1.5 rounded-win border py-2 transition-all ${color.soft} ${
                    active
                      ? "border-ink/20 ring-1 ring-ink/10"
                      : "border-transparent opacity-80 hover:opacity-100"
                  }`}
                >
                  <span className={`text-[12px] font-bold ${color.text}`}>
                    {item.group}
                  </span>
                  <span className={`text-[14px] font-bold ${color.text}`}>
                    {item.count}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {hasSample ? (
          <p className="mt-2 flex items-center justify-between gap-2 rounded-win border border-dashed border-silver-mid bg-white px-3 py-2">
            <span className="dot-text text-[12px] text-ink-faint">
              화면 확인용 샘플이 섞여 있어요
            </span>
            <button
              type="button"
              onClick={clearSamples}
              className="shrink-0 text-[12px] font-semibold text-ink-soft underline-offset-4 hover:underline"
            >
              비우기
            </button>
          </p>
        ) : null}

        {group ? (
          <p className="mt-2 flex items-center justify-between gap-2 rounded-win bg-page-lav px-3 py-2">
            <span className="dot-text text-[12px] text-ink-soft">
              <span className="font-bold text-ink">{group}</span> 인연만 보고
              있어요
            </span>
            <button
              type="button"
              onClick={() => setGroup(null)}
              className="shrink-0 text-[12px] font-semibold text-brand-lav underline-offset-4 hover:underline"
            >
              전체 보기
            </button>
          </p>
        ) : null}

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

            {/* 화면을 미리 보기 위한 자리 — 실제 오픈 전에 지운다 */}
            <div className="mt-6 flex justify-center gap-2">
              <button
                type="button"
                onClick={() => addSamples(8)}
                className={buttonClass({ variant: "text" })}
              >
                샘플 8명
              </button>
              <button
                type="button"
                onClick={() => addSamples(100)}
                className={buttonClass({ variant: "text" })}
              >
                샘플 100명
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* 보기 전환 — 밑줄이 지금 보고 있는 쪽을 가리킨다 */}
            <div
              role="tablist"
              aria-label="보기 방식"
              className="mt-5 flex border-b border-silver"
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
                  className={`-mb-px min-h-[42px] flex-1 border-b-2 text-[15px] transition-colors ${
                    tab === key
                      ? "border-brand-lav font-bold text-ink"
                      : "border-transparent font-medium text-ink-soft hover:text-ink"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {tab === "map" ? (
              <div className="mt-5">
                <RelationMap
                  ownerName={displayName({ ...toPerson(defaultProfile), alias })}
                  links={shownLinks}
                />
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {relationGroups.map((name) => {
                  const rows = shownLinks.filter(
                    (l) => findRelation(l.relationId).group === name,
                  );
                  if (rows.length === 0) return null;
                  const color = groupColor[name];

                  return (
                    <section key={name}>
                      {/* 묶음 머리 — 색과 이름이 늘 붙어 다녀서 색을 외울 필요가 없다 */}
                      <h3 className="flex items-center gap-1.5">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[12px] font-bold ${color.soft} ${color.text}`}
                        >
                          {name}
                        </span>
                        <span className="dot-text text-[12px] text-ink-faint">
                          {rows.length}명
                        </span>
                      </h3>

                      <ul className="mt-1.5 divide-y divide-silver overflow-hidden rounded-win border border-line bg-white">
                        {rows.map((link, i) => {
                          const relation = findRelation(link.relationId);
                          return (
                            <li
                              key={link.id}
                              className="row-in flex items-center gap-3 px-3.5 py-2.5 transition-colors hover:bg-page-lav/40"
                              style={{
                                animationDelay: `${Math.min(i, 8) * 40}ms`,
                              }}
                            >
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
                                <span className="mt-0.5 flex items-center gap-1.5 dot-text text-[13px] text-ink-soft">
                                  <span aria-hidden="true">
                                    {relation.emoji}
                                  </span>
                                  <span className="font-bold text-ink">
                                    {relation.label}
                                  </span>
                                  <span className="truncate">
                                    · {relation.hint}
                                  </span>
                                </span>
                              </span>

                              <span
                                className={`shrink-0 dot-text text-[15px] font-bold ${color.text}`}
                              >
                                {link.strength}%
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </section>
                  );
                })}
              </div>
            )}

            {/* 랭킹 */}
            <section className="mt-6">
              <h3 className="dot-title text-[17px] text-ink">인연 랭킹</h3>
              <ol className="mt-3 overflow-hidden rounded-win border border-line bg-white">
                {ranking.slice(0, 3).map((link, i) => {
                  const relation = findRelation(link.relationId);
                  const color = groupColor[relation.group];
                  return (
                    <li
                      key={link.id}
                      className={`relative flex items-center gap-2.5 px-3.5 py-2.5 ${i > 0 ? "border-t border-silver" : ""}`}
                    >
                      {/* 인연도만큼 깔리는 옅은 배경 — 줄 높이를 늘리지 않고 차이를 보여 준다 */}
                      <span
                        aria-hidden="true"
                        className={`absolute inset-y-0 left-0 ${color.soft} opacity-60`}
                        style={{ width: `${link.strength}%` }}
                      />

                      <span
                        aria-hidden="true"
                        className={`dot-title relative w-3.5 shrink-0 text-[15px] ${i === 0 ? "text-accent" : "text-ink-faint"}`}
                      >
                        {i + 1}
                      </span>
                      <span className="relative truncate text-[15px] font-bold text-ink">
                        {link.person.name}
                      </span>
                      <span
                        className={`relative min-w-0 flex-1 truncate dot-text text-[13px] ${color.text}`}
                      >
                        {relation.emoji} {relation.label}
                      </span>
                      <span className="relative shrink-0 dot-text text-[14px] font-bold text-ink">
                        {link.strength}%
                      </span>
                    </li>
                  );
                })}
              </ol>
            </section>

            {/* 모인 결과로 보는 한 줄 정리 */}
            {luck ? (
              <section className="mt-6 rounded-win border border-line bg-[linear-gradient(140deg,#fff6fb_0%,#faf7ff_100%)] px-4 py-4 text-center">
                <DotLabel className="text-[12px] text-ink-faint">
                  내 인연 한 줄 정리
                </DotLabel>
                <p className="mt-2 dot-title text-[19px] text-ink">
                  <span className={groupColor[luck.group].text}>
                    {luck.title}
                  </span>
                  이 많은 사주예요
                </p>
                <p className="mt-1.5 dot-text text-[13px] leading-[1.7] text-ink-soft">
                  {luck.detail}
                </p>
                <p className="mt-2.5 dot-text text-[12px] text-ink-faint">
                  {luck.total}명 중 {luck.count}명이 {luck.group} 인연이에요
                </p>
              </section>
            ) : null}
          </>
        )}
      </Padded>

      {/* 링크 공유 — 이 화면의 핵심 행동이라 아래에 붙여 둔다 */}
      <div className="sticky bottom-0 z-20 border-t border-silver bg-page/95 px-[var(--page-padding)] pb-[max(14px,env(safe-area-inset-bottom))] pt-3 backdrop-blur-[6px]">
        <Button
          variant="primary"
          tone="lavender"
          size="cta"
          className="w-full"
          onClick={share}
        >
          나의 전생 인맥 링크 복사
        </Button>
      </div>

      <MyProfileModal open={editing} onClose={() => setEditing(false)} />

      <NetworkMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        name={defaultProfile.name}
        alias={alias}
        onSaveAlias={setAlias}
        onEditProfile={() => setEditing(true)}
        onClearAll={clearAll}
        linkCount={links.length}
      />
    </Shell>
  );
}

function Shell({
  children,
  onMenu,
}: {
  children: React.ReactNode;
  /** 넘기면 헤더 우측에 관리 버튼이 붙는다 */
  onMenu?: () => void;
}) {
  return (
    <AppFrame>
      <SubHeader
        title="나의 전생 인맥"
        right={
          onMenu ? (
            <button
              type="button"
              onClick={onMenu}
              aria-label="전생 인맥 관리"
              className="flex size-11 items-center justify-center rounded-win text-ink transition-colors hover:bg-hover"
            >
              <Icon name="menu" size={20} />
            </button>
          ) : null
        }
      />
      <main className="flex-1">{children}</main>
      <Footer />
    </AppFrame>
  );
}
