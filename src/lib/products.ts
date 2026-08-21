import type { ObjectName } from "@/components/fortune/FortuneObject";
import type { WindowTone } from "@/components/y2k/RetroWindow";

export const categories = ["연애", "종합", "재물", "직장", "재미"] as const;
export type Category = (typeof categories)[number];

/** 카테고리 칩에 붙는 이모지 (`전체`는 붙이지 않는다) */
export const categoryEmoji: Record<Category, string> = {
  연애: "💕",
  종합: "🔮",
  재물: "💰",
  직장: "💼",
  재미: "🎀",
};

/** 테스트 종류 (풀이 방식) — 주제(Category)와는 다른 축이다. */
export const testTypes = [
  {
    id: "사주",
    slug: "saju",
    label: "SAJU",
    desc: "타고난 사주팔자로 읽는 운의 흐름",
    image: "/objects/saju.png",
    object: "crystal-ball",
    tone: "lavender",
  },
  {
    id: "자미두수",
    slug: "ziwei",
    label: "ZIWEI",
    desc: "동양 별자리 명반으로 보는 나의 판",
    image: "/objects/ziwei.png",
    object: "star-charm",
    tone: "blue",
  },
  {
    id: "MBTI",
    slug: "mbti",
    label: "MBTI",
    desc: "성격 유형으로 보는 나와 우리",
    image: "/objects/mbti.png",
    object: "tamagotchi",
    tone: "pink",
  },
  {
    id: "타로",
    slug: "tarot",
    label: "TAROT",
    desc: "지금 이 순간의 카드가 주는 힌트",
    image: "/objects/tarot.png",
    object: "cd",
    tone: "lavender",
  },
] as const;

export type TestType = (typeof testTypes)[number]["id"];
export type TestTypeSlug = (typeof testTypes)[number]["slug"];

export const findTestType = (slug: string) =>
  testTypes.find((t) => t.slug === slug);

export interface FortuneProduct {
  id: string;
  /** 내부 식별용 영문 코드 (화면에는 노출하지 않음) */
  label: string;
  /** Featured Retro Window 라벨 (한글, 여주 도자체) */
  labelKo?: string;
  /** 상품 전용 오브젝트 이미지 (없으면 FortuneObject placeholder) */
  image?: string;
  /** 풀이 방식 */
  type: TestType;
  /** 주제 */
  category: Category;
  tone: WindowTone;
  object: ObjectName;
  /** 카드 이미지 위에 얹는 2~4자 타이틀 (Y유니버스 B) */
  short: string;
  /** Mini Card용 한 줄 제목 */
  name: string;
  /** Featured Card용 설명 — Mini Card에는 긴 설명을 넣지 않는다 (§8) */
  description?: string;
  /** 재화(하트) 가격 */
  hearts: number;
  /** Featured swipe card 노출 여부 */
  featured?: boolean;
  /** NOW TRENDING 순위 (있으면 트렌딩 노출) */
  rank?: number;
}

/**
 * 샘플 상품 데이터 — 실제 상품/가격으로 교체해 사용합니다.
 * Object 매핑은 §11 3D Object System을 따릅니다.
 */
