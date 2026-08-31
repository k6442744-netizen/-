# FORTUNE PORTAL

> Clean Y2K Web × 2000s Highteen × Pastel Tech × Fortune
> "2000년대 초 인터넷에서 발견한, 조금은 신비롭고 사랑스러운 운세 포털."

`FORTUNE_PORTAL_DESIGN_SYSTEM.md` v1.0을 기준으로 구현한 **모바일 웹 전용** 사주 서비스입니다.

## 실행

```bash
pnpm install
pnpm dev      # http://localhost:3021
```

## 배포 (GitHub Pages)

라이브: **https://k6442744-netizen.github.io/-/**

```bash
pnpm run deploy:pages
```

- Next를 `output: "export"` 정적 빌드로 내보내 `gh-pages` 브랜치에 푸시합니다
- 프로젝트 페이지라 `/<repo>` 하위에 서빙되므로 빌드 시 `NEXT_PUBLIC_BASE_PATH`를 주입합니다
- `next/image`는 `unoptimized` 상태에서 basePath를 자동으로 붙이지 않습니다.
  순수 `<img>`도 마찬가지라, public 에셋 경로는 **반드시 `asset()`(`src/lib/asset.ts`)로 감싸야** 합니다
- `public/.nojekyll` — 없으면 GitHub Pages가 `_next/` 디렉터리를 무시합니다

### Actions 자동 배포 (미적용)

워크플로 파일을 `docs/github-pages-workflow.yml`에 준비해 뒀습니다.
현재 gh 토큰에 `workflow` 스코프가 없어 `.github/workflows/` 경로로는 푸시가 거부되기 때문입니다.

스코프를 추가한 뒤 제자리로 옮기면 push할 때마다 자동 배포됩니다.

```bash
gh auth refresh -s workflow
```

```bash
mkdir -p .github/workflows && mv docs/github-pages-workflow.yml .github/workflows/deploy.yml
```

이때 Pages 소스를 `gh-pages` 브랜치 → **GitHub Actions**로 바꿔야 합니다.

## 뷰포트 규칙

| 항목 | 값 |
| --- | --- |
| 최소 폭 | **360px** (`html { min-width: 360px }` — 더 좁으면 가로 스크롤) |
| 최대 폭 | **420px** (`AppFrame`의 `max-w-[420px]`, 그 이상은 가운데 정렬) |
| Page padding | 20px (360~374px 구간은 16px) |
| Section gap | 48px |

데스크톱 확장은 하지 않았습니다. 프레임 바깥은 연한 라벤더 배경 + 1px 실버 사이드 보더로 처리됩니다.

## 화면

| 경로 | 화면 | 비고 |
| --- | --- | --- |
| `/` | 메인 | Hero · 종류 메뉴 · 상품 3단 · Fortune Message · Feature Bar · Utility Nav |
| `/tests/[slug]` | 테스트 종류별 목록 | `saju` · `ziwei` · `mbti` · `tarot` (SSG) |
| `/login` | 간편 로그인 | 카카오 / 네이버 / Google / Apple |

헤더 좌측 메뉴 버튼 → **마이페이지 오버레이**(`MobileMenu`). 로그인 정보 · 대표프로필 · 하트 잔액 · 계정 메뉴.
재화는 **하트** 하나입니다. 상품 가격도 원화가 아니라 하트 개수(`products[].hearts`)로 표기하며,
표기는 **픽셀 숫자 + 픽셀아트 하트**(`HeartCoin`, `public/objects/heart.png`) 조합입니다 — 피그마 `키치사주` 41-2430 규칙.
샘플 계정 데이터는 `MobileMenu.tsx` 상단 `account` 객체에 있습니다.

> ⚠️ 헤더에 `backdrop-blur`가 걸려 있어 그 안의 `position: fixed`는 헤더에 갇힙니다.
> 오버레이는 `createPortal`로 `document.body`에 렌더해야 합니다.

### 간편 로그인 연동 지점

`src/components/auth/LoginPanel.tsx`의 **`handleLogin` 한 곳**에서 각 사업자 OAuth를 호출하면 됩니다.
현재는 `TODO` 주석 자리에 0.5초 지연 후 "연동 준비 중" 시스템 메시지를 띄우는 placeholder가 들어가 있습니다.

