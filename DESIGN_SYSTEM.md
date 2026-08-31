# FORTUNE PORTAL --- Design System v1.0

> **Core concept:** Clean Y2K Web × 2000s Highteen × Pastel Tech ×
> Fortune\
> **Brand sentence:** "2000년대 초 인터넷에서 발견한, 조금은 신비롭고
> 사랑스러운 운세 포털."

Claude Code에서 FORTUNE PORTAL 웹 UI를 구현할 때 사용하는 디자인 시스템
및 구현 가이드입니다.

------------------------------------------------------------------------

## 1. Design Direction

### Keywords

-   Clean Y2K
-   Early 2000s Internet
-   Highteen
-   Pastel Tech
-   CD / Flip Phone
-   Pixel UI
-   Chrome
-   Translucent Plastic
-   Girlish / Nostalgic

### Visual Balance

-   Clean 60%
-   Y2K 30%
-   Kitsch 10%

### Avoid

갸루, 호피, 과한 핫핑크, 네온 사이버펑크, 과한 글로우/그라데이션, 모든
요소의 픽셀화, 지나치게 둥근 SaaS UI, 강한 그림자, 상품별로 다른 아트
스타일.

------------------------------------------------------------------------

## 2. Color System

UI 면적의 대부분은 White 계열을 유지합니다.

  Token                  HEX         Usage
  ---------------------- ----------- ----------------
  `--bg-primary`         `#FFFCFD`   전체 페이지
  `--bg-pink`            `#FFF5F8`   핑크 섹션
  `--bg-lavender`        `#F8F5FF`   보조 섹션
  `--pink-primary`       `#FF70A9`   CTA / Active
  `--pink-soft`          `#F8C4D8`   Window Bar
  `--lavender-primary`   `#9D83D8`   브랜드 UI
  `--lavender-soft`      `#DDD4F6`   배경 / 라인
  `--blue-soft`          `#D8ECFA`   카드 Variation
  `--silver-light`       `#E8E7EC`   Border
  `--silver-mid`         `#C7C5CE`   비활성 UI
  `--text-primary`       `#27232E`   제목
  `--text-secondary`     `#66606E`   설명

**Color ratio:** White 65 / Pink 15 / Lavender 10 / Baby Blue 5 / Silver
5.

``` css
:root {
  --bg-primary: #FFFCFD;
  --bg-pink: #FFF5F8;
  --bg-lavender: #F8F5FF;
  --pink-primary: #FF70A9;
  --pink-soft: #F8C4D8;
  --lavender-primary: #9D83D8;
  --lavender-soft: #DDD4F6;
  --blue-soft: #D8ECFA;
  --silver-light: #E8E7EC;
  --silver-mid: #C7C5CE;
  --text-primary: #27232E;
  --text-secondary: #66606E;
}
```

진한 핑크는 넓은 배경 면으로 사용하지 않고 CTA, Active Dot, 작은 아이콘,
강조 텍스트에만 제한적으로 사용합니다.

------------------------------------------------------------------------

## 3. Gradient Rules

Gradient는 장식보다 **소재감 표현**에 사용합니다.

### Allowed

-   Pale Pink → White
-   Lavender → Baby Blue
-   Silver → Pale Pink
-   CD / Chrome / Glass object의 iridescent gradient

``` css
background: linear-gradient(90deg, #FFF1F6 0%, #F8D9E6 100%);
```

### Do Not

Hot Pink → Purple, 강한 Neon Gradient, 전체 배경 Aurora Gradient, CTA
전체 Gradient.

------------------------------------------------------------------------

## 4. Typography

**폰트는 페이퍼로지(Paperlogy) 한 계열로 통일한다.** 역할 구분은 서체를
바꾸는 대신 **굵기 · 크기 · 자간**으로만 만든다.

  Weight             파일                          쓰임
  ---------------- --------------------------- ----------------------
  400 Regular        `Paperlogy-4Regular`        본문 · 캡션
  500 Medium         `Paperlogy-5Medium`         라벨 (`.dot-label`)
  600 SemiBold       `Paperlogy-6SemiBold`       버튼 · 영문 microcopy
  700 Bold           `Paperlogy-7Bold`           제목 (`.dot-title`)

