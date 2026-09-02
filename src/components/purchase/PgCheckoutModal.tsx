"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { cardMark, payMethodLogo } from "./payMethodLogos";
import { payMethods, requestPayment, type PayMethodId } from "@/lib/payment";

/**
 * 결제창.
 *
 * 실제 PG 창이 뜨는 자리다 — 주문 내용을 확인하고 결제수단을 고른 뒤
 * 승인 결과를 기다린다. 승인 중에는 닫지 못하게 막는다.
 */
export function PgCheckoutModal({
  open,
  onClose,
  orderName,
  orderDetail,
  amount,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  /** 상품 이름 — 결제 버튼에 그대로 들어간다 */
  orderName: string;
  /** 상품 이름만으로 부족할 때 덧붙이는 설명 (수량 등) */
  orderDetail?: string;
  amount: number;
  onSuccess: (paymentId: string) => void;
}) {
  const [method, setMethod] = useState<PayMethodId>("card");
  const [paying, setPaying] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [failed, setFailed] = useState<string | null>(null);

  const pay = async () => {
    setFailed(null);
    setPaying(true);
    const result = await requestPayment({ orderName, amount, method });
    setPaying(false);

    if (!result.ok || !result.paymentId) {
      setFailed(result.message ?? "결제가 완료되지 않았어요. 다시 시도해 주세요.");
      return;
    }
    onSuccess(result.paymentId);
  };

  return (
    <Modal
      open={open}
      /* 승인 중에 닫으면 결제 상태를 알 수 없게 된다 */
      onClose={paying ? () => {} : onClose}
      title="결제"
      subtitle="결제수단을 선택해 주세요"
      footer={
        <Button
          variant="primary"
          size="cta"
          disabled={paying || !agreed}
          onClick={pay}
          className="w-full"
        >
          {paying
            ? "결제 승인 중…"
            : agreed
              ? `${orderName} 결제하기`
              : "결제 동의 후 진행할 수 있어요"}
        </Button>
      }
    >
      <dl className="rounded-win border border-line bg-white px-3.5 py-3">
        <div className="flex items-center justify-between">
          <dt className="dot-text text-[13px] text-ink-soft">주문 내용</dt>
          <dd className="text-right text-[14px] font-semibold text-ink">
            {orderName}
            {orderDetail ? (
              <span className="ml-1 dot-text font-normal text-ink-soft">
                {orderDetail}
              </span>
            ) : null}
          </dd>
        </div>
        <div className="mt-2 flex items-center justify-between border-t border-silver pt-2">
          <dt className="dot-text text-[13px] text-ink-soft">결제 금액</dt>
          <dd className="text-[16px] font-bold text-ink">
            {amount.toLocaleString()}원
          </dd>
        </div>
      </dl>

      <fieldset className="mt-4" disabled={paying}>
        <legend className="mb-2 text-[13px] font-semibold text-ink">
          결제수단
        </legend>
        <div className="space-y-2">
          {payMethods.map((item) => {
            const active = item.id === method;
            return (
              <label
                key={item.id}
                className={`flex min-h-[54px] cursor-pointer items-center gap-3.5 rounded-win border px-3.5 transition-colors ${
                  active
                    ? "border-brand-pink bg-page-pink"
                    : "border-line bg-white hover:bg-hover"
                }`}
              >
                <input
                  type="radio"
                  name="pay-method"
                  value={item.id}
                  checked={active}
                  onChange={() => setMethod(item.id)}
                  className="size-[18px] shrink-0 accent-[color:var(--pink-primary)]"
                />
                {/* 공식 로고가 있으면 로고만 — 브랜드명이 이미 로고 안에 들어 있다 */}
                {payMethodLogo(item.id, item.label) ?? (
                  <>
                    {cardMark()}
                    <span
                      className={`text-[15px] font-semibold ${active ? "text-ink" : "text-ink-soft"}`}
                    >
                      {item.label}
                    </span>
                  </>
                )}
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* 결제 전 동의 — 체크해야 결제 버튼이 열린다 */}
      <label className="mt-4 flex cursor-pointer items-start gap-2.5">
        <input
          type="checkbox"
          checked={agreed}
          disabled={paying}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-0.5 size-[18px] shrink-0 accent-[color:var(--pink-primary)]"
        />
        <span className="dot-text text-[13px] leading-[1.65] text-ink-soft">
          위 주문 내용을 확인하였으며, 회원 본인은 이용약관, 개인정보 이용 및
          제공(해외 카드결제의 경우 국외제공), 결제에 동의합니다.
        </span>
      </label>

      <div aria-live="polite">
        {paying ? (
          <div className="mt-4">
            <div
              aria-hidden="true"
              className="h-1.5 w-full overflow-hidden rounded-full bg-silver"
            >
              <span className="loading-sweep block h-full w-1/3 rounded-full bg-brand-pink-soft" />
            </div>
            <p className="mt-2 text-center dot-text text-[13px] text-ink-soft">
              결제사에 승인을 요청하고 있어요. 창을 닫지 마세요.
            </p>
          </div>
        ) : null}

        {failed ? (
          <p className="mt-4 rounded-win border border-[#ff8ec7] bg-page-pink px-3 py-2.5 dot-text text-[13px] leading-[1.6] text-ink">
            {failed}
          </p>
        ) : null}
      </div>

      <p className="mt-4 dot-text text-[12px] leading-[1.7] text-ink-faint">
        지금은 PG 연동 전이라 실제 결제는 일어나지 않습니다.
      </p>
    </Modal>
  );
}
