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
        {/* 첫 배너 원본 1549×1015 — 그 비율을 기준으로 잡는다.
            두 번째 배너(1558×1010)는 object-cover라 좌우가 1%쯤 잘린다.
            제목이 상단에 있어 세로가 잘리는 쪽을 피한 선택이다.
            slides에 항목을 추가하면 4초 간격으로 자동 순환한다. */}
        <FortuneHero
          ratio="1549/1015"
          slides={[
            { src: "/hero.png", alt: "990원 사주" },
            { src: "/hero-2.jpg", alt: "궁합운세 Destiny Match" },
          ]}
        />

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
