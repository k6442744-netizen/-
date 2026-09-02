import type { Metadata } from "next";
import { AppFrame, Padded } from "@/components/layout/AppFrame";
import { SubHeader } from "@/components/layout/SubHeader";
import { Footer } from "@/components/layout/Footer";
import { FaqList } from "@/components/support/FaqList";

export const metadata: Metadata = {
  title: "자주 묻는 질문 — FORTUNE PORTAL",
  description: "결제·사주정보·결과에 대해 자주 묻는 질문을 모았습니다.",
};

export default function FaqPage() {
  return (
    <AppFrame>
      <SubHeader title="자주 묻는 질문" />
      <main className="flex-1">
        <Padded className="pb-8 pt-6">
          <FaqList />
        </Padded>
      </main>
      <Footer />
    </AppFrame>
  );
}
