import { AppFrame, Padded } from "@/components/layout/AppFrame";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FortuneHero } from "@/components/fortune/FortuneHero";
import { FeatureBar } from "@/components/fortune/FeatureBar";
import { UtilityNav } from "@/components/fortune/UtilityNav";
import { TestTypeMenu } from "@/components/fortune/TestTypeMenu";
import { FortuneCarousel } from "@/components/fortune/FortuneCarousel";
import { TrendingRow } from "@/components/fortune/TrendingRow";
import { AllFortuneGrid } from "@/components/fortune/AllFortuneGrid";
import { FortuneMessage } from "@/components/fortune/FortuneMessage";
import { featuredProducts, products, trendingProducts } from "@/lib/products";

export default function Home() {
  return (
    <AppFrame>
      <Header />

      <main className="flex-1">
        {/* 원본 1548×1016 — 잘리지 않게 이미지 비율 그대로 사용 */}
        <FortuneHero src="/hero.png" ratio="1548/1016" alt="990원 사주" />

        {/* Section gap 48px (§5) */}
        <div className="space-y-12 pb-4 pt-7">
          <Padded>
            <TestTypeMenu />
          </Padded>

          <Padded>
            <FortuneCarousel items={featuredProducts} />
          </Padded>

          <Padded>
            <TrendingRow items={trendingProducts} />
          </Padded>

          <Padded>
            <FortuneMessage />
          </Padded>

          <Padded>
            <AllFortuneGrid items={products} />
          </Padded>

          {/* Feature Bar는 신뢰 정보이므로 하단으로 배치 */}
          <Padded>
            <FeatureBar />
          </Padded>

          <Padded>
            <UtilityNav />
          </Padded>
        </div>
      </main>

      <Footer />
    </AppFrame>
  );
}
