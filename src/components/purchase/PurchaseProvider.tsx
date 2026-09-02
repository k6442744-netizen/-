"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { PurchaseDialog } from "./PurchaseDialog";
import { useSession } from "@/lib/session";
import { KEY, useStore } from "@/lib/store";
import { findProduct, type FortuneProduct } from "@/lib/products";

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
  const [round, setRound] = useState(0);

  const { session } = useSession();
  /* 로그인하러 가기 전에 무엇을 사려던 참이었는지 적어 둔다 */
  const [pendingId, setPendingId] = useStore<string | null>(
    KEY.pendingPurchase,
    null,
  );
  const router = useRouter();
  const pathname = usePathname();

  const openPurchase = useCallback<OpenPurchase>(
    (next, nextGift) => {
      /* 선물로 받은 운세는 받는 사람이 회원이 아닐 수 있어 로그인을 요구하지 않는다 */
      if (!session && !nextGift) {
        setPendingId(next.id);
        router.push(`/login/?next=${encodeURIComponent(pathname)}`);
        return;
      }
      setProduct(next);
      setGift(nextGift);
      setOpen(true);
      setRound((n) => n + 1);
    },
    [session, pathname, router, setPendingId],
  );

  const value = useMemo(() => openPurchase, [openPurchase]);

  /* 로그인을 마치고 돌아왔으면 하던 구매를 그대로 이어 간다 */
  const resumed = session && pendingId ? findProduct(pendingId) : undefined;
  const shown = resumed ?? product;
  const isOpen = Boolean(resumed) || open;

  const close = () => {
    setOpen(false);
    if (pendingId) setPendingId(null);
  };

  return (
    <PurchaseContext.Provider value={value}>
      {children}
      {/* 닫힘 애니메이션 동안 내용이 필요해서 product 는 그대로 둔다 */}
      {shown ? (
        <PurchaseDialog
          key={resumed ? `resume-${resumed.id}` : round}
          product={shown}
          gift={resumed ? undefined : gift}
          open={isOpen}
          onClose={close}
        />
      ) : null}
    </PurchaseContext.Provider>
  );
}
