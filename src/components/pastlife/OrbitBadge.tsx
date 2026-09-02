/** 궤도 위의 점 — 각도(deg)와 색만 정해 준다 */
const ring1 = [
  { deg: 0, color: "bg-brand-pink" },
  { deg: 90, color: "bg-brand-lav" },
  { deg: 180, color: "bg-[#7fc9ec]" },
  { deg: 270, color: "bg-[#ffcf6b]" },
];
const ring2 = [
  { deg: 40, color: "bg-brand-pink-soft" },
  { deg: 160, color: "bg-brand-lav-soft" },
  { deg: 280, color: "bg-[#bfe8ff]" },
];

/**
 * 인연이 도는 궤도 배지.
 * 바깥 고리와 안쪽 고리가 서로 다른 속도로 돌고, 점은 회전을 되돌려 서 있는다.
 */
export function OrbitBadge({ size = 96 }: { size?: number }) {
  return (
    <span
      aria-hidden="true"
      className="relative flex shrink-0 items-center justify-center"
      style={{ width: size, height: size }}
    >
      <span className="absolute inset-0 rounded-full border border-dashed border-brand-lav-soft" />
      <span className="absolute inset-[15%] rounded-full border border-dashed border-silver-mid/50" />

      <span className="orbit-spin absolute inset-0">
        {ring1.map((dot) => (
          <Dot key={dot.deg} {...dot} radius={50} size={7} />
        ))}
      </span>

      <span className="orbit-spin-slow absolute inset-[15%]">
        {ring2.map((dot) => (
          <Dot key={dot.deg} {...dot} radius={50} size={5} />
        ))}
      </span>

      <span className="relative flex size-[34%] items-center justify-center rounded-full bg-brand-lav text-[15px] shadow-card">
        🦋
      </span>
    </span>
  );
}

function Dot({
  deg,
  color,
  radius,
  size,
}: {
  deg: number;
  color: string;
  /** 중심에서 떨어진 거리 (%) */
  radius: number;
  size: number;
}) {
  const rad = (deg * Math.PI) / 180;
  return (
    <span
      className={`absolute rounded-full ${color}`}
      style={{
        width: size,
        height: size,
        left: `${50 + Math.cos(rad) * radius}%`,
        top: `${50 + Math.sin(rad) * radius}%`,
        transform: "translate(-50%, -50%)",
      }}
    />
  );
}
