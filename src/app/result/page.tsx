import type { Metadata } from "next";
import { Suspense } from "react";
import { AppFrame } from "@/components/layout/AppFrame";
import { SubHeader } from "@/components/layout/SubHeader";
import { FortuneLoading } from "@/components/result/FortuneLoading";
import { ResultView } from "@/components/result/ResultView";

export const metadata: Metadata = {
  title: "운세 결과 — FORTUNE PORTAL",
  description: "방금 확인한 운세 결과입니다.",
};

/**
 * 결과지.
 *
 * 정적 export 라 결과마다 경로를 만들 수 없어서 보관함 항목 id 를 쿼리로 받는다.
 * (`/result/?id=...&new=1` — `new` 는 방금 결제하고 넘어왔다는 표시)
 * `useSearchParams` 는 정적 프리렌더 때 Suspense 경계가 필요하다.
 */
export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <AppFrame>
          <SubHeader title="운세 결과" />
          <main className="flex flex-1 flex-col">
            <FortuneLoading />
          </main>
        </AppFrame>
      }
    >
      <ResultView />
    </Suspense>
  );
}
