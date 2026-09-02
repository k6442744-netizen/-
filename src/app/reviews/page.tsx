import type { Metadata } from "next";
import { AppFrame, Padded } from "@/components/layout/AppFrame";
import { SubHeader } from "@/components/layout/SubHeader";
import { Footer } from "@/components/layout/Footer";
import { ReviewList } from "@/components/support/ReviewList";

export const metadata: Metadata = {
  title: "후기보기 — FORTUNE PORTAL",
  description: "운세를 본 분들이 남긴 후기를 확인하세요.",
};

export default function ReviewsPage() {
  return (
    <AppFrame>
      <SubHeader title="후기보기" />
      <main className="flex-1">
        <Padded className="pb-8 pt-6">
          <ReviewList />
        </Padded>
      </main>
      <Footer />
    </AppFrame>
  );
}
