import type { Metadata } from "next";
import { Suspense } from "react";
import { AppFrame } from "@/components/layout/AppFrame";
import { SubHeader } from "@/components/layout/SubHeader";
import { JoinView } from "@/components/pastlife/JoinView";

export const metadata: Metadata = {
  title: "전생관계 판별기 — FORTUNE PORTAL",
  description: "생년월일을 넣으면 전생에 어떤 사이였는지 알려드려요.",
};

export default function PastLifeJoinPage() {
  return (
    <Suspense
      fallback={
        <AppFrame>
          <SubHeader title="친구 참여하기" />
          <main className="flex-1" />
        </AppFrame>
      }
    >
      <JoinView />
    </Suspense>
  );
}
