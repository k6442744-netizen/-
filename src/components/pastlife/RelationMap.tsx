"use client";

import { useState } from "react";
import { MagicCircle } from "./MagicCircle";
import { findRelation, groupColor, type PastLifeLink } from "@/lib/past-life";

/** 판정에서 나오는 인연도 범위 */
const MIN_STRENGTH = 41;
const MAX_STRENGTH = 99;

/** 중심에서 떨어지는 거리(%) — 인연이 깊을수록 안쪽 */
const NEAR = 16;
const FAR = 46;

/** 잎차례 각도 — 같은 각도에 몰리지 않게 흩뿌린다 */
const GOLDEN_ANGLE = 137.508;

/** 인연도를 0~1 로 — 자리와 크기를 정하는 기준이 된다 */
const ratio = (strength: number) =>
  Math.min(
    1,
    Math.max(0, (strength - MIN_STRENGTH) / (MAX_STRENGTH - MIN_STRENGTH)),
  );

/**
 * 인원에 따라 노드를 어떻게 그릴지.
 * `chip` 이름 + 관계 / `name` 이름만 / `dot` 색 점 (상위만 이름)
 */
function nodeMode(count: number) {
  if (count <= 24) return "chip" as const;
  if (count <= 56) return "name" as const;
  return "dot" as const;
}

/**
 * 인연맵 — 가운데가 나, 둘레가 친구들.
 *
 * 자리를 **인연도**로 정한다. 깊은 인연일수록 안쪽·크게 놓이므로
 * 백 명이 들어와도 누가 가까운 사이인지 한눈에 읽힌다.
 * 이름표는 상위 몇 명만 붙이고, 나머지는 눌러서 확인한다.
 */
export function RelationMap({
  ownerName,
  links,
}: {
  ownerName: string;
  links: PastLifeLink[];
}) {
  const [picked, setPicked] = useState<string | null>(null);

  const count = links.length;
  const mode = nodeMode(count);
  /* 점으로 찍는 구간에서는 깊은 인연 몇 명만 이름을 붙인다 */
  const labelCount = mode === "dot" ? 6 : count;
  const labelled = new Set(
    [...links]
      .sort((a, b) => b.strength - a.strength)
      .slice(0, labelCount)
      .map((l) => l.id),
  );

  const selected = links.find((l) => l.id === picked) ?? null;
  const selectedRelation = selected ? findRelation(selected.relationId) : null;

  return (
    <div>
      <div className="relative mx-auto aspect-square w-full max-w-[330px]">
        {/* 중심에서 번져 나가는 오라 — 색이 천천히 섞이며 돈다 */}
        <span
          aria-hidden="true"
          className="iridescent orbit-spin-slow pointer-events-none absolute inset-[8%] rounded-full opacity-40 blur-2xl"
        />
        {/* 같은 색이 파동처럼 바깥으로 퍼진다 */}
        {[0, 2.4, 4.8].map((delay) => (
          <span
            key={delay}
            aria-hidden="true"
            className="iridescent aura-pulse pointer-events-none absolute inset-0 rounded-full blur-[10px]"
            style={{ animationDelay: `${delay}s` }}
          />
        ))}

        {/* 인연도 눈금 세 겹을 마법진으로 꾸민다 */}
        <MagicCircle inner={NEAR} mid={(NEAR + FAR) / 2} outer={FAR} />

        <div
          className="absolute left-1/2 top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full bg-[linear-gradient(140deg,#a97cff_0%,#ff8ec7_100%)] text-white shadow-win ring-4 ring-white/70"
          style={{ width: mode === "chip" ? 76 : 62, height: mode === "chip" ? 76 : 62 }}
        >
          <span
            className={`max-w-[90%] truncate font-bold ${mode === "chip" ? "text-[15px]" : "text-[12px]"}`}
          >
            {ownerName}
          </span>
          <span className="mt-0.5 rounded-full bg-white/25 px-1.5 py-px text-[10px] font-bold">
            나
          </span>
        </div>

        {links.map((link, i) => {
          const relation = findRelation(link.relationId);
          const color = groupColor[relation.group];
          const depth = ratio(link.strength);

          const radius = FAR - depth * (FAR - NEAR);
          const angle = ((i * GOLDEN_ANGLE - 90) * Math.PI) / 180;
          const isPicked = picked === link.id;
          const showName = mode !== "dot" || labelled.has(link.id);
          /* 깊은 인연일수록 글자를 조금 키워 순위가 크기로도 읽히게 한다 */
          const nameSize = mode === "chip" ? 11 + depth * 2 : 10 + depth * 1.5;

          return (
            <button
              key={link.id}
              type="button"
              onClick={() => setPicked(isPicked ? null : link.id)}
              aria-label={`${link.person.name} · ${relation.label} · 인연도 ${link.strength}%`}
              className="node-in absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
              style={{
                left: `${50 + Math.cos(angle) * radius}%`,
                top: `${50 + Math.sin(angle) * radius}%`,
                zIndex: isPicked ? 20 : Math.round(depth * 10),
                animationDelay: `${Math.min(i, 20) * 45}ms`,
              }}
            >
              {showName ? (
                <span
                  className={`max-w-[76px] truncate rounded-full px-2 py-0.5 font-bold shadow-card transition-transform ${color.soft} ${color.text} ${
                    isPicked ? "scale-110 ring-2 ring-ink/15" : ""
                  }`}
                  style={{ fontSize: nameSize }}
                >
                  {link.person.name}
                </span>
              ) : (
                <span
                  aria-hidden="true"
                  className={`rounded-full shadow-card transition-transform ${color.solid} ${
                    isPicked ? "scale-125 ring-2 ring-ink/15" : ""
                  }`}
                  style={{ width: 9 + depth * 5, height: 9 + depth * 5 }}
                />
              )}

              {mode === "chip" ? (
                <span
                  className={`mt-0.5 max-w-[84px] truncate text-[10px] font-bold ${color.text}`}
                >
                  {relation.emoji} {relation.label}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      <p className="mt-1 text-center dot-text text-[12px] text-ink-faint">
        안쪽에 가까울수록 인연이 깊어요 · 눌러서 확인
      </p>

      {/* 누른 사람 — 이름표가 없는 노드도 여기서 확인한다 */}
      {selected && selectedRelation ? (
        <div className="mt-3 flex items-center gap-3 rounded-win border border-line bg-white px-3.5 py-3 shadow-card">
          <span
            aria-hidden="true"
            className={`size-2.5 shrink-0 rounded-full ${groupColor[selectedRelation.group].solid}`}
          />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[15px] font-bold text-ink">
              {selected.person.name}
            </span>
            <span
              className={`mt-0.5 block truncate dot-text text-[13px] ${groupColor[selectedRelation.group].text}`}
            >
              {selectedRelation.emoji} {selectedRelation.label} ·{" "}
              {selectedRelation.hint}
            </span>
          </span>
          <span className="shrink-0 dot-text text-[15px] font-bold text-brand-lav">
            {selected.strength}%
          </span>
        </div>
      ) : null}
    </div>
  );
}
