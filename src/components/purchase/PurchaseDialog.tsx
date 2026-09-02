"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import { HeartCoin } from "@/components/ui/HeartCoin";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { CoupleSlots } from "./CoupleSlots";
import { HeartPackageList } from "./HeartPackageList";
import { PgCheckoutModal } from "./PgCheckoutModal";
import type { GiftClaim } from "./PurchaseProvider";
import { ProfileList } from "./ProfileList";
import { ProfileForm } from "./ProfileForm";
import { useArchive } from "@/lib/archive";
import { useProfiles } from "@/lib/account";
import { useHearts } from "@/lib/ledger";
import { useClaimedGifts } from "@/lib/gift";
import { heartPackages } from "@/lib/hearts";
import { relationAvatar } from "@/lib/tone";
import {
  describeProfile,
  type ProfileDraft,
  type SajuProfile,
} from "@/lib/profiles";
import { peopleOf, type FortuneProduct } from "@/lib/products";

/** 두 명이 필요한 상품은 자리마다 역할을 붙여 준다 */
const slotLabels = (need: number) =>
  need === 2 ? ["내 사주정보", "상대방 사주정보"] : ["사주정보"];
/** 자리 카드 위에 붙는 짧은 라벨 */
const slotCaptions = ["나", "상대"];

type Step =
  | { kind: "pick" }
  | { kind: "form" }
  | { kind: "pay" }
  | { kind: "charge" };

/**
 * 상품을 누르면 뜨는 구매 팝업.
 *
 * 화면을 옮기지 않고 팝업 안에서 단계만 바꾼다 — 사주정보 선택 → (필요하면 추가) → 결제.
 * 한 명이면 목록에서 고르는 순간 결제로 넘어가고,
 * 궁합처럼 두 명이면 두 자리를 한 화면에서 채운 뒤 넘어간다.
 */
