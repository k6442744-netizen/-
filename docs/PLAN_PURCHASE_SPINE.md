# 기획 — 구매 스파인

> 상품 상세 → 정보 입력 → 결제 확인 → 결과 → 보관함
> 지금 서비스에서 통째로 비어 있는 축. 이게 뚫려야 나머지 화면이 의미를 갖는다.

- 기준 문서: `DESIGN_SYSTEM.md`(색·타이포·여백·컴포넌트) · `README.md`(구현 규칙)
- 이 문서는 **화면·인터랙션 정의**까지만 다룬다. 실제 풀이 로직은 범위 밖 — 결과는 목데이터
- 인터랙션 톤: **현재 수준 유지(절제)**. 모션은 조작 피드백에만 쓰고 장식성 연출은 늘리지 않는다

---

## 0. 전제 — 정적 export라는 제약

`next.config.ts`가 `output: "export"`다. 기획이 여기서 갈리므로 먼저 못박는다.

| 못 하는 것 | 대신 |
| --- | --- |
| API Route · Server Action | 없음. 결제/결과 생성은 **전부 클라이언트** |
| 요청 시점 렌더 (`searchParams` 서버 수신) | 동적 라우트는 `generateStaticParams`로 전부 프리렌더 |
| 세션·DB | `sessionStorage`(구매 진행) + `localStorage`(보관함·프로필) |
| `next/image` 최적화 | `unoptimized` — public 에셋은 반드시 `asset()`로 감싼다 |

- 상품 21개 → `/fortune/[id]`, `/result/[id]` 전부 SSG 가능. 문제 없음
- 쿼리스트링을 읽어야 하면 `useSearchParams` + `<Suspense>` 필수 (export 빌드에서 누락 시 빌드 실패)
- `trailingSlash: true` — 내부 링크는 `next/link`로만. 수기 `href` 문자열 금지

> 나중에 실제 결제·풀이 API가 붙으면 `output: "export"`를 걷어내야 한다.
> 그때 화면을 다시 짜지 않도록 **데이터 접근은 `src/lib/` 함수 뒤로만** 두고 컴포넌트가 직접 storage를 만지지 않게 한다.

---

## 1. 여정

```text
메인 / 종류별 목록 / 인기
        │  카드 탭
        ▼
  ① 상품 상세  /fortune/[id]
        │  "이 운세 보기"  (하단 고정 CTA)
        ▼
  ② 정보 입력  /fortune/[id]/input
        │  "확인하기"
        ▼
  ③ 결제 확인  (하단 시트 — 라우트 아님)
        │           │ 하트 부족
        │           ▼
        │     ④ 하트 충전  /heart  →  돌아와서 시트 재오픈
        ▼
  ⑤ 결과      /result/[id]
        │  자동 저장
        ▼
  ⑥ 보관함    /my/box
```

**되돌아가기 규칙** — 각 화면의 `SubHeader` 뒤로가기는 브라우저 히스토리를 따른다.
단 ⑤ 결과에서 뒤로 가면 ②③이 아니라 **① 상세**로 보낸다(`backHref` 지정).
이미 산 걸 다시 결제하는 흐름으로 되돌아가면 안 된다.

---

## 2. 라우트

| 경로 | 화면 | 렌더 | 비고 |
| --- | --- | --- | --- |
| `/fortune/[id]/` | 상품 상세 | SSG (21개) | `generateStaticParams` = `products.map(id)` |
| `/fortune/[id]/input/` | 정보 입력 | SSG + client | 폼 상태는 클라이언트 |
| `/heart/` | 하트 충전 | SSG | 진입 출처를 `sessionStorage`에 남겨 복귀 |
| `/result/[id]/` | 결과 | SSG shell + client | 입력값 없으면 상세로 리다이렉트 |
| `/my/box/` | 보관함 | client | `localStorage` 목록 |

신규 5개. 기존 3개(`/`, `/tests/[slug]`, `/login`)와 합쳐 8개.

---

## 3. 화면 정의

### ① 상품 상세 — `/fortune/[id]`

