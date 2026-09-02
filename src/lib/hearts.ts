/**
 * 하트 충전 상품 — 실제 결제 연동 시 상품코드와 함께 교체.
 *
 * 이름은 하트를 담는 그릇으로 위계를 만든다.
 * 수량(5·12·30·60)만 적혀 있으면 어느 걸 골라야 할지 감이 오지 않는데,
 * 줌 → 파우치 → 보석함 → 보물상자로 크기가 바로 읽힌다.
 */
export const heartPackages = [
  { hearts: 5, price: 990, name: "하트 한 줌" },
  { hearts: 12, price: 2200, name: "하트 파우치", badge: "인기" },
  { hearts: 30, price: 4900, name: "하트 보석함" },
  { hearts: 60, price: 9900, name: "하트 보물상자", badge: "최대 혜택" },
] as const;

export type HeartPackage = (typeof heartPackages)[number];
