import type { Metadata } from "next";
import { AppFrame, Padded } from "@/components/layout/AppFrame";
import { SubHeader } from "@/components/layout/SubHeader";
import { Footer } from "@/components/layout/Footer";
import { GiftComposer } from "@/components/gift/GiftComposer";

export const metadata: Metadata = {
  title: "선물하기 — FORTUNE PORTAL",
  description: "운세를 골라 친구에게 선물하세요.",
};

export default function GiftPage() {
  return (
    <AppFrame>
      <SubHeader title="선물하기" />

      <main className="flex-1">
        <Padded className="pb-8 pt-6">
          <h2 className="dot-title text-[20px] text-ink">운세 선물하기</h2>
          <p className="mb-5 mt-1.5 dot-text text-[13px] leading-[1.7] text-ink-soft">
            내 하트로 값을 치르고 링크를 보내면, 받는 분은 자기 사주정보만
            넣으면 돼요.
          </p>

          <GiftComposer />
        </Padded>
      </main>

      <Footer />
    </AppFrame>
  );
}
