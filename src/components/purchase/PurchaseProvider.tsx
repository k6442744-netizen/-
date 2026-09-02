"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { PurchaseDialog } from "./PurchaseDialog";
import type { FortuneProduct } from "@/lib/products";

/** 선물로 열 때 붙는 정보 — 하트를 깎지 않고 받은 표시를 남긴다 */
export interface GiftClaim {
  code: string;
  message?: string;
  from?: string;
}

type OpenPurchase = (product: FortuneProduct, gift?: GiftClaim) => void;

const PurchaseContext = createContext<OpenPurchase | null>(null);

/** 상품 카드에서 구매 팝업을 여는 훅 */
export function usePurchase() {
  const open = useContext(PurchaseContext);
  if (!open) {
    throw new Error("usePurchase 는 PurchaseProvider 안에서만 쓸 수 있어요.");
  }
  return open;
}

/**
 * 구매 팝업을 화면당 하나만 띄우는 provider.
 * 카드마다 팝업을 들고 있지 않도록 `AppFrame` 이 한 번만 감싼다.
 */
export function PurchaseProvider({ children }: { children: ReactNode }) {
  const [product, setProduct] = useState<FortuneProduct | null>(null);
  const [gift, setGift] = useState<GiftClaim | undefined>(undefined);
  const [open, setOpen] = useState(false);
  /* 열 때마다 팝업을 새로 만들어 이전 단계가 남지 않게 한다 */
  const [session, setSession] = useState(0);

  const openPurchase = useCallback<OpenPurchase>((next, nextGift) => {
    setProduct(next);
    setGift(nextGift);
    setOpen(true);
    setSession((s) => s + 1);
  }, []);

  const value = useMemo(() => openPurchase, [openPurchase]);

  return (
    <PurchaseContext.Provider value={value}>
      {children}
      {/* 닫힘 애니메이션 동안 내용이 필요해서 product 는 그대로 둔다 */}
      {product ? (
        <PurchaseDialog
          key={session}
          product={product}
          gift={gift}
          open={open}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </PurchaseContext.Provider>
  );
}