**목적** 카드에서 넘어온 기대를 구매 결심까지 끌고 간다. 지금 `href="#"`으로 끊긴 21개 카드의 착지점.

```text
SubHeader (뒤로 · 상품명)
─────────────────────────
HERO         톤 그라데이션 배경 + FortuneObject(140) float-soft
             + PixelDecoration 2~3개
             종류 라벨 · 상품명 · 한 줄 설명
─────────────────────────
META BAR     소요 2분 · 후기 1,204 · ★4.8      (FeatureBar 문법 재사용, 1행)
─────────────────────────
"이런 걸 알려드려요"   체크 리스트 3~5줄
─────────────────────────
PREVIEW.EXE  RetroWindow — 결과 일부를 가려서 보여준다
             하단 40%에 페이드 마스크 + "결제 후 전체 공개"
─────────────────────────
후기 3개      말풍선 카드 (닉네임 마스킹 · 별점 · 1~2줄)
─────────────────────────
같이 본 운세  MiniFortuneCard 가로 스크롤 (DragScroller 재사용)
─────────────────────────
유의사항      접힌 아코디언 1개
─────────────────────────
(하단 고정)  StickyCta — 하트 3 ♡  |  [이 운세 보기]
```

- Retro Window는 **PREVIEW 한 곳에만**. §7 남발 금지
- 하단 고정 CTA 때문에 `main`에 `pb-[84px]` 필요
- 스크롤로 히어로의 상품명이 화면 밖으로 나가면 `SubHeader` 제목을 상품명으로 교체 (IntersectionObserver, 페이드 150ms)

**필요 데이터** — `products.ts`에 `detail` 확장 (§5)

---

### ② 정보 입력 — `/fortune/[id]/input`

**목적** 사주 서비스의 실질. 지금 **폼 컴포넌트가 저장소에 하나도 없다** — 여기서 다 만든다.

상품마다 받아야 할 게 다르므로 `product.inputs`로 선언한다.

| `inputs` 값 | 받는 것 | 해당 상품 |
| --- | --- | --- |
| `self` | 이름·생년월일·태어난 시·성별·양음력 | 사주/자미두수 대부분 |
| `pair` | `self` + 상대 정보 한 벌 | 궁합·연애사주·이름 궁합 |
| `mbti` | MBTI 4지선다 (+ 궁합이면 상대 것도) | MBTI 계열 |
| `none` | 없음 — ②를 건너뛰고 바로 ③ | 오늘의 타로 등 |

```text
SubHeader (뒤로 · "정보 입력")
─────────────────────────
StepDots  ①입력 ─ ②확인 ─ ③결과      (현재 1/3)
─────────────────────────
"내 정보"  RetroWindow (tone = 상품 톤)
   이름          TextInput (선택 — 결과 문장에만 쓰임)
   생년월일       BirthDateField  년/월/일 select 3개
   양력/음력      SegmentedControl  (음력 선택 시 "윤달" 체크 노출)
   태어난 시      TimeField  12지시 select + [모름] 체크
   성별          SegmentedControl
─────────────────────────
"상대 정보"  (inputs=pair 일 때만) — 같은 구성, tone 한 단계 연하게
─────────────────────────
저장된 프로필 불러오기   칩 목록 (localStorage) + [이 정보 저장하기] 체크
─────────────────────────
(하단 고정)  StickyCta — [확인하기]  (미완이면 disabled)
```

- **날짜는 `<select>` 3개.** `<input type="date">`는 iOS/안드로이드 UI가 제각각이고 Y2K 톤과 충돌. select는 네이티브 휠이 떠서 모바일에서 가장 빠르다
- **"태어난 시 모름"을 반드시 제공.** 한국 사주 서비스 이탈 1순위 지점
- 검증은 **blur 시점**에만. 타이핑 중 빨간 에러 금지
- 에러는 필드 아래 13px 텍스트 + 보더 `--border-active` 색상 변경. 흔들림(shake) 애니메이션은 넣지 않는다(절제 톤)
- 제출 시 스크롤을 **첫 에러 필드로** 이동시키고 포커스

