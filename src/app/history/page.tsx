import type { Metadata } from "next";
import { AppFrame, Padded } from "@/components/layout/AppFrame";
import { SubHeader } from "@/components/layout/SubHeader";
import { Footer } from "@/components/layout/Footer";
import { HeartHistory } from "@/components/history/HeartHistory";

export const metadata: Metadata = {
  title: "하트 내역 — FORTUNE PORTAL",
  description: "하트를 충전하고 사용한 내역을 확인하세요.",
};

export default function HistoryPage() {
  return (
    <AppFrame>
      <SubHeader title="하트 내역" />

      <main className="flex-1">
        <Padded className="pb-6 pt-6">
          <HeartHistory />
        </Padded>
      </main>

      <Footer />
    </AppFrame>
  );
}