### A. Display / Hero

`990원`, `사주` 등 핵심 캠페인 타이틀. Smooth / Chrome / Slight Italic /
2000s album-title 감성. 3D·Chrome·Glossy 효과는 이 계층에만 허용.

``` css
font-size: clamp(48px, 15vw, 72px);
line-height: .95;
```

### B. Korean UI

페이퍼로지 Regular / Medium / SemiBold / Bold.

  Role              Mobile Size     Weight
  --------------- ------------- ----------
  Page Title           28--32px        700
  Product Title        24--28px   600--700
  Section Title        18--22px        700
  Body                 14--16px        400
  Button               14--15px        600
  Caption              12--13px        400

Title line-height: `1.25–1.35`.

### C. Label / Microcopy

`FORTUNE PORTAL`, `PICK YOUR FORTUNE`, `NOW TRENDING`, `LOVE FORTUNE`,
`01 / 04`, `NOW ONLINE`, `FORTUNE MESSAGE.EXE` 등에만 사용. 본문에는
사용하지 않습니다. 서체는 본문과 같고, 작은 크기 · 넓은 자간으로만
라벨 성격을 만듭니다.

``` css
font-size: 11px;
font-weight: 600;
letter-spacing: .08em;
```

------------------------------------------------------------------------

## 5. Spacing

**4px Base Grid**

`4 / 8 / 12 / 16 / 24 / 32 / 48 / 64`

Mobile: - Page padding: 20px - Section gap: 48px - Card padding: 20px

Desktop: - Page padding: 48--64px - Section gap: 64px - Card padding:
24px

Y2K 요소가 많더라도 여백은 현대 웹처럼 넉넉하게 유지합니다.

------------------------------------------------------------------------

## 6. Border / Radius / Shadow

``` css
--border-default: 1px solid #D8D4DE;
--border-pink: 1px solid #F3A7C5;
--border-lavender: 1px solid #B8A9DD;
--border-active: 1.5px solid #FF70A9;

--shadow-object: 0 8px 24px rgba(70,55,90,.08);
--shadow-card: 0 4px 16px rgba(70,55,90,.04);
```

Radius: - Window/Card/Button: 2--4px - Tag: 2px - Status Pill: 999px

Square UI가 기본입니다. 일반 카드에 16--24px Radius를 사용하지 않습니다.

------------------------------------------------------------------------

## 7. Signature Component --- Retro Window

``` text
┌ ♡ LOVE FORTUNE ───────────── _ □ × ┐
│                                     │
│               CONTENT               │
│                                     │
└─────────────────────────────────────┘
```

Window Header: - Height 32--36px - Pale Pink / Lavender / Baby Blue -
1px bottom border - 영문 라벨(`.pixel`) - 우측 `_ □ ×` decoration

Retro Window는 상품, Fortune Message, Event, 특별 콘텐츠에만 사용하고
모든 섹션에 남발하지 않습니다.

------------------------------------------------------------------------

## 8. Product Cards

### Featured Card

Mobile 핵심 상품. Width 100%, Height 약 300--340px. Visual/Text 약
50:50.

``` text
♡ LOVE FORTUNE                       _ □ ×

        [ 3D OBJECT ]

                         너와 나의
                         궁합은?

                         짧은 설명

────────────────────────────────────────

990원                            VIEW →
```

### Mini Card

`NOW TRENDING` 등에 사용하며 모바일 기본 2열. Image 55%, Text 45%. 긴
설명은 넣지 않습니다.

------------------------------------------------------------------------

## 9. Button

``` css
.button-primary {
  min-height: 44px;
  padding: 0 20px;
  border: 1px solid var(--pink-primary);
  border-radius: 3px;
  background: #fff;
  color: var(--pink-primary);
  font-weight: 600;
}
.button-primary:hover {
  background: #FFF2F7;
}
```

예: `보러가기 →`

금지: Black CTA, Full Pink CTA 남발, 과한 Pill Button, 강한
Shadow/Gradient.

------------------------------------------------------------------------

## 10. Icon & Decoration

Functional Icon: Thin Line, 약 1.5px stroke.\
Decorative Icon: Pixel Heart, Cursor, Star, Butterfly, Mail, Folder, CD.