제공자 목록·문구·로고·버튼 스타일은 `src/components/auth/providers.tsx`에서 관리합니다.
대표 수단(카카오)만 전체 폭 버튼, 나머지는 아이콘 버튼 — 브랜드 컬러가 화면을 지배하지 않게 하기 위한 구성입니다 (§2 컬러 비율).

> 소셜 브랜드 컬러(`--color-kakao`, `--color-naver`)는 각 사업자 가이드가 색을 고정하므로 **팔레트 예외**로 두었습니다. 소셜 로그인 버튼 외에는 사용하지 않습니다.
> Apple 버튼은 가이드의 화이트 변형을 써서 디자인 시스템의 Black CTA 금지(§9)와 충돌하지 않게 했습니다.

## 컬러 (v2 — 하이채도 Y2K 팔레트)

레퍼런스(2000년대 Y2K 커머스 사이트)에 맞춰 **UI 구조는 그대로 두고 토큰 값만** 재조정했습니다.
디자인 시스템 §2의 원본 팔레트보다 채도가 높습니다.

| Token | v1 (DS 원본) | v2 (현재) |
| --- | --- | --- |
| `--pink-primary` | `#FF70A9` | `#FF4FA3` |
| `--pink-soft` | `#F8C4D8` | `#FFB3DC` |
| `--lavender-primary` | `#9D83D8` | `#9B6BFF` |
| `--lavender-soft` | `#DDD4F6` | `#E0D0FF` |
| `--blue-soft` | `#D8ECFA` | `#C8ECFF` |
| `--text-primary` | `#27232E` | `#2B1B3D` |
| `--bg-pink` | `#FFF5F8` | `#FFEEF7` |

Chrome 타이포·iridescent(CD)·윈도우 타이틀 바·카드 톤도 같은 방향으로 조정했습니다.
소셜 로그인 브랜드 컬러는 영향받지 않습니다.

### 테두리

레퍼런스처럼 **검은 외곽선**을 씁니다 — `--color-outline: #2A1A3A` (순검정보다 살짝 자주빛).

- 검정: 윈도우 외곽 · 타이틀 바 하단선 · `_ □ ×` · 미니카드 외곽/구분선 · 버튼 · 카테고리 칩 · 피처 바/유틸리티 내비 외곽
- 연한 실버(`--color-silver`): 컨테이너 **내부** 구분선

바깥은 검정, 안쪽은 연하게 — 이 대비가 무거워지지 않는 핵심입니다.

## 디자인 토큰

`src/app/globals.css` 한 곳에서 관리합니다.

- `@theme` — Tailwind 유틸리티로 노출되는 토큰
  (`bg-page`, `text-ink`, `border-silver`, `text-brand-pink`, `rounded-win`, `shadow-card` …)
- `:root` — 디자인 시스템 문서와 **동일한 이름**의 raw CSS 변수
  (`--pink-primary`, `--lavender-soft`, `--border-pink` …)

하드코딩된 색상값은 사용하지 않습니다. 새 색·radius·shadow가 필요하면 기존 토큰을 먼저 확인하세요 (§20-15).

유틸리티 클래스: `.pixel`(영문 라벨), `.chrome-silver` / `.chrome-pink`(Hero 크롬 타이포), `.iridescent`(CD 소재), `.grad-*`(허용된 그라데이션).

## 폰트

**페이퍼로지(Paperlogy) 한 가지로 통일**했습니다. 제목·본문·라벨 모두 같은 서체이고,
역할 구분은 **굵기 · 크기 · 자간**으로만 만듭니다 (§4).

| Weight | 파일 | 쓰임 |
| --- | --- | --- |
| 400 Regular | `src/fonts/Paperlogy-4Regular.woff2` | 본문 · 캡션 (`.dot-text`) |
| 500 Medium | `src/fonts/Paperlogy-5Medium.woff2` | 짧은 라벨 (`.dot-label`) |
| 600 SemiBold | `src/fonts/Paperlogy-6SemiBold.woff2` | 버튼 · 영문 microcopy (`.pixel`) |
| 700 Bold | `src/fonts/Paperlogy-7Bold.woff2` | 섹션·카드 제목 (`.dot-title`) |

