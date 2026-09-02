"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AppFrame, Padded } from "@/components/layout/AppFrame";
import { SubHeader } from "@/components/layout/SubHeader";
import { Footer } from "@/components/layout/Footer";
import { FortuneObject } from "@/components/fortune/FortuneObject";
import { Button, buttonClass } from "@/components/ui/Button";
import { DotLabel } from "@/components/y2k/DotLabel";
import { usePurchase } from "@/components/purchase/PurchaseProvider";
import { useClaimedGifts, decodeGift } from "@/lib/gift";
import { useHydrated } from "@/lib/store";
import { heroGradient, toneText } from "@/lib/tone";
import { findProduct } from "@/lib/products";

/**
 * 선물 받기.
 *
 * 링크에 담긴 코드에서 상품과 메시지를 꺼내 보여 주고,
 * `선물 받기`를 누르면 평소 구매 팝업이 그대로 열린다 — 하트만 쓰지 않는다.
 */
export function GiftReceive() {
  const params = useSearchParams();
  const code = params.get("code");
  const hydrated = useHydrated();
  const { claimed } = useClaimedGifts();
  const openPurchase = usePurchase();

  const gift = code ? decodeGift(code) : null;
  const product = gift ? findProduct(gift.p) : undefined;
  const alreadyClaimed = code ? claimed[code] : undefined;

  if (!gift || !product) {
    return (
      <Shell>
        <div className="py-16 text-center">
          <p className="dot-title text-[18px] text-ink">
            열 수 없는 선물이에요
          </p>
          <p className="mt-2 dot-text text-[14px] leading-[1.7] text-ink-soft">
            링크가 잘렸거나 잘못된 주소예요. 보낸 분에게 다시 받아 주세요.
          </p>
          <Link
            href="/"
            className={buttonClass({ variant: "primary", className: "mt-6 px-8" })}
          >
            홈으로 가기
          </Link>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <section
        className={`relative overflow-hidden border-b border-silver ${heroGradient[product.tone]} px-[var(--page-padding)] py-8 text-center`}
      >
        <DotLabel className={`text-[12px] ${toneText[product.tone]}`}>
          {gift.f ? `${gift.f}님이 보낸 선물` : "누군가 보낸 선물"}
        </DotLabel>

        <FortuneObject
          name={product.object}
          src={product.image}
          size={118}
          className="float-soft mx-auto mt-4"
        />

        <h2 className="mt-5 text-[23px] font-bold leading-[1.32] tracking-[-0.02em] text-ink">
          {product.name}
        </h2>
        <p className="mt-1.5 dot-text text-[13px] text-ink-soft">
          {product.type} · 하트를 쓰지 않고 볼 수 있어요
        </p>
      </section>

      <Padded className="pb-8 pt-6">
        {gift.m ? (
          <blockquote className="rounded-win border border-line bg-white px-4 py-4 text-center">
            <p className="dot-text text-[15px] leading-[1.75] text-ink">
              “{gift.m}”
            </p>
            {gift.f ? (
              <footer className="mt-2 dot-text text-[13px] text-ink-faint">
                — {gift.f}
              </footer>
            ) : null}
          </blockquote>
        ) : null}

        {!hydrated ? (
          <div className="mt-6 h-[52px] rounded-win border border-line bg-white" />
        ) : alreadyClaimed ? (
          <div className="mt-6">
            <p className="rounded-win border border-line bg-page-pink px-3.5 py-3 text-center dot-text text-[13px] leading-[1.7] text-ink">
              이미 받은 선물이에요. 결과는 보관함에 저장돼 있어요.
            </p>
            <Link
              href={`/result/?id=${alreadyClaimed}`}
              className={buttonClass({ variant: "primary", className: "mt-3 w-full" })}
            >
              결과 보러 가기
            </Link>
          </div>
        ) : (
          <>
            <Button
              variant="primary"
              size="cta"
              className="mt-6 w-full"
              onClick={() =>
                openPurchase(product, {
                  code: code ?? "",
                  message: gift.m,
                  from: gift.f,
                })
              }
            >
              선물 받기
            </Button>
            <p className="mt-3 text-center dot-text text-[12px] leading-[1.7] text-ink-faint">
              사주정보를 넣으면 바로 결과가 만들어져요. 한 번만 사용할 수 있어요.
            </p>
          </>
        )}
      </Padded>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <AppFrame>
      <SubHeader title="선물 받기" />
      <main className="flex-1">{children}</main>
      <Footer />
    </AppFrame>
  );
}
