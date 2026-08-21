export type DecoShape = "heart" | "sparkle" | "star" | "cursor" | "butterfly";

interface PixelDecorationProps {
  shape: DecoShape;
  size?: number;
  className?: string;
}

/**
 * Decorative Icon (§10)
 * 한 viewport당 5–8개 이하, 크기 8 / 12 / 16 / 24px.
 * 장식 요소는 기능 요소보다 시각적으로 약해야 한다 (§20-11).
 */
export function PixelDecoration({
  shape,
  size = 12,
  className = "",
}: PixelDecorationProps) {
  const common = {
    width: size,
    height: size,
    "aria-hidden": true as const,
    focusable: "false" as const,
    className,
  };

  if (shape === "heart") {
    // 도트 감성을 위해 crispEdges로 렌더되는 픽셀 하트
    return (
      <svg {...common} viewBox="0 0 12 11" shapeRendering="crispEdges">
        <path
          fill="currentColor"
          d="M2 1h3v1h2V1h3v1h1v3h-1v1h-1v1h-1v1H9v1H7v1H5V9H3V8H2V7H1V6H0V2h1V1h1Z"
          transform="translate(1 0)"
        />
      </svg>
    );
  }

  if (shape === "sparkle") {
    return (
      <svg {...common} viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M12 0c.7 6 5.3 10.6 12 12-6.7 1.4-11.3 6-12 12-.7-6-5.3-10.6-12-12C6.7 10.6 11.3 6 12 0Z"
        />
      </svg>
    );
  }

  if (shape === "star") {
    return (
      <svg {...common} viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="m12 1 3.2 6.8 7.3 1-5.3 5.2 1.3 7.4L12 18l-6.5 3.4 1.3-7.4-5.3-5.2 7.3-1L12 1Z"
        />
      </svg>
    );
  }

  if (shape === "cursor") {
    return (
      <svg {...common} viewBox="0 0 16 20" shapeRendering="crispEdges">
        <path
          fill="currentColor"
          d="M1 0l12 9h-5l3 7-3 1.5L5 10.5 1 14V0Z"
        />
      </svg>
    );
  }

  /* butterfly */
  return (
    <svg {...common} viewBox="0 0 24 20">
      <g fill="currentColor">
        <path d="M11.2 9.3 5.6 2.2C4.3.6 1.7 1.3 1.3 3.3L.2 9.1c-.3 1.7 1 3.2 2.7 3.2h8.3V9.3Z" />
        <path d="M12.8 9.3 18.4 2.2c1.3-1.6 3.9-.9 4.3 1.1l1.1 5.8c.3 1.7-1 3.2-2.7 3.2h-8.3V9.3Z" />
        <path d="M11.2 13.3H4.5c-1.4 0-2.3 1.5-1.6 2.7l1.6 2.7c.9 1.5 3.1 1.4 3.9-.1l2.8-5.3Z" />
        <path d="M12.8 13.3h6.7c1.4 0 2.3 1.5 1.6 2.7l-1.6 2.7c-.9 1.5-3.1 1.4-3.9-.1l-2.8-5.3Z" />
      </g>
      <rect x="11.3" y="3.2" width="1.4" height="14.4" rx=".7" fill="#fff" opacity=".9" />
    </svg>
  );
}
