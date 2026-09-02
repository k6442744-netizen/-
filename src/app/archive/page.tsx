import type { Metadata } from "next";
import { AppFrame, Padded } from "@/components/layout/AppFrame";
import { SubHeader } from "@/components/layout/SubHeader";
import { Footer } from "@/components/layout/Footer";
import { ArchiveList } from "@/components/archive/ArchiveList";

export const metadata: Metadata = {
  title: "보관함 — FORTUNE PORTAL",
  description: "지금까지 본 운세와 결과를 다시 확인하세요.",
};

export default function ArchivePage() {
  return (
    <AppFrame>
      <SubHeader title="보관함" />

      <main className="flex-1">
        <Padded className="pb-6 pt-6">
          <h2 className="dot-title text-[20px] text-ink">내가 본 운세</h2>
          <p className="mt-1.5 dot-text text-[13px] leading-[1.7] text-ink-soft">
            결과는 하트를 다시 쓰지 않고 언제든 열어 볼 수 있어요.
          </p>

          <div className="mt-5">
            <ArchiveList />
          </div>
        </Padded>
      </main>

      <Footer />
    </AppFrame>
  );
}
