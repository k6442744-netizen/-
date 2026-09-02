import { fallbackCopy, productCopy } from "./product-copy";
import type { FortuneProduct, Category } from "./products";
import type { SajuProfile } from "./profiles";

/**
 * 결과 조립.
 *
 * 본문은 상품별 원고(`product-copy.ts`)를 그대로 쓰고,
 * 점수·이번 풀이의 한 줄·럭키 아이템처럼 사람마다 달라지는 값만
 * 보관함에 저장된 씨앗으로 만든다. 씨앗이 같으면 언제 열어도 같은 결과가 나온다.
 */

/** 씨앗 하나로 같은 난수열을 다시 만드는 mulberry32 */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pick = <T,>(items: readonly T[], next: () => number) =>
  items[Math.floor(next() * items.length)];

/** 이번 풀이에서 특히 눈에 띄는 한 줄 — 사람마다 달라지는 자리 */
const highlights: Record<Category, string[]> = {
  연애: [
    "이번 풀이에서는 기다림이 특히 강하게 잡힙니다. 먼저 움직이지 않는 편이 유리해요.",
    "이번 풀이에서는 익숙한 자리에서 인연이 다시 이어지는 결이 뚜렷합니다.",
    "이번 풀이에서는 표현의 속도 차이가 가장 크게 잡혔습니다. 한 박자만 늦추세요.",
    "이번 풀이에서는 봄에서 초여름 사이가 관계의 분기점으로 잡힙니다.",
  ],
  종합: [
    "이번 풀이에서는 정리하는 기운이 유난히 강합니다. 새로 벌리는 건 다음으로 미루세요.",
    "이번 풀이에서는 사람을 통해 들어오는 기회가 크게 잡힙니다.",
    "이번 풀이에서는 건강 쪽 신호가 먼저 잡혔습니다. 잠부터 챙기세요.",
    "이번 풀이에서는 중반 이후의 상승이 특히 뚜렷합니다.",
  ],
  재물: [
    "이번 풀이에서는 새는 자리가 먼저 잡힙니다. 반복 지출부터 보세요.",
    "이번 풀이에서는 사람을 통해 들어오는 돈이 크게 잡힙니다.",
    "이번 풀이에서는 여름 무렵 한 번의 기회가 뚜렷하게 잡힙니다.",
    "이번 풀이에서는 나눠 두는 쪽이 확실히 유리하게 나옵니다.",
  ],
  직장: [
    "이번 풀이에서는 지금 자리를 조금 더 지키는 쪽이 유리하게 잡힙니다.",
    "이번 풀이에서는 가을의 제안이 특히 크게 잡혔습니다.",
    "이번 풀이에서는 윗사람과의 대화에서 길이 열리는 결이 뚜렷합니다.",
    "이번 풀이에서는 사람을 엮는 일에서 성과가 크게 잡힙니다.",
  ],
  재미: [
    "이번 풀이에서는 예상 밖의 연락이 가장 크게 잡혔어요.",
    "이번 풀이에서는 작은 지출이 기분을 올려 주는 결이 뚜렷합니다.",
    "이번 풀이에서는 말이 잘 붙는 기운이 강하게 잡힙니다.",
    "이번 풀이에서는 결정을 하루 미루는 쪽이 유리하게 나왔어요.",
  ],
};

/** 점수를 항목별로 쪼갠 막대 — 결과지에서 유일하게 남기는 그래픽 */
const breakdownLabels: Record<Category, [string, string, string, string]> = {
  연애: ["설렘", "소통", "안정", "타이밍"],
  종합: ["재물", "일", "관계", "건강"],
  재물: ["수입", "관리", "기회", "안정"],
  직장: ["성과", "기회", "사람", "안정"],
  재미: ["기분", "운", "타이밍", "사람"],
};

const luckyColors = ["연분홍", "라벤더", "베이비블루", "크림", "은빛"];
const luckyItems = [
  "작은 거울",
  "별 모양 키링",
  "체리 스티커",
  "손편지",
  "향수",
  "체크 머리끈",
];
const luckyDays = [
  "월요일",
  "화요일",
  "수요일",
  "목요일",
  "금요일",
  "토요일",
  "일요일",
];

export interface FortuneResult {
  /** 0~100. 두 사람이면 궁합 점수, 한 사람이면 운세 지수 */
  score: number;
  scoreLabel: string;
  headline: string;
  intro: string;
  /** 총점을 항목별로 쪼갠 값 (0~100) */
  breakdown: { label: string; value: number }[];
  /** 이번 풀이에서만 달라지는 한 줄 */
  highlight: string;
  sections: { title: string; paragraphs: string[] }[];
  advice: string[];
  lucky: { color: string; item: string; day: string };
}

export function buildResult(
  product: FortuneProduct,
  people: SajuProfile[],
  seed: number,
): FortuneResult {
  const next = rng(seed);
  const copy = productCopy[product.id] ?? fallbackCopy[product.category];
  const score = 62 + Math.floor(next() * 36);

  return {
    score,
    /* 항목 값은 총점 근처에서 흔들리게 둔다 — 총점과 따로 놀면 읽는 사람이 헷갈린다 */
    breakdown: breakdownLabels[product.category].map((label) => ({
      label,
      value: Math.max(38, Math.min(99, score - 14 + Math.floor(next() * 28))),
    })),
    scoreLabel: people.length === 2 ? "궁합 지수" : "운세 지수",
    headline: copy.headline,
    intro: copy.intro,
    highlight: pick(highlights[product.category], next),
    sections: copy.sections,
    advice: copy.advice,
    lucky: {
      color: pick(luckyColors, next),
      item: pick(luckyItems, next),
      day: pick(luckyDays, next),
    },
  };
}
