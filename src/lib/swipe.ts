/**
 * 스와이프로 넘기는 요소(히어로 배너 · 추천운세 카드)가 공유하는 감각.
 * 두 캐러셀이 같은 곡선을 써야 한 화면에서 조작감이 어긋나지 않는다.
 */

/** 끝에서 아주 살짝 넘쳤다가 제자리로 돌아온다 — 딱 끊기지 않고 붙는 느낌 */
export const SWIPE_TRANSITION =
  "transform 560ms cubic-bezier(0.22, 1.12, 0.34, 1)";

/**
 * 넘길지 되돌릴지 가르는 거리.
 * 좁은 화면에서 40px은 너무 헐거워서 폭의 15%와 큰 쪽을 쓴다.
 */
export const swipeThreshold = (width: number) => Math.max(40, width * 0.15);

/** 더 갈 곳이 없을 때 끌리는 비율 — 벽에 닿았다는 걸 손으로 알려준다 */
export const EDGE_RESISTANCE = 0.32;
