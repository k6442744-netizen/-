"use client";

import { useRef, type ElementType, type ReactNode } from "react";

interface DragScrollerProps {
  children: ReactNode;
  /** 렌더할 태그 — 목록이면 `ul`, 그 외 `div` */
  as?: ElementType;
  className?: string;
}

/**
 * 가로 스크롤 목록을 마우스로도 끌 수 있게 감싸는 래퍼.
 *
 * 터치는 브라우저 네이티브 스크롤이 관성·스냅까지 알아서 처리하므로 건드리지
 * 않고, 마우스일 때만 개입한다. 스크롤바를 숨긴(`no-scrollbar`) 목록은
 * 데스크톱에서 넘길 방법이 없어 보이는데, 그걸 메운다.
 *
 * children 은 그대로 통과시키므로 부모가 서버 컴포넌트여도 된다 —
 * 이 래퍼만 클라이언트 경계가 된다.
 */
export function DragScroller({
  children,
  as: Tag = "div",
  className = "",
}: DragScrollerProps) {
  const ref = useRef<HTMLElement>(null);
  const drag = useRef({
    active: false,
    startX: 0,
    startScroll: 0,
    moved: false,
    captured: false,
  });

  const onPointerDown = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    const el = ref.current;
    /* 넘칠 게 없으면 끌 것도 없다 */
    if (!el || el.scrollWidth <= el.clientWidth) return;

    drag.current = {
      active: true,
      startX: e.clientX,
      startScroll: el.scrollLeft,
      moved: false,
      captured: false,
    };
    /* 텍스트 선택·이미지 끌기만 막는다. click 은 그대로 발생한다 */
    e.preventDefault();
    /* 스냅이 걸린 채로 scrollLeft 를 만지면 끌리는 도중 튄다 */
    el.style.scrollSnapType = "none";
    /* 포인터 캡처는 여기서 걸지 않는다 — 캡처가 걸린 채 클릭하면 click 의
       대상이 카드가 아니라 이 목록으로 바뀌어 카드가 눌리지 않는다.
       실제로 끌기 시작한 뒤에 건다 (onPointerMove) */
  };

  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!drag.current.active) return;
    const el = ref.current;
    if (!el) return;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 4 && !drag.current.moved) {
      drag.current.moved = true;
      /* 목록 밖으로 나가도 계속 끌리도록 이때부터 캡처한다 */
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
        drag.current.captured = true;
      } catch {
        /* 캡처가 안 되면 캡처 없이 진행 */
      }
    }
    el.scrollLeft = drag.current.startScroll - dx;
  };

  const endDrag = (e: React.PointerEvent<HTMLElement>) => {
    if (!drag.current.active) return;
    drag.current.active = false;
    const el = ref.current;
    if (!el) return;
    if (drag.current.captured && e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    drag.current.captured = false;
    /* CSS 로 정의된 스냅으로 되돌린다 — 놓은 자리에서 브라우저가 맞춰 준다 */
    el.style.scrollSnapType = "";
  };

  /* 끌고 나서 손을 뗀 자리의 카드가 눌리지 않도록 한다 */
  const onClickCapture = (e: React.MouseEvent<HTMLElement>) => {
    if (!drag.current.moved) return;
    drag.current.moved = false;
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <Tag
      ref={ref}
      className={className}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onClickCapture={onClickCapture}
    >
      {children}
    </Tag>
  );
}