`next/font/local`로 셀프호스팅하고 `--font-paperlogy-base` CSS 변수로 노출합니다.
`--font-kr` / `--font-title` / `--font-label` / `--dot-text` / `--font-pixel` 토큰은
호환을 위해 남겨 뒀지만 전부 같은 서체를 가리킵니다.

### 한글/영문 라벨 원칙

디자인 시스템 §4-C는 라벨을 영문으로 규정하지만, 영문이 많아 읽기 어렵다는 피드백에 따라
**의미는 한글, 분위기는 영문**으로 나눴습니다.

| | 표기 | 예 |
| --- | --- | --- |
| 의미를 전달하는 라벨 | 한글 · `.dot-label` (`DotLabel`) | `운세 골라보기` · `지금 인기 운세` · `궁합 사주` · `1위` · `총 22개` |
| 장식용 표기 | 영문 · `.pixel` (`PixelLabel`) | 브랜드 워드마크 · 섹션 오버라인(`PICK YOUR FORTUNE`) · `NOW ONLINE` · `FORTUNE ID 001` · `.EXE` 윈도우 · 저작권 |

상품 데이터의 `label`(영문 코드)은 화면에 노출되지 않고, Featured 윈도우 라벨은 `labelKo`,
Mini Card 라벨은 `type`을 씁니다.

> 4종 합계 약 640KB입니다. 더 줄여야 하면 Medium/SemiBold를 빼고 400·700 두 종만 쓰는 것을
> 먼저 검토하세요.

## 컴포넌트 구조

```
src/components/
├── auth/     LoginPanel · providers
├── layout/   AppFrame(360~420 프레임) · Header · SubHeader · Footer
├── y2k/      RetroWindow · PixelLabel · StatusBadge · ChromeTitle · PixelDecoration
├── fortune/  FortuneHero · FeatureBar · FeaturedFortuneCard · FortuneCarousel
│             MiniFortuneCard · TrendingRow · AllFortuneGrid · TestTypeMenu
│             FortuneMessage · UtilityNav · FortuneObject
└── ui/       Button · Icon · SectionHeader
```

섹션 구성 (§12 Section System):

```
HEADER              좌: 메뉴 / 중앙: 로고 / 우: 로그인
HERO                이미지 한 장 (8:5)
TEST TYPE MENU      사주 / 자미두수 / MBTI / 타로 → 종류별 페이지로 이동
PICK YOUR FORTUNE   Featured 스와이프 캐러셀 (다음 카드 peek)
NOW TRENDING        Mini Card 가로 스크롤 + 순위
FORTUNE MESSAGE.EXE
ALL FORTUNE         주제 칩 + 2열 Mini Card 그리드 (8개씩 더 보기)
FEATURE BAR         신뢰 정보이므로 하단 배치
UTILITY NAV
FOOTER
```

### 두 개의 분류 축

| 축 | 값 | 쓰이는 곳 |
| --- | --- | --- |
| `type` (풀이 방식) | 사주 · 자미두수 · MBTI · 타로 | 상단 종류 메뉴 → `/tests/[slug]` |
| `category` (주제) | 연애 · 종합 · 재물 · 직장 · 재미 | ALL FORTUNE 칩 필터 |

### 상품 노출 위계 (§20-12)

| 티어 | 컴포넌트 | 데이터 조건 | 크기 |
| --- | --- | --- | --- |
| Featured | `FeaturedFortuneCard` (Retro Window) | `featured: true` | 카드 폭 89%, 오브젝트 112px |
| Trending | `MiniFortuneCard` + 순위 | `rank` 있음 | 카드 폭 148px, 오브젝트 76px |
| All | `MiniFortuneCard` | 전체 | 2열, 오브젝트 76px |

Retro Window 문법은 Featured / Fortune Message에만 쓰고 Mini Card에는 반복하지 않습니다 (§7 남발 금지).

상품 데이터는 `src/lib/products.ts` 한 곳(현재 15개, **샘플 데이터**)에 있습니다. `featured` / `rank` 플래그만 바꾸면 노출 위치가 바뀝니다.

