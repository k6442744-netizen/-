/**
 * 결제(PG) 연동 지점.
 *
 * 화면은 결제창을 띄우고 결과만 기다리도록 만들어 두었다.
 * 실제 PG를 붙일 때는 `requestPayment` 한 곳만 교체하면 된다.
 */

export type PayMethodId = "card" | "kakaopay" | "naverpay" | "tosspay";

export const payMethods: { id: PayMethodId; label: string; hint?: string }[] = [
  { id: "card", label: "신용·체크카드" },
  { id: "kakaopay", label: "카카오페이" },
  { id: "naverpay", label: "네이버페이" },
  { id: "tosspay", label: "토스페이" },
];

export interface PaymentRequest {
  /** 결제창에 보이는 주문명 (예: `하트 12개`) */
  orderName: string;
  /** 원화 결제 금액 */
  amount: number;
  method: PayMethodId;
}

export interface PaymentResult {
  ok: boolean;
  /** 승인 번호 — 결제내역에 남길 값 */
  paymentId?: string;
  message?: string;
}

/** 승인까지 기다리는 시간 (연동 전 목업) */
const MOCK_APPROVAL_MS = 1400;

/**
 * 결제 요청.
 *
 * TODO: 실제 PG SDK 호출로 교체
 *   예) await tossPayments.requestPayment(method, { orderId, orderName, amount, ... })
 * 지금은 연동 전이라 승인 시간을 흉내 낸 뒤 성공으로 돌려준다.
 */
export async function requestPayment(
  request: PaymentRequest,
): Promise<PaymentResult> {
  await new Promise((resolve) => {
    setTimeout(resolve, MOCK_APPROVAL_MS);
  });

  return {
    ok: true,
    paymentId: `mock_${request.amount}_${Date.now().toString(36)}`,
  };
}
