/* eslint-disable @next/next/no-img-element */

import { asset } from "@/lib/asset";

/**
 * 재화 하트 — 픽셀아트 에셋(64×64).
 * 확대/축소 시 뭉개지지 않도록 `pixelated` 렌더링을 강제한다.
 */
export function HeartCoin({
  size = 16,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <img
      src={asset("/objects/heart.png")}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      className={`pixelated block shrink-0 ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