---

### ③ 결제 확인 — 하단 시트 (라우트 아님)

**목적** 하트를 쓰는 마지막 관문. 페이지 이동으로 만들면 입력값 유실 위험이 생겨 시트로 둔다.

```text
[dim]
┌──────────────────────────┐
│ CONFIRM.EXE       _ □ ×  │  ← RetroWindow, tone=lavender
├──────────────────────────┤
│ 나의 재물운               │
│ 1999.04.02 · 오시 · 여    │  ← 입력 요약 (수정 링크 = 시트 닫기)
│ ──────────────────────── │
│ 사용 하트          3 ♡    │
│ 보유 하트         12 ♡    │
│ 남는 하트          9 ♡    │
│                          │
│ [ 하트 3개 쓰고 보기 ]     │
│ 취소                      │
└──────────────────────────┘
```

**분기**

| 상태 | 처리 |
| --- | --- |
| 미로그인 | 시트 대신 "로그인이 필요해요" SystemDialog → `/login`, 복귀 지점 저장 |
| 하트 부족 | 잔액 줄을 강조색으로 + CTA를 `[하트 충전하기]`로 교체 → `/heart` |
| 정상 | 버튼 → 로딩 상태 → 하트 차감 → `/result/[id]`로 `replace` |

- `router.replace`를 쓴다. 뒤로 가서 결제 시트로 돌아오면 안 된다
- 결제 처리 중 시트는 닫히지 않고 CTA만 로딩(도트 3개 blink-dot). 최소 노출 600ms — 즉시 끝나면 뭘 눌렀는지 인지가 안 된다

---

### ④ 하트 충전 — `/heart`

```text
SubHeader (뒤로 · "하트 충전")
─────────────────────────
HEART.EXE   현재 잔액 크게 (MobileMenu의 하트 카드 재사용)
─────────────────────────
충전 패키지  2열 그리드 — 5 / 12 / 30 / 70 ♡
            보너스 있는 항목에 "+2 보너스" 태그
            선택 시 보더 --border-active
─────────────────────────
결제수단     카드 · 간편결제 (아이콘 행, 목업)
─────────────────────────
약관 동의    체크 1개
─────────────────────────
(하단 고정)  StickyCta — [12,000원 결제하기]
```

- 목데이터 단계에서 결제 버튼은 잔액만 증가시키고 Toast "충전 완료" 노출
- 구매 흐름 중 진입이면 완료 후 **원래 상품의 결제 시트를 다시 연 상태**로 복귀 (`sessionStorage.returnTo`)

---

### ⑤ 결과 — `/result/[id]`

**목적** 산 사람이 "샀길 잘했다"고 느끼는 지점. 스파인의 종착.

```text
SubHeader (뒤로=상세 · 상품명)
─────────────────────────
COVER       톤 그라데이션 + FortuneObject(120)
            "1999.04.02생 김소형님의 재물운"
            발급일 · FORTUNE ID 000123 (PixelLabel)
─────────────────────────
한 줄 요약   RetroWindow — 가장 큰 글씨. 여기만 읽어도 값을 한다
─────────────────────────
지표 3~4개   항목명 + 5칸 픽셀 게이지 (막대 대신 네모 5칸 = Y2K 문법)
─────────────────────────
본문 섹션 3~5개   소제목 + 3~5문장
─────────────────────────
행운 아이템  숫자 · 색 · 방향  (3열 미니 카드)
─────────────────────────
[ 결과 저장하기 ] [ 공유하기 ]
─────────────────────────
이어서 볼 운세  MiniFortuneCard 가로 스크롤
```

**인터랙션 — 순차 공개**
운세는 "열어보는" 맛이 핵심이라 여기만 모션을 허용한다. 단 절제 톤 안에서:

