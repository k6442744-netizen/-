"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { HeartCoin } from "@/components/ui/HeartCoin";
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
          <button
            type="button"
            onClick={() => setCheckout(true)}
            className="flex min-h-[52px] w-full items-center justify-center rounded-win border border-[#ff8ec7] bg-white text-[16px] font-bold text-brand-pink transition-colors hover:bg-page-pink active:bg-[#ffdcee]"
          >
            {pack.name} 결제하기
          </button>
        }
      >
        <div className="rounded-win border border-line bg-white px-4 py-4 text-center">
          <p className="dot-text text-[13px] text-silver-mid">
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
      </Modal>

      <PgCheckoutModal
        open={open && checkout}
        onClose={() => setCheckout(false)}
        orderName={`${pack.name} (하트 ${pack.hearts}개)`}
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
