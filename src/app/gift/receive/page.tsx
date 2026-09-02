import type { Metadata } from "next";
import { Suspense } from "react";
import { AppFrame } from "@/components/layout/AppFrame";
import { SubHeader } from "@/components/layout/SubHeader";
import { GiftReceive } from "@/components/gift/GiftReceive";

export const metadata: Metadata = {
  title: "선물 받기 — FORTUNE PORTAL",
  description: "선물받은 운세를 확인하세요.",
};

/**
 * 선물 받기.
 *
 * 정적 export 라 선물마다 경로를 만들 수 없어서 코드를 쿼리로 받는다.
 * (`/gift/receive/?code=...`) `useSearchParams` 는 Suspense 경계가 필요하다.
 */
export default function GiftReceivePage() {
  return (
    <Suspense
      fallback={
        <AppFrame>
          <SubHeader title="선물 받기" />
          <main className="flex-1" />
        </AppFrame>
      }
    >
      <GiftReceive />
    </Suspense>
  );
}
