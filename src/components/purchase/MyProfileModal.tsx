"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { ProfileList } from "./ProfileList";
import { ProfileForm } from "./ProfileForm";
import { useProfiles } from "@/lib/account";
import { toDraft, type ProfileDraft } from "@/lib/profiles";

type View = { mode: "list" } | { mode: "add" } | { mode: "edit"; id: string };

/**
 * 마이페이지의 사주정보 관리 팝업.
 * 구매 팝업이 `고르기`만 다루는 것과 달리 여기서는 수정·삭제·기본 지정을 한다.
 */
export function MyProfileModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const {
    profiles,
    defaultId,
    addProfile,
    updateProfile,
    removeProfile,
    setDefaultProfile,
  } = useProfiles();
  const [view, setView] = useState<View>({ mode: "list" });

  const editing =
    view.mode === "edit" ? profiles.find((p) => p.id === view.id) : undefined;

  const backToList = () => setView({ mode: "list" });

  const handleAdd = (draft: ProfileDraft) => {
    addProfile(draft);
    backToList();
  };

  const handleEdit = (draft: ProfileDraft) => {
    if (!editing) return;
    updateProfile(editing.id, draft);
    backToList();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={
        view.mode === "add"
          ? "사주정보 추가"
          : view.mode === "edit"
            ? "사주정보 수정"
            : "내 사주정보"
      }
      subtitle={
        view.mode === "list"
          ? "누르면 기본 사주정보로 바뀌어요"
          : "태어난 시와 음/양력까지 맞아야 정확해요"
      }
      onBack={view.mode === "list" ? undefined : backToList}
    >
      {view.mode === "list" ? (
        <ProfileList
          profiles={profiles}
          defaultId={defaultId}
          selectedId={defaultId}
          onSelect={setDefaultProfile}
          onEdit={(id) => setView({ mode: "edit", id })}
          onAdd={() => setView({ mode: "add" })}
        />
      ) : null}

      {view.mode === "add" ? (
        <ProfileForm
          defaultRelation={profiles.length === 0 ? "self" : "partner"}
          submitLabel="저장하기"
          onSubmit={handleAdd}
          onCancel={profiles.length > 0 ? backToList : undefined}
        />
      ) : null}

      {view.mode === "edit" && editing ? (
        <ProfileForm
          key={editing.id}
          initial={toDraft(editing)}
          submitLabel="수정 완료"
          onSubmit={handleEdit}
          onCancel={backToList}
          onDelete={() => {
            removeProfile(editing.id);
            backToList();
          }}
        />
      ) : null}
    </Modal>
  );
}
