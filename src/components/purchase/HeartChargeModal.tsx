"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { HeartCoin } from "@/components/ui/HeartCoin";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { HeartPackageList } from "./HeartPackageList";
import { PgCheckoutModal } from "./PgCheckoutModal";
import { useHearts } from "@/lib/ledger";
import { heartPackages } from "@/lib/hearts";

/**
 * 하트 충전 팝업 (마이페이지).
 *
 * 구매 도중의 충전은 결제 팝업 안 단계에서 처리하고,
 * 여기서는 살 상품 없이 잔액만 채우는 경우를 다룬다.
 */
export function HeartChargeModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { hearts, charge } = useHearts();
  const toast = useToast();
  const [picked, setPicked] = useState<number>(heartPackages[1].hearts);
  const [checkout, setCheckout] = useState(false);

  const pack =
    heartPackages.find((p) => p.hearts === picked) ?? heartPackages[0];

  return (
    <>
      <Modal
        open={open && !checkout}
        onClose={onClose}
        title="하트 충전"
        subtitle="충전한 하트로 운세를 볼 수 있어요"
        footer={
          <Button
            variant="primary"
            size="cta"
            className="w-full"
            onClick={() => setCheckout(true)}
          >
            결제하기
          </Button>
        }
      >
        <div className="rounded-win border border-line bg-white px-4 py-4 text-center">
          <p className="dot-text text-[13px] text-ink-faint">
            지금 보유한 하트
          </p>
          <p className="mt-1.5 flex items-center justify-center gap-2">
            <span className="dot-title text-[34px] leading-none text-heart">
              {hearts}
            </span>
            <HeartCoin size={30} />
          </p>
        </div>

        <p className="mb-2 mt-5 text-[13px] font-semibold text-ink">
          충전할 하트
        </p>
        <HeartPackageList selected={picked} onSelect={setPicked} />

        {/* 결제 유의사항 — 환불 기준은 결제 전에 보이는 자리에 둔다 */}
        <section className="mt-5 rounded-win border border-line bg-silver px-3.5 py-3">
          <h3 className="text-[13px] font-semibold text-ink">결제 전 확인해 주세요</h3>
          <ul className="mt-2 space-y-1.5">
            {[
              "충전한 하트는 유효기간 없이 쓸 수 있어요.",
              "한 번도 쓰지 않은 하트는 결제일로부터 7일 안에 전액 환불돼요.",
              "일부를 썼다면 남은 하트만 환불됩니다.",
              "결제 내역과 영수증은 마이페이지 하트 내역에서 볼 수 있어요.",
            ].map((line) => (
              <li
                key={line}
                className="flex gap-1.5 dot-text text-[12px] leading-[1.7] text-ink-soft"
              >
                <span aria-hidden="true" className="text-ink-faint">
                  ·
                </span>
                {line}
              </li>
            ))}
          </ul>
        </section>
      </Modal>

      <PgCheckoutModal
        open={open && checkout}
        onClose={() => setCheckout(false)}
        orderName={pack.name}
        orderDetail={`하트 ${pack.hearts}개`}
        amount={pack.price}
        onSuccess={(paymentId) => {
          charge({
            hearts: pack.hearts,
            price: pack.price,
            packageName: pack.name,
            paymentId,
          });
          setCheckout(false);
          /* 충전만 하러 들어온 자리라 알림만 남기고 팝업은 내린다 */
          onClose();
          toast(
            <>
              {pack.name} 충전 완료 · 하트 {pack.hearts}개
              <HeartCoin size={15} />
            </>,
          );
        }}
      />
    </>
  );
}
