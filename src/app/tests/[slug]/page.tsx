import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppFrame, Padded } from "@/components/layout/AppFrame";
import { SubHeader } from "@/components/layout/SubHeader";
import { Footer } from "@/components/layout/Footer";
import { MiniFortuneCard } from "@/components/fortune/MiniFortuneCard";
import { FortuneObject, type ObjectName } from "@/components/fortune/FortuneObject";
import { PixelDecoration } from "@/components/y2k/PixelDecoration";
import { DotLabel } from "@/components/y2k/DotLabel";
import { findTestType, products, testTypes } from "@/lib/products";

export function generateStaticParams() {
  return testTypes.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const type = findTestType(slug);
  if (!type) return { title: "FORTUNE PORTAL" };

  return {
    title: `${type.id} — FORTUNE PORTAL`,
    description: type.desc,
  };
}

export default async function TestTypePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const type = findTestType(slug);
  if (!type) notFound();

  const items = products.filter((p) => p.type === type.id);

  return (
    <AppFrame>
      <SubHeader title={`${type.id} 테스트`} />

      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-silver bg-[linear-gradient(180deg,#fff8fc_0%,#ffeef7_100%)] px-[var(--page-padding)] pb-6 pt-6">
          <PixelDecoration
            shape="sparkle"
            size={12}
            className="absolute right-[38%] top-6 text-brand-pink-soft"
          />
          <PixelDecoration
            shape="heart"
            size={10}
            className="absolute left-[58%] top-[86px] text-[#ffc2e2]"
          />

          <FortuneObject
            name={type.object as ObjectName}
            src={type.image}
            size={100}
            className="float-soft pointer-events-none absolute -right-1 bottom-4 mix-blend-multiply"
          />

          <div className="relative">
            <h2 className="text-[24px] font-bold leading-[1.32] tracking-[-0.02em] text-ink">
              {type.id} 테스트
            </h2>
            <p className="mt-2 max-w-[220px] dot-text text-[14px] leading-[1.7] text-ink-soft">
              {type.desc}
            </p>
          </div>
        </section>

        <Padded className="pb-4 pt-6">
          <div className="flex items-center justify-between">
            <p className="text-[14px] font-semibold text-ink">
              전체 {items.length}개
            </p>
            <DotLabel className="text-[12px] text-ink-faint">
              전체 목록
            </DotLabel>
          </div>

          <ul className="mt-3 grid grid-cols-2 gap-3">
            {items.map((product) => (
              <li key={product.id}>
                <MiniFortuneCard product={product} className="h-full" />
              </li>
            ))}
          </ul>
        </Padded>
      </main>

      <Footer />
    </AppFrame>
  );
}
