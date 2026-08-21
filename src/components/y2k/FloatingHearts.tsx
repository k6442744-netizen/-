import type { CSSProperties } from "react";
import { asset } from "@/lib/asset";

/** 위로 흘러가며 멀어질수록 사라지는 배경 하트들 */
const hearts: {
  left: string;
  size: number;
  duration: string;
  delay: string;
  drift: string;
  opacity: number;
  color: string;
}[] = [
  { left: "6%", size: 26, duration: "19s", delay: "0s", drift: "18px", opacity: 0.5, color: "#ffc2e2" },
  { left: "22%", size: 16, duration: "24s", delay: "-6s", drift: "-14px", opacity: 0.42, color: "#e0d0ff" },
  { left: "38%", size: 34, duration: "27s", delay: "-13s", drift: "22px", opacity: 0.34, color: "#ffd9ee" },
  { left: "54%", size: 20, duration: "21s", delay: "-3s", drift: "-20px", opacity: 0.46, color: "#ffc2e2" },
  { left: "70%", size: 30, duration: "30s", delay: "-17s", drift: "16px", opacity: 0.3, color: "#dbeeff" },
  { left: "84%", size: 18, duration: "23s", delay: "-9s", drift: "-12px", opacity: 0.44, color: "#ffd9ee" },
  { left: "92%", size: 24, duration: "26s", delay: "-21s", drift: "14px", opacity: 0.36, color: "#e0d0ff" },
];

export function FloatingHearts() {
  const mask = `url(${asset("/objects/heart-float.png")})`;

  return (
    /* 프레임 폭에 맞춘 뷰포트 고정 레이어 — 스크롤과 무관하게 계속 떠오른다 */
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-y-0 left-1/2 z-0 w-full min-w-[360px] -translate-x-1/2 overflow-hidden min-[480px]:max-w-[420px]"
    >
      {hearts.map((heart, i) => (
        <span
          key={i}
          className="heart-float absolute bottom-0 block"
          style={
            {
              left: heart.left,
              width: heart.size,
              height: heart.size,
              backgroundColor: heart.color,
              "--heart-mask": mask,
              "--heart-duration": heart.duration,
              "--heart-delay": heart.delay,
              "--heart-drift": heart.drift,
              "--heart-opacity": heart.opacity,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
