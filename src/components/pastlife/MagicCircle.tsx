/** 바깥 고리 눈금 — 5도마다, 30도마다 길게 */
const TICKS = Array.from({ length: 72 }, (_, i) => i * 5);
/** 중심에서 뻗는 방사선 */
const SPOKES = Array.from({ length: 12 }, (_, i) => i * 30);
/** 안쪽 고리에 두르는 기호 */
const GLYPHS = ["✦", "✧", "☾", "✶", "✦", "☽", "✧", "✶"];

const point = (deg: number, radius: number) => {
  const rad = ((deg - 90) * Math.PI) / 180;
  return [50 + Math.cos(rad) * radius, 50 + Math.sin(rad) * radius] as const;
};

const polygon = (sides: number, radius: number, offset = 0) =>
  Array.from({ length: sides }, (_, i) =>
    point((360 / sides) * i + offset, radius).join(","),
  ).join(" ");

/**
 * 마법진 — 인연도 눈금(세 겹 원)을 그대로 두고 그 위에 진을 그린다.
 *
 * 바깥은 눈금과 방사선, 가운데는 육각별과 교점, 안쪽은 룬 고리로 층을 쌓아
 * 층마다 다른 속도로 돌린다. 색은 옅은 분홍 하나로 통일한다.
 */
export function MagicCircle({
  inner,
  mid,
  outer,
}: {
  inner: number;
  mid: number;
  outer: number;
}) {
  const starRadius = mid - 1.5;

  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 size-full text-brand-pink-soft opacity-25"
    >
      {/* --- 바깥 층: 이중 고리 · 눈금 · 방사선 --- */}
      <g
        className="orbit-spin-slow"
        style={{ transformOrigin: "50% 50%" }}
        stroke="currentColor"
        fill="none"
      >
        <circle cx="50" cy="50" r={outer} strokeWidth="0.3" />
        <circle cx="50" cy="50" r={outer - 1.2} strokeWidth="0.22" />
        <circle
          cx="50"
          cy="50"
          r={outer - 3.4}
          strokeWidth="0.22"
          strokeDasharray="0.9 1.5"
        />

        {TICKS.map((deg) => {
          const long = deg % 30 === 0;
          const [x1, y1] = point(deg, outer - 3.4);
          const [x2, y2] = point(deg, outer - (long ? 1.2 : 2.2));
          return (
            <line
              key={deg}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              strokeWidth={long ? 0.3 : 0.16}
              opacity={long ? 1 : 0.45}
            />
          );
        })}

        {/* 30도마다 바깥 고리에 작은 점 */}
        {SPOKES.map((deg) => {
          const [cx, cy] = point(deg, outer - 2.3);
          return <circle key={deg} cx={cx} cy={cy} r="0.4" fill="currentColor" stroke="none" />;
        })}
      </g>

      {/* --- 방사선: 바깥과 가운데를 잇는다 (고정) --- */}
      <g stroke="currentColor" fill="none" opacity="0.4">
        {SPOKES.map((deg) => {
          const [x1, y1] = point(deg, mid);
          const [x2, y2] = point(deg, outer - 3.4);
          return (
            <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="0.16" />
          );
        })}
      </g>

      {/* --- 가운데 층: 육각별과 교점 --- */}
      <g
        className="orbit-spin"
        style={{ transformOrigin: "50% 50%" }}
        stroke="currentColor"
        fill="none"
      >
        <circle cx="50" cy="50" r={mid} strokeWidth="0.26" />
        <circle cx="50" cy="50" r={mid - 0.9} strokeWidth="0.16" opacity="0.7" />
        <polygon points={polygon(3, starRadius, 0)} strokeWidth="0.24" />
        <polygon points={polygon(3, starRadius, 60)} strokeWidth="0.24" />

        {/* 별 꼭짓점에 작은 원 */}
        {[0, 60, 120, 180, 240, 300].map((deg) => {
          const [cx, cy] = point(deg, starRadius);
          return (
            <circle
              key={deg}
              cx={cx}
              cy={cy}
              r="0.9"
              strokeWidth="0.2"
              className="fill-white"
            />
          );
        })}
      </g>

      {/* --- 안쪽 층: 이중 고리 · 룬 --- */}
      <g
        className="orbit-spin-slow"
        style={{ transformOrigin: "50% 50%" }}
        fill="none"
      >
        <circle
          cx="50"
          cy="50"
          r={inner}
          stroke="currentColor"
          strokeWidth="0.28"
        />
        <circle
          cx="50"
          cy="50"
          r={inner + 2.2}
          stroke="currentColor"
          strokeWidth="0.18"
          strokeDasharray="0.7 1.4"
        />
        <polygon
          points={polygon(6, inner + 1.1)}
          stroke="currentColor"
          strokeWidth="0.18"
          opacity="0.55"
        />

        {GLYPHS.map((glyph, i) => {
          const [x, y] = point((360 / GLYPHS.length) * i, (inner + mid) / 2);
          return (
            <text
              key={`${glyph}-${i}`}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="3"
              fill="currentColor"
            >
              {glyph}
            </text>
          );
        })}
      </g>
    </svg>
  );
}