export const products: FortuneProduct[] = [
  {
    id: "love-fortune",
    type: "사주",
    label: "LOVE FORTUNE",
    labelKo: "궁합 사주",
    image: "/products/love-fortune.png",
    category: "연애",
    tone: "pink",
    object: "heart",
    short: "궁합", name: "너와 나의 궁합",
    description: "우리의 인연과 궁합을\n상세하게 알려드려요.",
    hearts: 3,
    featured: true,
  },
  {
    id: "fortune-2026",
    type: "사주",
    label: "FORTUNE 2026",
    labelKo: "2026 운세",
    category: "종합",
    tone: "lavender",
    object: "crystal-ball",
    image: "/objects/saju.png", short: "대운", name: "올해 나의 대운",
    description: "2026년 운세와\n기회를 확인해요.",
    hearts: 5,
    featured: true,
  },
  {
    id: "match-saju",
    type: "사주",
    label: "MATCH SAJU",
    labelKo: "연애 사주",
    image: "/products/match-saju.png",
    category: "연애",
    tone: "blue",
    object: "padlock",
    short: "연애사주", name: "연애사주 상세풀이",
    description: "내 연애운과 인연의\n흐름을 알려드려요.",
    hearts: 4,
    featured: true,
  },
  {
    id: "mz-test",
    type: "MBTI",
    label: "MZ TEST",
    labelKo: "MZ 테스트",
    category: "재미",
    tone: "pink",
    object: "tamagotchi",
    image: "/objects/mbti.png", short: "MZ력", name: "나의 MZ력 테스트",
    description: "나는 옛크크? 늙크크?\n지금 바로 확인해요.",
    hearts: 2,
    featured: true,
  },

  { id: "today-luck", type: "사주", label: "TODAY LUCK", category: "재미", tone: "pink", object: "star-charm", image: "/products/red-thread.png", short: "오늘", name: "오늘의 운세", hearts: 2, rank: 1 },
  { id: "tojeong-2026", type: "사주", label: "TOJEONG 2026", category: "종합", tone: "lavender", object: "cd", image: "/objects/saju.png", short: "토정비결", name: "2026 토정비결", hearts: 10, rank: 2 },
  { id: "money-flow", type: "사주", label: "MONEY FLOW", category: "재물", tone: "blue", object: "key", image: "/objects/ziwei.png", short: "재물운", name: "나의 재물운", hearts: 7, rank: 3 },
  { id: "red-thread", type: "타로", label: "RED THREAD", category: "연애", tone: "pink", object: "butterfly", image: "/products/red-thread.png", short: "인연", name: "인연의 붉은 실", hearts: 3, rank: 4 },
  { id: "re-match", type: "타로", label: "RE:MATCH", category: "연애", tone: "pink", object: "flip-phone", image: "/products/re-match.png", short: "재회", name: "재회 가능성", hearts: 8, rank: 5 },
  { id: "mbti-match", type: "MBTI", label: "MBTI MATCH", category: "연애", tone: "lavender", object: "heart", image: "/objects/mbti.png", short: "MBTI", name: "MBTI 연애 궁합", hearts: 3, rank: 6 },

  { id: "name-match", type: "사주", label: "NAME MATCH", category: "연애", tone: "lavender", object: "envelope", image: "/products/re-match.png", short: "이름", name: "이름 궁합", hearts: 2 },
  { id: "job-luck", type: "사주", label: "JOB LUCK", category: "직장", tone: "blue", object: "key", image: "/objects/ziwei.png", short: "취업", name: "취업·이직운", hearts: 6 },
  { id: "exam-luck", type: "사주", label: "EXAM LUCK", category: "직장", tone: "lavender", object: "star-charm", image: "/objects/tarot.png", short: "합격", name: "시험·합격운", hearts: 7 },
  { id: "monthly", type: "사주", label: "MONTHLY", category: "종합", tone: "pink", object: "cd", image: "/objects/saju.png", short: "이달", name: "이달의 운세", hearts: 4 },
  { id: "life-saju", type: "사주", label: "LIFE SAJU", category: "종합", tone: "lavender", object: "crystal-ball", image: "/objects/saju.png", short: "평생", name: "평생 사주 총운", hearts: 18 },

  { id: "ziwei-chart", type: "자미두수", label: "ZIWEI CHART", category: "종합", tone: "lavender", object: "crystal-ball", image: "/objects/ziwei.png", short: "명반", name: "자미두수 명반 풀이", hearts: 12 },
  { id: "ziwei-love", type: "자미두수", label: "ZIWEI LOVE", category: "연애", tone: "pink", object: "butterfly", image: "/products/love-fortune.png", short: "12궁", name: "자미두수 연애 12궁", hearts: 8 },
  { id: "ziwei-2026", type: "자미두수", label: "ZIWEI 2026", category: "종합", tone: "blue", object: "cd", image: "/objects/ziwei.png", short: "운로", name: "자미두수 올해 운로", hearts: 10 },
  { id: "past-life", type: "자미두수", label: "PAST LIFE", category: "재미", tone: "blue", object: "padlock", image: "/objects/tarot.png", short: "전생", name: "나의 전생은?", hearts: 3 },

  { id: "love-type", type: "MBTI", label: "LOVE TYPE", category: "연애", tone: "pink", object: "tamagotchi", image: "/objects/mbti.png", short: "유형", name: "나의 연애 유형", hearts: 4 },

  { id: "today-tarot", type: "타로", label: "TODAY TAROT", category: "재미", tone: "lavender", object: "star-charm", image: "/objects/tarot.png", short: "타로", name: "오늘의 타로", hearts: 2 },
  { id: "love-tarot", type: "타로", label: "LOVE TAROT", category: "연애", tone: "pink", object: "envelope", image: "/products/match-saju.png", short: "연애", name: "연애 타로", hearts: 6 },
];

export const featuredProducts = products.filter((p) => p.featured);

export const trendingProducts = products
  .filter((p) => p.rank)
  .sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0));

export const productsByType = (type: TestType) =>
  products.filter((p) => p.type === type);