컬러는 Pink / Lavender / Baby Blue 중 하나.

한 viewport 장식은 대략 **5--8개 이하**. 추천 크기 `8 / 12 / 16 / 24px`.

장식 개수보다 소재, Typography, Window UI로 Y2K 무드를 만듭니다.

------------------------------------------------------------------------

## 11. 3D Object System

Material: - Translucent Plastic - Glass - Chrome - Pearl - Acrylic

Objects: - CD - Flip Phone - Heart - Crystal Ball - Padlock - Key -
Butterfly - Star Charm - Tamagotchi - Envelope

Service mapping: - 궁합 → Pink Heart + Pearl Chain - 대운 → Lavender
Crystal Ball - 연애사주 → Transparent Lock + Silver Key - MZ 테스트 →
Tamagotchi - Message → Pink Envelope - Hero → CD + Flip Phone

모든 상품 이미지는 **같은 세계관의 제품처럼** 보여야 합니다. 기본 배경은
White 또는 Transparent.

------------------------------------------------------------------------

## 12. Section System

페이지는 아래 5개 타입으로 확장합니다.

1.  **Hero** --- Chrome Display + Main 3D Object + Pixel Status + 넓은
    여백
2.  **Feature Bar** --- 간편결제 / 즉시확인 / 비밀보장 / 후기
3.  **Featured Window** --- 핵심 상품
4.  **Mini Window Grid** --- Trending / 서브 상품
5.  **System Window** --- Message / Event / Notice / Daily Fortune

------------------------------------------------------------------------

## 13. Mobile Layout

Reference viewport: `390px`

``` text
Page Padding: 20px
Content Width: 350px
2 Column: 169px + 12px + 169px
```

``` css
.mobile-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}
```

Recommended structure:

``` text
HEADER
HERO
  NOW ONLINE
  Main Copy
  990원 사주
  CD + Flip Phone
FEATURE BAR
PICK YOUR FORTUNE
  Featured swipe card
  Pagination dots
NOW TRENDING
  2-column Mini Card Grid
FORTUNE MESSAGE.EXE
UTILITY NAV
FOOTER
```

모바일을 Desktop의 단순 축소판으로 만들지 않습니다.

------------------------------------------------------------------------

## 14. Desktop Layout

Reference: 1440px / Content max-width 1200px / 12-column grid.

Hero: - Text 5 columns - Visual 7 columns

Product: - 6 / 6 또는 - Featured 8 / Trending 4

------------------------------------------------------------------------

## 15. Hero Rules

Hero가 Y2K 표현이 가장 강한 영역입니다.

Required: - White / Pale Pink background - Chrome Display Typography -
CD 또는 Flip Phone - Pixel Status Label - 작은 Star / Heart decoration

Desktop: Text left / Objects right.\
Mobile: Text upper-left / 큰 CD background / Flip Phone lower-right
overlap.

**Hero 배경의 최소 60% 이상은 시각적으로 여유 있는 공간으로 느껴져야
합니다.**

------------------------------------------------------------------------

## 16. Responsive

``` css
@media (min-width: 768px) {}
@media (min-width: 1024px) {}
@media (min-width: 1440px) {}
```

Rules: - 모바일 상품 전체를 긴 1열 목록으로 만들지 않기 - Featured는
크게, 나머지는 2열 또는 horizontal scroll - Mobile Hero에서는 object
overlap 적극 활용 - Decorative asset은 작은 화면에서 일부 숨김 - Pixel
font를 가독성 이하로 축소하지 않기

------------------------------------------------------------------------

## 17. Accessibility / UX

Y2K 표현 때문에 UX를 희생하지 않습니다.

-   본문 최소 14px 권장
-   CTA touch target 최소 44px
-   실제 버튼과 장식용 `_ □ ×`를 명확히 구분
-   중요 정보는 영문 라벨(`.pixel`)만으로 표현하지 않음
-   텍스트 대비 확보
-   이미지 안에 핵심 정보를 가두지 않음
-   Hover에만 의존하지 않음

------------------------------------------------------------------------

## 18. Brand Graphic Formula

새로운 화면마다 아래 공식을 반복합니다.

