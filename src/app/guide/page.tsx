import type { Metadata } from "next";
import { AppFrame, Padded } from "@/components/layout/AppFrame";
import { SubHeader } from "@/components/layout/SubHeader";
import { Footer } from "@/components/layout/Footer";
import { buttonClass } from "@/components/ui/Button";
import { DotLabel } from "@/components/y2k/DotLabel";
import { guideSections } from "@/lib/support";
import Link from "next/link";

export const metadata: Metadata = {
  title: "이용안내 — FORTUNE PORTAL",
  description: "운세를 보는 순서와 하트 사용 방법을 안내합니다.",
};

export default function GuidePage() {
  return (
    <AppFrame>
      <SubHeader title="이용안내" />

      <main className="flex-1">
        <Padded className="pb-8 pt-6">
          <h2 className="dot-title text-[20px] text-ink">
            처음이라면 여기부터
          </h2>
          <p className="mt-1.5 dot-text text-[13px] leading-[1.7] text-ink-soft">
            운세를 보는 순서와 하트 쓰는 법을 정리했어요.
          </p>

          <div className="mt-6 space-y-7">
            {guideSections.map((section) => (
              <section key={section.title}>
                <h3 className="dot-title text-[17px] text-ink">
                  {section.title}
                </h3>

                <ol className="mt-3 space-y-2.5">
                  {section.steps.map((step, i) => (
                    <li
                      key={step.title}
                      className="flex gap-3 rounded-win border border-line bg-white px-4 py-3.5 shadow-card"
                    >
                      <DotLabel className="mt-0.5 shrink-0 text-[13px] font-bold text-accent">
                        {String(i + 1).padStart(2, "0")}
                      </DotLabel>
                      <div className="min-w-0">
                        <p className="text-[15px] font-bold text-ink">
                          {step.title}
                        </p>
                        <p className="mt-1 dot-text text-[14px] leading-[1.75] text-ink-body">
                          {step.body}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            ))}
          </div>

          <div className="mt-8 flex gap-2">
            <Link
              href="/faq"
              className={buttonClass({ variant: "tertiary", className: "flex-1" })}
            >
              자주 묻는 질문
            </Link>
            <Link
              href="/"
              className={buttonClass({ variant: "secondary", className: "flex-1" })}
            >
              운세 보러 가기
            </Link>
          </div>
        </Padded>
      </main>

      <Footer />
    </AppFrame>
  );
}