export function PurchaseDialog({
  product,
  gift,
  open,
  onClose,
}: {
  product: FortuneProduct;
  /** 선물로 받은 운세면 하트를 쓰지 않는다 */
  gift?: GiftClaim;
  open: boolean;
  onClose: () => void;
}) {
  const need = peopleOf(product);
  const couple = need === 2;
  const labels = slotLabels(need);
  const { profiles, defaultId, addProfile, touchProfile } = useProfiles();
  const { hearts, spend, charge } = useHearts();
  const { addEntry, removeEntry } = useArchive();
  const router = useRouter();
  const toast = useToast();
  const { claim } = useClaimedGifts();

  const [step, setStep] = useState<Step>({ kind: "pick" });
  const [picked, setPicked] = useState<(string | null)[]>(() =>
    Array(need).fill(null),
  );
  /** 다음에 고른 사람이 들어갈 자리 */
  const [activeSlot, setActiveSlot] = useState(0);
  /** 충전 단계에서 고른 상품 (고르지 않았으면 모자란 만큼 채우는 것으로 제안) */
  const [chargePick, setChargePick] = useState<number | null>(null);
  /** 결제창이 떠 있는 동안에는 이 팝업을 내린다 */
  const [checkout, setCheckout] = useState(false);

  /* 선물로 받은 운세는 값을 치를 필요가 없다 */
  const enough = Boolean(gift) || hearts >= product.hearts;
  const short = gift ? 0 : Math.max(0, product.hearts - hearts);

  const filled = picked.map((id) => profiles.find((p) => p.id === id) ?? null);
  const ready = filled.every(Boolean);

  /** 활성 자리를 채우고, 아직 빈 자리가 있으면 그리로 옮겨 간다 */
  const pickInto = (id: string) => {
    const next = picked.map((cur, i) => (i === activeSlot ? id : cur));
    setPicked(next);
    touchProfile(id);

    if (!couple) {
      setStep({ kind: "pay" });
      return;
    }
    const empty = next.findIndex((v) => !v);
    if (empty >= 0) setActiveSlot(empty);
  };

  const handleCreate = (draft: ProfileDraft) => {
    const created = addProfile(draft);
    if (couple) setStep({ kind: "pick" });
    pickInto(created.id);
  };

  const handlePay = () => {
    const people = filled.filter((p): p is SajuProfile => Boolean(p));
    if (people.length !== need) return;

    /* 결과를 먼저 만들고, 그 기록을 가리키며 하트를 깎는다.
       잔액은 늘 저장소의 최신 원장으로 다시 계산하므로
       다른 탭에서 먼저 써 버렸으면 여기서 걸러진다 */
    const entry = addEntry({
      productId: product.id,
      hearts: gift ? 0 : product.hearts,
      people,
    });

    if (gift) {
      /* 같은 선물을 두 번 열지 못하게 받은 표시를 남긴다 */
      claim(gift.code, entry.id);
    } else {
      const paid = spend({
        hearts: product.hearts,
        productId: product.id,
        archiveId: entry.id,
      });
      if (!paid) {
        removeEntry(entry.id);
        setStep({ kind: "charge" });
        return;
      }
    }

    onClose();
    router.push(`/result/?id=${entry.id}&new=1`);
  };

  /* 모자란 만큼을 덮는 가장 작은 상품을 미리 골라 둔다 */
  const suggested =
    heartPackages.find((p) => p.hearts >= short) ??
    heartPackages[heartPackages.length - 1];
  const chargeHearts = chargePick ?? suggested.hearts;
  const chargePack =
    heartPackages.find((p) => p.hearts === chargeHearts) ?? suggested;

  const handleCharged = (paymentId: string) => {
    charge({
      hearts: chargePack.hearts,
      price: chargePack.price,
      packageName: chargePack.name,
      paymentId,
    });
    setCheckout(false);
    /* 운세를 보러 들어온 흐름이라 팝업은 닫지 않고 결제 확인으로 되돌린다 */
    setStep({ kind: "pay" });
    toast(
      <>
        {chargePack.name} 충전 완료 · 하트 {chargePack.hearts}개
        <HeartCoin size={15} />
      </>,
    );
  };

  const title =
    step.kind === "form"
      ? "사주정보 입력"
      : step.kind === "charge"
        ? "하트 충전"
        : product.name;

  const subtitle =
    step.kind === "pick"
      ? couple
        ? "두 사람의 사주정보를 골라 주세요"
        : "어떤 분의 운세를 볼까요?"
      : step.kind === "form"
        ? "태어난 시와 음/양력까지 맞아야 정확해요"
        : step.kind === "charge"
          ? "충전하면 바로 이어서 볼 수 있어요"
          : "이 내용으로 운세를 열어 드릴게요";

  /* 뒤로가기 — 첫 화면에서는 붙이지 않는다 */
  const onBack =
    step.kind === "form" && profiles.length > 0
      ? () => setStep({ kind: "pick" })
      : step.kind === "pay"
        ? () => setStep({ kind: "pick" })
        : step.kind === "charge"
          ? () => setStep({ kind: "pay" })
          : undefined;

  return (
    <>
    <Modal
      open={open && !checkout}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      onBack={onBack}
      footer={
        step.kind === "charge" ? (
          <Button
            variant="primary"
            size="cta"
            className="w-full"
            onClick={() => setCheckout(true)}
          >
            결제하기
          </Button>
        ) : step.kind === "pick" && couple ? (
          <Button
            variant="primary"
            size="cta"
            disabled={!ready}
            className="w-full"
            onClick={() => setStep({ kind: "pay" })}
          >
            {ready ? "궁합 운세 보기" : "두 사람을 모두 골라 주세요"}
          </Button>
        ) : undefined
      }
    >
      {step.kind === "pick" ? (
        <>
          {couple ? (
            <>
              <CoupleSlots
                filled={filled}
                captions={slotCaptions}
                activeSlot={activeSlot}
                onFocusSlot={setActiveSlot}
                onClearSlot={(slot) => {
                  setPicked((prev) =>
                    prev.map((cur, i) => (i === slot ? null : cur)),
                  );
                  setActiveSlot(slot);
                }}
              />

              <p className="mb-1.5 mt-5 text-[13px] font-semibold text-ink">
                <span className="text-accent">
                  {slotCaptions[activeSlot]}
                </span>{" "}
                자리에 넣을 사람
              </p>
            </>
          ) : null}

          <ProfileList
            profiles={profiles}
            defaultId={defaultId}
            selectedId={picked[activeSlot]}
            disabledIds={picked.filter(
              (id, i): id is string => Boolean(id) && i !== activeSlot,
            )}
            mode={couple ? "assign" : "go"}
            slotOf={(id) => {
              const at = picked.indexOf(id);
              return at >= 0 ? slotCaptions[at] : undefined;
            }}
            onSelect={pickInto}
            onAdd={() => setStep({ kind: "form" })}
          />
        </>
      ) : null}

      {step.kind === "form" ? (
        <ProfileForm
          defaultRelation={profiles.length === 0 ? "self" : "partner"}
          submitLabel="저장하고 계속하기"
          onSubmit={handleCreate}
          onCancel={
            profiles.length > 0 ? () => setStep({ kind: "pick" }) : undefined
          }
        />
      ) : null}

      {step.kind === "pay" ? (
        <div>
          <ul className="space-y-2">
            {filled.map((profile, i) =>
              profile ? (
                <li
                  key={profile.id}
                  className="flex items-center gap-3 rounded-win border border-line bg-white px-3 py-2.5"
                >
                  <span
                    aria-hidden="true"
                    className={`flex size-10 shrink-0 items-center justify-center rounded-full text-[16px] font-bold ${relationAvatar[profile.relation]}`}
                  >
                    {profile.name.slice(0, 1)}
                  </span>
                  <span className="min-w-0 flex-1">
                    {couple ? (
                      <span className="block dot-label text-[11px] text-ink-faint">
                        {labels[i]}
                      </span>
                    ) : null}
                    <span className="block text-[15px] font-bold text-ink">
                      {profile.name}
                    </span>
                    <span className="mt-0.5 block dot-text text-[12px] text-ink-soft">
                      {describeProfile(profile)}
                    </span>
                  </span>
                </li>
              ) : null,
            )}
          </ul>

          {gift ? (
            <div className="mt-4 rounded-win border border-line bg-page-pink px-3.5 py-3">
              <p className="dot-text text-[13px] leading-[1.7] text-ink">
                선물로 받은 운세예요. 하트를 쓰지 않고 볼 수 있어요.
              </p>
            </div>
          ) : (
          <dl className="mt-4 space-y-2 border-t border-silver pt-3.5">
            <div className="flex items-center justify-between">
              <dt className="text-[14px] font-semibold text-ink">사용 하트</dt>
              <dd className="flex items-center gap-1.5">
                <span className="dot-text text-[19px] font-bold leading-none text-accent">
                  {product.hearts}
                </span>
                <HeartCoin size={18} />
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="dot-text text-[13px] text-ink-soft">보유 하트</dt>
              <dd className="flex items-center gap-1.5">
                <span
                  className={`dot-text text-[14px] font-bold leading-none ${
                    enough ? "text-ink-soft" : "text-accent"
                  }`}
                >
                  {hearts}
                </span>
                <HeartCoin size={14} />
              </dd>
            </div>
          </dl>
          )}

          <div aria-live="polite">
            {!gift && !enough ? (
              <p className="mt-3 rounded-win border border-[#ff8ec7] bg-page-pink px-3 py-2.5 dot-text text-[13px] leading-[1.6] text-ink">
                하트가 <span className="font-bold text-accent">{short}개</span>{" "}
                모자라요. 충전하면 바로 이어서 볼 수 있어요.
              </p>
            ) : null}
          </div>

          <Button
            variant="primary"
            size="cta"
            className="mt-4 w-full"
            onClick={enough ? handlePay : () => setStep({ kind: "charge" })}
          >
            {gift ? (
              "결과 보기"
            ) : enough ? (
              <>
                <span className="dot-text text-[17px] leading-none">
                  {product.hearts}
                </span>
                <HeartCoin size={17} />
                <span>하트 사용</span>
              </>
            ) : (
              "하트 충전하기"
            )}
          </Button>
        </div>
      ) : null}

      {step.kind === "charge" ? (
        <div>
          <p className="dot-text text-[13px] leading-[1.7] text-ink-soft">
            지금 <span className="font-bold text-ink">{hearts}개</span> 있어요.
            {short > 0 ? (
              <>
                {" "}
                <span className="font-bold text-accent">{short}개</span>만 더
                채우면 바로 볼 수 있어요.
              </>
            ) : null}
          </p>

          <div className="mt-3.5">
            <HeartPackageList selected={chargeHearts} onSelect={setChargePick} />
          </div>

          <p className="mt-3 dot-text text-[12px] leading-[1.7] text-ink-faint">
            충전하면 이어서 바로 결제할 수 있어요.
          </p>
        </div>
      ) : null}
    </Modal>

    <PgCheckoutModal
      open={checkout}
      onClose={() => setCheckout(false)}
      orderName={chargePack.name}
      orderDetail={`하트 ${chargePack.hearts}개`}
      amount={chargePack.price}
      onSuccess={handleCharged}
    />
    </>
  );
}
