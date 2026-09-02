import type { Metadata } from "next";
import { Suspense } from "react";
import { AppFrame } from "@/components/layout/AppFrame";
import { SubHeader } from "@/components/layout/SubHeader";
import { NetworkView } from "@/components/pastlife/NetworkView";

export const metadata: Metadata = {
  title: "나의 전생 인맥 — FORTUNE PORTAL",
  description: "친구들과 나의 전생 관계를 들여다보세요.",
};

/** 친구가 보내온 결과(`?add=`)를 쿼리로 받으므로 Suspense 경계가 필요하다 */
export default function PastLifePage() {
  return (
    <Suspense
      fallback={
        <AppFrame>
          <SubHeader title="나의 전생 인맥" />
          <main className="flex-1" />
        </AppFrame>
      }
    >
      <NetworkView />
    </Suspense>
  );
}
