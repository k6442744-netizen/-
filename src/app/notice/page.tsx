import type { Metadata } from "next";
import { AppFrame, Padded } from "@/components/layout/AppFrame";
import { SubHeader } from "@/components/layout/SubHeader";
import { Footer } from "@/components/layout/Footer";
import { NoticeList } from "@/components/support/NoticeList";

export const metadata: Metadata = {
  title: "공지사항 — FORTUNE PORTAL",
  description: "서비스 소식과 변경 사항을 확인하세요.",
};

export default function NoticePage() {
  return (
    <AppFrame>
      <SubHeader title="공지사항" />
      <main className="flex-1">
        <Padded className="pb-8 pt-6">
          <NoticeList />
        </Padded>
      </main>
      <Footer />
    </AppFrame>
  );
}