- 진입 시 스켈레톤 900ms → 섹션이 위에서부터 `fade-up`(8px, 220ms, 60ms stagger)
- 게이지는 채워지는 애니메이션 400ms `ease-out`, 섹션 등장 후 시작
- 타이핑 효과·프로그레스바·팝업창 **안 쓴다**
- ⚠️ `prefers-reduced-motion`이면 전역 규칙으로 0.01ms가 되어 그대로 보인다. **`opacity:0`을 인라인/JS로 걸지 말 것** — 애니메이션이 죽으면 영영 안 보인다. 시작 상태는 keyframe `from` 안에만 둔다

**직접 진입 방어** — 결과는 SSG라 URL만 알면 열린다.
`localStorage`에 해당 결과가 없으면 본문 대신 "아직 확인하지 않은 운세예요" + `[상세 보기]`.

**공유** — `navigator.share` 있으면 네이티브 시트, 없으면 링크 복사 + Toast.
공유 링크는 결과 본문이 아니라 **상품 상세**로 보낸다 (남의 사주를 URL로 열람시키지 않는다).

---

### ⑥ 보관함 — `/my/box`

```text
SubHeader (뒤로 · "보관함")
─────────────────────────
필터 칩      전체 / 사주 / 자미두수 / MBTI / 타로   (AllFortuneGrid 칩 재사용)
─────────────────────────
목록         2열 MiniFortuneCard + 발급일 배지
             탭 → /result/[id]
─────────────────────────
빈 상태      EmptyState — 오브젝트 + "아직 본 운세가 없어요" + [운세 보러가기]
```

- MobileMenu의 `보관함` 링크가 여기로 연결된다 (지금 `href="#"`)

---

## 4. 신규 컴포넌트

기존 것을 최대한 재사용하고, 정말 없는 것만 만든다.

### `src/components/ui/`

| 컴포넌트 | 용도 | 메모 |
| --- | --- | --- |
| `Field` | 라벨 + 도움말 + 에러 래퍼 | `htmlFor`/`aria-describedby` 배선을 여기서 끝낸다 |
| `TextInput` | 이름 등 | 높이 44px, `rounded-win`, 포커스 시 `--border-active` |
| `Select` | 네이티브 select 스킨 | 화살표는 `Icon` chevron-right 회전 |
| `SegmentedControl` | 성별 · 양음력 | `role="radiogroup"`, 칩 문법 재사용 |
| `BirthDateField` | 년/월/일 | 월에 따라 일 개수 보정 |
| `TimeField` | 12지시 + 모름 | 자시 23:30~01:29 … 라벨 병기 |
| `Checkbox` | 동의 · 저장 | |
| `Sheet` | 하단 시트 | **`createPortal` 필수** (헤더 `backdrop-blur` 함정) |
| `SystemDialog` | 알럿/확인 | RetroWindow 톤. `role="alertdialog"` |
| `Toast` | 짧은 알림 | 하단, 2.4s, 동시 1개 |
| `StickyCta` | 하단 고정 CTA 바 | `AppFrame` 폭(420) 안에 맞춰 `fixed` + `max-w` |
| `StepDots` | 진행 표시 | 3단계 |
| `Skeleton` | 로딩 자리 | 실버 톤 shimmer 없이 정지 블록 (절제) |
| `EmptyState` | 빈 목록 | 오브젝트 + 문구 + CTA |
| `Accordion` | 유의사항 · FAQ | height auto 전환 대신 grid-rows 트릭 |

### `src/lib/`

| 파일 | 역할 |
| --- | --- |
| `storage.ts` | `sessionStorage`/`localStorage` 접근 단일 창구 (SSR 가드 포함) |
| `purchase.ts` | 구매 진행 상태 머신 — 입력값 · 복귀 지점 · 결제 |
| `account.ts` | 로그인 여부 · 하트 잔액 · 프로필 목록 (지금 `MobileMenu` 상단 `account` 객체를 여기로 이동) |
| `mock-result.ts` | 상품 id + 생년월일 시드로 **항상 같은 결과**를 만드는 목데이터 생성기 |
| `motion.ts` | 신규 전환 곡선 상수 (`swipe.ts`와 같은 결) |

