"use client";

import { MagicCircle } from "./MagicCircle";
import { groupColor, type PastLifeRelation } from "@/lib/past-life";

/** 인연도에 따라 상대가 중심에서 얼마나 가까이 놓이는지 */
const NEAR = 17;
const FAR = 44;

/**
 * 결과 화면의 작은 인연맵.
 *
 * 인맥 화면과 같은 문법 — 마법진 위에 두 사람을 놓고,
 * 인연이 깊을수록 서로 가깝게 붙여 둔다.
 */
export function VerdictMap({
  ownerName,
  myName,
  relation,
  strength,
}: {
  ownerName: string;
  myName: string;
  relation: PastLifeRelation;
  strength: number;
}) {
  const color = groupColor[relation.group];
  const depth = Math.min(1, Math.max(0, (strength - 41) / 58));
  const radius = FAR - depth * (FAR - NEAR);

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[260px]">
      <span
        aria-hidden="true"
        className="iridescent orbit-spin-slow pointer-events-none absolute inset-[10%] rounded-full opacity-45 blur-2xl"
      />
      {[0, 3].map((delay) => (
        <span
          key={delay}
          aria-hidden="true"
          className="iridescent aura-pulse pointer-events-none absolute inset-0 rounded-full blur-[10px]"
          style={{ animationDelay: `${delay}s` }}
        />
      ))}

      <MagicCircle inner={NEAR} mid={(NEAR + FAR) / 2} outer={FAR} />

      {/* 가운데 — 링크를 보낸 사람 */}
      <div className="absolute left-1/2 top-1/2 z-10 flex size-[74px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full bg-[linear-gradient(140deg,#a97cff_0%,#ff8ec7_100%)] text-white shadow-win ring-4 ring-white/70">
        <span className="max-w-[88%] truncate text-[14px] font-bold">
          {ownerName}
        </span>
      </div>

      {/* 바깥 — 나. 인연이 깊을수록 안쪽으로 붙는다 */}
      <div
        className="node-in absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
        style={{ left: "50%", top: `${50 - radius}%` }}
      >
        <span
          className={`max-w-[92px] truncate rounded-full px-2.5 py-1 text-[13px] font-bold shadow-card ${color.soft} ${color.text}`}
        >
          {myName || "나"}
        </span>
        <span className={`mt-1 text-[11px] font-bold ${color.text}`}>
          {relation.emoji} {relation.label}
        </span>
      </div>
    </div>
  );
}
