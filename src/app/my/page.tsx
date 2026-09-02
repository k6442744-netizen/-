import type { Metadata } from "next";
import { AppFrame, Padded } from "@/components/layout/AppFrame";
import { SubHeader } from "@/components/layout/SubHeader";
import { Footer } from "@/components/layout/Footer";
import { MyPageView } from "@/components/mypage/MyPageView";

export const metadata: Metadata = {
  title: "마이페이지 — FORTUNE PORTAL",
  description: "내 사주정보와 보유 하트를 확인하세요.",
};

export default function MyPage() {
  return (
    <AppFrame>
      <SubHeader title="마이페이지" />

      <main className="flex-1">
        <Padded className="pb-8 pt-6">
          <MyPageView />
        </Padded>
      </main>

      <Footer />
    </AppFrame>
  );
}