> `MobileMenu.tsx`의 하드코딩 `account`는 여러 화면이 잔액을 읽어야 하는 순간 깨진다.
> ③ 착수 전에 `lib/account.ts`로 먼저 뺀다.

### 기존 파일 수정

| 파일 | 변경 |
| --- | --- |
| `MiniFortuneCard.tsx` | `<a href="#">` → `<Link href={/fortune/${id}}>` |
| `FeaturedFortuneCard.tsx` | `Button` → `Link`로 감싸거나 `as` prop 추가 |
| `Button.tsx` | `href` 주면 `Link`로 렌더하는 분기 추가 (CTA가 링크인 경우가 많아짐) |
| `MobileMenu.tsx` | 보관함·결제내역·충전 링크 연결, `account` 분리 |
| `products.ts` | `detail` · `inputs` 필드 추가 |

---

## 5. 데이터 모델 확장

```ts
// products.ts
export type InputKind = "self" | "pair" | "mbti" | "none";

export interface FortuneProduct {
  // ... 기존 필드
  /** ② 입력 화면에서 무엇을 받는지 */
  inputs: InputKind;
  /** ① 상세 화면 콘텐츠 (없으면 공통 문구로 폴백) */
  detail?: {
    /** 히어로 한 줄 */
    tagline: string;
    /** "이런 걸 알려드려요" */
    bullets: string[];
    /** 미리보기 본문 (가려서 노출) */
    preview: string;
    /** 결과 본문 소제목 — 목데이터 생성기가 이 순서로 채운다 */
    sections: string[];
    minutes: number;
    rating: number;
    reviewCount: number;
  };
}
```

```ts
// mock-result.ts — 시드 기반. 같은 사람이 같은 상품을 다시 열면 같은 결과가 나와야 한다
export interface FortuneResult {
  id: string;          // `${productId}-${seedHash}`
  productId: string;
  createdAt: string;
  subject: { name?: string; birth: string; time?: string; gender: string };
  headline: string;                       // 한 줄 요약
  scores: { label: string; value: 1|2|3|4|5 }[];
  sections: { title: string; body: string }[];
  lucky: { number: number; color: string; direction: string };
}
```

---

## 6. 상태 매트릭스

| 상황 | 화면 | 처리 |
| --- | --- | --- |
| 없는 상품 id | ① | `notFound()` — `/tests/[slug]`와 동일 |
| 미로그인 + 결제 시도 | ③ | SystemDialog → `/login` → 복귀 |
| 하트 부족 | ③ | CTA를 충전으로 교체 → `/heart` → 시트 재오픈 |
| 필수 입력 누락 | ② | CTA disabled + 첫 에러로 스크롤·포커스 |
| 입력값 없이 결과 직접 진입 | ⑤ | 안내 + 상세로 유도 |
| 결과 생성 중 | ⑤ | Skeleton 900ms |
| 보관함 비어 있음 | ⑥ | EmptyState |
| storage 접근 불가(사파리 프라이빗) | 전역 | try/catch 후 메모리 폴백. 조용히 실패하지 말고 Toast 1회 |

---

## 7. 인터랙션 명세 (절제 톤)

**원칙** — 새 keyframe을 늘리지 않는다. 기존 곡선을 재사용해 조작감을 한 몸으로 유지한다.

| 대상 | 값 | 출처 |
| --- | --- | --- |
| 시트 등장/퇴장 | 340ms `cubic-bezier(0.22,1,0.36,1)` / 220ms `cubic-bezier(0.4,0,1,1)` | `menu-in/out`과 동일 — 나갈 때가 더 빠르다 |
| 패널·시트 내부 카드 | 260ms, translateY 10px, 50ms stagger | `.menu-item` — 한 덩어리로 들어오지 않게 |
| 딤 | 300ms `ease-out` / 240ms `ease-in` | `dim-in/out` 그대로 |
| 결과 섹션 등장 | 220ms, translateY 8px, stagger 60ms | 신규 `fade-up` |
| 게이지 채움 | 400ms `ease-out` | 신규 |
| 버튼/칩 hover·active | 150ms `colors` | `Button` 기존 값 |
| 카드 → 상세 이동 | 전환 애니메이션 **없음** | 절제 톤 |