-   **Normal:** White + Dark Text + 1px Silver Line
-   **Y2K:** Pastel Window + Pixel Label
-   **Highlight:** Chrome Typography + 3D Object
-   **Emotion:** Tiny Pixel Heart + Star + Butterfly

------------------------------------------------------------------------

## 19. Component Architecture

``` text
components/
├── layout/
│   ├── Header
│   ├── Footer
│   └── PageContainer
├── y2k/
│   ├── RetroWindow
│   ├── WindowHeader
│   ├── PixelLabel
│   ├── StatusBadge
│   ├── PixelDecoration
│   └── ChromeTitle
├── fortune/
│   ├── FortuneHero
│   ├── FeatureBar
│   ├── FeaturedFortuneCard
│   ├── MiniFortuneCard
│   ├── FortuneCarousel
│   └── FortuneMessage
└── ui/
    ├── Button
    ├── Icon
    └── SectionHeader
```

------------------------------------------------------------------------

## 20. Claude Code Implementation Rules

Claude Code는 아래 규칙을 우선순위 높게 준수해야 합니다.

1.  기존 콘텐츠의 의미와 서비스 구조를 임의로 변경하지 않는다.
2.  모바일 우선으로 구현하고 Desktop에서 확장한다.
3.  전체 배경은 밝고 깨끗하게 유지한다.
4.  Y2K를 핫핑크/네온의 양으로 표현하지 않는다.
5.  Chrome/Gloss 효과는 Hero와 핵심 3D asset에 집중한다.
6.  라벨 스타일(`.pixel`)은 영문 label과 microcopy에만 사용한다.
7.  상품 카드마다 같은 Retro Window 문법을 유지한다.
8.  Border는 1px 중심, Radius는 2--4px 중심으로 한다.
9.  카드마다 불필요한 Shadow를 넣지 않는다.
10. UI보다 콘텐츠가 먼저 읽혀야 한다.
11. 장식 요소는 기능 요소보다 시각적으로 약해야 한다.
12. 모바일에서 Featured 상품과 Trending 상품의 위계를 명확히 구분한다.
13. 3D asset이 없을 경우 임의의 복잡한 일러스트를 넣지 말고 placeholder
    영역을 유지한다.
14. 새로운 섹션도 기존 5가지 Section System을 우선 재사용한다.
15. 새로운 색상, radius, shadow를 임의로 추가하기 전에 기존 token을 우선
    사용한다.

------------------------------------------------------------------------

## 21. Do / Don't

### DO

-   Clean white space
-   Pastel colors
-   Silver details
-   Chrome display typography
-   Early 2000s Windows UI
-   Pixel microcopy
-   Translucent 3D objects
-   Thin borders
-   Square cards
-   CD / Flip Phone / Charm aesthetic

### DON'T

-   Hot pink overload
-   Leopard print
-   Gyaru graphics
-   Heavy gradient
-   Huge rounded cards
-   Strong shadow
-   Neon glow
-   Everything pixelated
-   Every section decorated
-   Different art style for every product

------------------------------------------------------------------------

## 22. Final Visual Check

구현 완료 후 아래 질문에 모두 `YES`여야 합니다.

-   화면의 60% 이상이 밝고 정돈되어 보이는가?
-   핑크가 배경을 지배하지 않는가?
-   Y2K가 네온이 아니라 CD/Chrome/Pixel/Window UI로 표현되는가?
-   상품 카드들이 하나의 브랜드에서 제작된 것처럼 보이는가?
-   일반 한글 본문이 쉽게 읽히는가?
-   라벨 스타일(`.pixel`)이 microcopy에만 제한되어 있는가?
-   Border가 얇고 Radius가 작게 유지되는가?
-   모바일에서 핵심 상품이 가장 먼저 눈에 들어오는가?
-   장식보다 상품/CTA가 먼저 읽히는가?
-   10대 후반부터 30대 후반까지 사용할 수 있을 정도로 과하게 유치하지
    않은가?

------------------------------------------------------------------------

**Design North Star**

> **Clean / Nostalgic / Girlish**\
> 2000년대 초 인터넷에서 발견한, 조금은 신비롭고 사랑스러운 운세 포털.
