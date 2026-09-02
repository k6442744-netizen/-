"use client";

import { useState } from "react";
import Link from "next/link";
import { FortuneObject } from "@/components/fortune/FortuneObject";
import { HeartCoin } from "@/components/ui/HeartCoin";
import { Icon } from "@/components/ui/Icon";
import { buttonClass } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { DotLabel } from "@/components/y2k/DotLabel";
import { HeartChargeModal } from "@/components/purchase/HeartChargeModal";
import { useHearts } from "@/lib/ledger";
import { useHydrated } from "@/lib/store";
import { encodeGift, giftUrl } from "@/lib/gift";
import { paleBg, toneText } from "@/lib/tone";
import { products } from "@/lib/products";

const MESSAGE_MAX = 40;

/**
 * 선물 보내기.
 *
 * 상품을 고르고 내 하트로 값을 치른 뒤, 받는 사람에게 보낼 링크를 만든다.
 * 링크 안에 상품과 메시지가 담겨 있어 받는 사람은 로그인 없이 바로 열 수 있다.
 */
export function GiftComposer() {
  const hydrated = useHydrated();
  const { hearts, spend } = useHearts();
  const toast = useToast();

  const [pickedId, setPickedId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [sender, setSender] = useState("");
  const [charge, setCharge] = useState(false);
  /** 결제까지 끝나면 만들어지는 선물 링크 */
  const [link, setLink] = useState<string | null>(null);

  const picked = products.find((p) => p.id === pickedId) ?? null;
  const enough = picked ? hearts >= picked.hearts : false;

  const send = () => {
    if (!picked) return;
    if (!enough) {
      setCharge(true);
      return;
    }

    const paid = spend({
      hearts: picked.hearts,
      productId: picked.id,
      gift: true,
    });
    if (!paid) {
      setCharge(true);
      return;
    }

    const code = encodeGift({
      p: picked.id,
      m: message.trim() || undefined,
      f: sender.trim() || undefined,
      t: Date.now(),
    });
    setLink(giftUrl(code));
  };

  const copy = async () => {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      toast("선물 링크를 복사했어요");
    } catch {
      /* 클립보드가 막힌 브라우저에서는 직접 선택해서 복사하도록 둔다 */
      toast("링크를 길게 눌러 복사해 주세요");
    }
  };

  const share = async () => {
    if (!link || !navigator.share) return copy();
    try {
      await navigator.share({
        title: `${picked?.name} 선물`,
        text: "운세를 선물했어요. 링크에서 확인해 보세요!",
        url: link,
      });
    } catch {
      /* 사용자가 공유를 닫은 경우 — 아무것도 하지 않는다 */
    }
  };

  /* --- 보내고 난 뒤 --- */
  if (link && picked) {
    return (
      <div className="text-center">
        <FortuneObject
          name={picked.object}
          src={picked.image}
          size={110}
          className="float-soft mx-auto"
        />
        <h2 className="mt-6 dot-title text-[20px] text-ink">
          선물을 준비했어요
        </h2>
        <p className="mt-2 dot-text text-[14px] leading-[1.7] text-ink-soft">
          아래 링크를 보내면 받는 분이 바로 열어볼 수 있어요.
          <br />
          받는 분은 자기 사주정보만 넣으면 됩니다.
        </p>

        <p className="mt-5 break-all rounded-win border border-line bg-white px-3.5 py-3 text-left dot-text text-[12px] leading-[1.6] text-ink-soft">
          {link}
        </p>

        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={copy}
            className={buttonClass({ tone: "neutral", className: "flex-1" })}
          >
            링크 복사
          </button>
          <button
            type="button"
            onClick={share}
            className={buttonClass({ className: "flex-1" })}
          >
            공유하기
          </button>
        </div>

        <div className="mt-6 flex gap-2">
          <button
            type="button"
            onClick={() => {
              setLink(null);
              setPickedId(null);
              setMessage("");
            }}
            className={buttonClass({ tone: "neutral", className: "flex-1" })}
          >
            또 선물하기
          </button>
          <Link
            href="/"
            className={buttonClass({ tone: "neutral", className: "flex-1" })}
          >
            홈으로
          </Link>
        </div>
      </div>
    );
  }

  /* --- 고르는 중 --- */
  return (
    <>
      <p className="text-[13px] font-semibold text-ink">선물할 운세</p>
      <ul className="mt-2 max-h-[326px] space-y-2 overflow-y-auto overscroll-contain">
        {products.map((product) => {
          const active = product.id === pickedId;
          return (
            <li key={product.id}>
              <label
                className={`flex cursor-pointer items-center gap-3 rounded-win border p-2.5 transition-colors ${
                  active
                    ? "border-brand-pink bg-page-pink"
                    : "border-line bg-white hover:bg-hover"
                }`}
              >
                <input
                  type="radio"
                  name="gift-product"
                  value={product.id}
                  checked={active}
                  onChange={() => setPickedId(product.id)}
                  className="size-[18px] shrink-0 accent-[color:var(--pink-primary)]"
                />
                <span
                  className={`flex size-12 shrink-0 items-center justify-center rounded-win ${paleBg[product.tone]}`}
                >
                  <FortuneObject
                    name={product.object}
                    src={product.image}
                    size={40}
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <DotLabel className={`text-[11px] ${toneText[product.tone]}`}>
                    {product.type}
                  </DotLabel>
                  <span className="mt-0.5 block truncate text-[14px] font-bold text-ink">
                    {product.name}
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-1">
                  <span className="dot-text text-[14px] font-bold leading-none text-heart">
                    {product.hearts}
                  </span>
                  <HeartCoin size={13} />
                </span>
              </label>
            </li>
          );
        })}
      </ul>

      <div className="mt-5">
        <label
          htmlFor="gift-sender"
          className="mb-1.5 block text-[13px] font-semibold text-ink"
        >
          보내는 사람 <span className="font-normal text-silver-mid">(선택)</span>
        </label>
        <input
          id="gift-sender"
          value={sender}
          onChange={(e) => setSender(e.target.value)}
          maxLength={12}
          placeholder="이름을 적으면 받는 분에게 보여요"
          className="min-h-[46px] w-full rounded-win border border-line bg-white px-3 text-[15px] text-ink outline-none transition-colors placeholder:text-silver-mid focus:border-brand-pink"
        />
      </div>

      <div className="mt-4">
        <label
          htmlFor="gift-message"
          className="mb-1.5 block text-[13px] font-semibold text-ink"
        >
          한마디 <span className="font-normal text-silver-mid">(선택)</span>
        </label>
        <textarea
          id="gift-message"
          value={message}
          onChange={(e) => setMessage(e.target.value.slice(0, MESSAGE_MAX))}
          rows={2}
          placeholder="올해도 좋은 일만 가득하길!"
          className="w-full resize-none rounded-win border border-line bg-white px-3 py-2.5 text-[15px] leading-[1.6] text-ink outline-none transition-colors placeholder:text-silver-mid focus:border-brand-pink"
        />
        <p className="mt-1 text-right dot-text text-[12px] text-silver-mid">
          {message.length} / {MESSAGE_MAX}
        </p>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-silver pt-4">
        <span className="dot-text text-[13px] text-ink-soft">보유 하트</span>
        <span className="flex items-center gap-1.5">
          <span
            className={`dot-text text-[15px] font-bold leading-none ${
              picked && !enough ? "text-brand-pink" : "text-ink-soft"
            }`}
          >
            {hydrated ? hearts : "—"}
          </span>
          <HeartCoin size={14} />
        </span>
      </div>

      <button
        type="button"
        disabled={!picked}
        onClick={send}
        className="mt-4 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-win border border-[#ff8ec7] bg-white text-[16px] font-bold text-brand-pink transition-colors hover:bg-page-pink active:bg-[#ffdcee] disabled:cursor-not-allowed disabled:border-line disabled:bg-silver disabled:text-silver-mid"
      >
        {!picked ? (
          "선물할 운세를 골라 주세요"
        ) : enough ? (
          <>
            <span className="dot-text text-[17px] leading-none">
              {picked.hearts}
            </span>
            <HeartCoin size={17} />
            <span>하트로 선물하기</span>
          </>
        ) : (
          "하트 충전하기"
        )}
      </button>

      <p className="mt-3 flex items-start gap-1.5 dot-text text-[12px] leading-[1.7] text-silver-mid">
        <Icon name="notice" size={14} className="mt-0.5 shrink-0" />
        받는 분이 링크를 열어 사주정보를 넣으면 결과가 만들어져요. 링크는 한
        번만 사용할 수 있어요.
      </p>

      <HeartChargeModal open={charge} onClose={() => setCharge(false)} />
    </>
  );
}