**공통 규칙**

- 터치 타깃 44px 이상 (§17). StickyCta 버튼 높이 48px
- 시트/다이얼로그: `createPortal(document.body)` · ESC 닫기 · 배경 스크롤 잠금 · 포커스 트랩 · 닫으면 트리거로 포커스 복귀
- 스크롤 잠금 로직은 `MobileMenu`에서 `useScrollLock()`으로 추출해 공유
- 신규 모션 전부 `prefers-reduced-motion` 전역 규칙에 걸린다. **시작 상태를 JS로 걸지 말 것** (§⑤ 주의)
- 로딩 중 CTA는 `disabled` + `aria-busy`, 라벨은 유지하고 도트만 추가 (라벨이 바뀌면 버튼 폭이 튄다)

---

## 8. 접근성 체크리스트

- [ ] 모든 입력에 `<label>` 연결. placeholder를 라벨 대신 쓰지 않는다
- [ ] 에러는 `aria-describedby` + `aria-invalid`, 색만으로 전달하지 않는다
- [ ] `SegmentedControl`은 `role="radiogroup"` + 화살표 키 이동
- [ ] 시트/다이얼로그 `role="dialog"`·`aria-modal`·`aria-label`
- [ ] StickyCta가 마지막 콘텐츠를 가리지 않도록 `main`에 하단 패딩
- [ ] 결과 지표 게이지는 `aria-label="재물운 4/5"` 텍스트 병기 (§17 — 그래픽에 정보를 가두지 않는다)
- [ ] Toast는 `role="status"`
- [ ] 본문 14px 이상, `word-break: keep-all` 유지

---

## 9. 구현 순서

| 단계 | 내용 | 결과 |
| --- | --- | --- |
| M1 | `lib/storage·account`, `Button` 링크화, 상품 카드 링크 연결, **① 상세** | 21개 카드가 처음으로 어딘가로 간다 |
| M2 | 폼 프리미티브 6종 + **② 입력** | 사주 서비스의 실질이 생긴다 |
| M3 | `Sheet`·`SystemDialog`·`Toast` + **③ 결제 시트** + **④ 충전** | 하트 경제가 돈다 |
| M4 | `mock-result` + `Skeleton` + **⑤ 결과** | 스파인 관통 |
| M5 | **⑥ 보관함** + `EmptyState` + MobileMenu 링크 연결 | 재열람 · 회수 |

M1~M2 사이에 한 번 실기기 확인. 폼은 데스크톱 브라우저에서 멀쩡해 보여도 모바일에서 깨진다.

---

## 10. 미결 — 정해야 진행되는 것

1. **로그인 없이 어디까지?** ①②까지 열어두고 ③에서 막을지, ①부터 막을지.
   추천: ③에서 막기 — 입력까지 시킨 뒤 로그인 요구가 전환율이 높다
2. **결과 유효기간** 보관함 영구 보관인지, 재열람 시 하트를 다시 받는지
3. **"모르는 시간" 결과 품질** 시주를 모르면 풀이가 약해지는데, 결과에 그 사실을 표기할지
4. **가격 정합성** 현재 `hearts` 2~18 분포가 샘플. 충전 패키지 단가와 같이 정해야 함
5. **궁합 상대 정보** 개인정보 성격이 있다. 저장할지 1회성으로 버릴지
6. **후기 데이터** 목데이터로 지어낼지, 후기 영역을 M5 이후로 뺄지

---

## 11. 이번 범위 밖 (다음 기획)

C. 콘텐츠·지원 — 오늘의 메시지(`FORTUNE MESSAGE.EXE` 실제 화면) · 공지 · 이용안내 · FAQ · 후기 목록 · 쿠폰
B-잔여 — 결제내역 · 프로필 관리(다중 프로필) · 선물하기
D. 시스템 — 404 · 에러 · 약관 2종

`UtilityNav`·`Footer`의 `href="#"` 8개는 위 화면들이 만들어질 때 함께 연결한다.
