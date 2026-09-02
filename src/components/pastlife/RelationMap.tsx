"use client";

import { findRelation, type PastLifeLink } from "@/lib/past-life";

/** 맵에 둘러 세울 최대 인원 — 그보다 많으면 최근 순으로 자른다 */
const MAX = 8;

/**
 * 인연맵 — 가운데가 나, 둘레가 친구들.
 * 각도는 인원수에 맞춰 균등하게 나눈다.
 */
export function RelationMap({
  ownerName,
  links,
}: {
  ownerName: string;
  links: PastLifeLink[];
}) {
  const shown = links.slice(0, MAX);

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[300px]">
      {/* 둘레 — 천천히 돌아간다 */}
      <span
        aria-hidden="true"
        className="orbit-spin-slow absolute inset-[16%] rounded-full border border-dashed border-brand-lav-soft"
      />
      <span
        aria-hidden="true"
        className="absolute inset-[30%] rounded-full border border-dashed border-silver"
      />

      <div className="absolute left-1/2 top-1/2 flex size-[84px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full bg-[linear-gradient(140deg,#a97cff_0%,#ff8ec7_100%)] text-white shadow-win">
        <span className="text-[16px] font-bold">{ownerName}</span>
        <span className="mt-0.5 rounded-full bg-white/25 px-1.5 py-px text-[10px] font-bold">
          나
        </span>
      </div>

      {shown.map((link, i) => {
        const relation = findRelation(link.relationId);
        /* 12시 방향부터 시계 방향으로 균등 배치 */
        const angle = (Math.PI * 2 * i) / shown.length - Math.PI / 2;
        const left = 50 + Math.cos(angle) * 38;
        const top = 50 + Math.sin(angle) * 38;

        return (
          <div
            key={link.id}
            className="node-in absolute flex w-[74px] -translate-x-1/2 -translate-y-1/2 flex-col items-center"
            /* 12시 방향부터 시계 방향으로 하나씩 나타난다 */
            style={{
              left: `${left}%`,
              top: `${top}%`,
              animationDelay: `${i * 70}ms`,
            }}
          >
            <span
              aria-hidden="true"
              className="flex size-11 items-center justify-center rounded-full bg-[linear-gradient(140deg,#ffb3dc_0%,#c9a6ff_100%)] text-[15px] font-bold text-white shadow-card"
            >
              {link.person.name.slice(0, 1)}
            </span>
            <span className="mt-1 w-full truncate text-center text-[12px] font-bold text-ink">
              {link.person.name}
            </span>
            <span className="mt-0.5 flex items-center gap-0.5 rounded-full bg-white/85 px-1.5 text-[10px] font-bold text-brand-lav">
              <span aria-hidden="true">{relation.emoji}</span>
              {relation.label}
            </span>
          </div>
        );
      })}

      {links.length > MAX ? (
        <p className="absolute inset-x-0 bottom-0 text-center dot-text text-[12px] text-silver-mid">
          외 {links.length - MAX}명
        </p>
      ) : null}
    </div>
  );
}