## 히어로 이미지

히어로는 배너 이미지로 채우는 구성입니다. 에셋을 `public/`에 넣고 `slides`에 추가하면 됩니다.

```tsx
<FortuneHero
  ratio="1558/1009"
  slides={[
    { src: "/hero.jpg", alt: "990원 사주" },
    { src: "/hero-2.jpg", alt: "궁합운세 Destiny Match" },
  ]}
/>
```

현재 적용된 에셋 — CD 주얼케이스 키비주얼:

| 파일 | 원본 | 용량 |
| --- | --- | --- |
| `public/hero.jpg` | 1558 × 1009 | 628KB |
| `public/hero-2.jpg` | 1557 × 1010 | 583KB |
| `public/og.jpg` | 1200 × 630 (첫 배너 하단 크롭) | 333KB |

- `ratio`는 **첫 배너 원본 비율**을 넘깁니다. 두 번째 배너는 `object-cover`라 좌우가 1%쯤 잘리는데, 제목이 상단에 있어 세로가 잘리는 쪽을 피한 선택입니다
- **JPEG로 넣으세요.** `output: "export"` + `images: { unoptimized: true }`라 `next/image`가 최적화하지 않고 **원본이 그대로 나갑니다.** PNG 원본(각 2.5MB)을 그대로 두면 LCP가 눈에 띄게 늦습니다. `sips -s format jpeg -s formatOptions 90` 기준 1/4로 줄었고 표시 폭(최대 420px)에서는 차이가 보이지 않습니다
- `slides`가 2장 이상이면 4초 간격으로 자동 순환하고, 드래그·점 인디케이터로도 넘길 수 있습니다
- `slides`가 없으면 자리만 유지하는 placeholder가 렌더됩니다 (§20-13)
- `next/image`의 `fill` + `priority`로 렌더 — LCP 이미지이므로 우선 로딩됩니다
- OG 썸네일은 첫 배너에서 따로 만듭니다. 배너를 바꾸면 `public/og.jpg`도 같이 갱신하세요.
  `--cropOffset` 은 중심이 아니라 **좌상단 원점** 기준(Y X)이므로, 제목이 있는 쪽이
  남도록 오프셋을 잡아야 합니다. 현재 배너는 제목이 하단이라 아래쪽을 남깁니다

  ```
  # 1558×1009 에서 아래쪽 813px (1009-813=196)
  sips -c 813 1558 --cropOffset 196 0 <원본> --out /tmp/c.png
  sips -z 630 1200 -s format jpeg -s formatOptions 88 /tmp/c.png --out public/og.jpg
  ```

## 3D 오브젝트 (§11, §20-13)

실제 3D 렌더 에셋이 없어 `FortuneObject`가 **소재 placeholder**를 그립니다.
Translucent Plastic / Glass / Chrome / Pearl 소재감만 단순 기하 형태로 표현했고, 복잡한 일러스트는 넣지 않았습니다.

에셋이 준비되면 `src`만 넘기면 그대로 교체됩니다.

```tsx
<FortuneObject name="heart" src="/objects/heart.png" size={112} />
```

**적용된 실제 에셋** — 테스트 종류 4종 (`public/objects/{saju,ziwei,mbti,tarot}.png`, 627×627)
원본이 흰 배경 PNG였어서, 가장자리에서 연결된 흰 영역만 플러드필로 투명 처리했습니다
(오브젝트 내부 하이라이트는 보존). 새 에셋도 흰 배경이면 같은 처리가 필요합니다.

매핑: 궁합→Heart · 대운→Crystal Ball · 연애사주→Padlock+Key · MZ테스트→Tamagotchi · Message→Envelope · Hero→CD + Flip Phone

## 접근성 (§17)

- 본문 14px 이상, CTA touch target 44px 이상 (캐러셀 화살표는 시각 30px + `::before`로 44px 히트영역)
- 장식용 `_ □ ×`는 `aria-hidden`, 실제 버튼과 분리
- Pixel Font로만 전달되는 정보 없음 — 섹션 제목은 `sr-only` 한글 라벨 병기
- `prefers-reduced-motion` 대응, 한글 `word-break: keep-all`
