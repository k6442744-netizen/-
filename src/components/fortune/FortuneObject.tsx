/* eslint-disable @next/next/no-img-element */

import { asset } from "@/lib/asset";

/**
 * 3D Object System (§11)
 *
 * 실제 3D 렌더 에셋이 준비되기 전까지 사용하는 **소재 placeholder**다.
 * §20-13에 따라 임의의 복잡한 일러스트를 그리지 않고,
 * Translucent Plastic / Glass / Chrome / Pearl 소재감만 단순한 기하 형태로 표현한다.
 *
 * 에셋이 준비되면 `src`만 넘기면 그대로 교체된다.
 *   <FortuneObject name="heart" src="/objects/heart.png" />
 */
export type ObjectName =
  | "cd"
  | "flip-phone"
  | "heart"
  | "crystal-ball"
  | "padlock"
  | "key"
  | "butterfly"
  | "star-charm"
  | "tamagotchi"
  | "envelope";

interface FortuneObjectProps {
  name: ObjectName;
  size?: number;
  className?: string;
  /** 실제 3D 렌더 에셋 경로 (있으면 placeholder 대신 이미지 사용) */
  src?: string;
  alt?: string;
}

export function FortuneObject({
  name,
  size = 120,
  className = "",
  src,
  alt = "",
}: FortuneObjectProps) {
  if (src) {
    return (
      <img
        src={asset(src)}
        alt={alt}
        width={size}
        height={size}
        className={`block object-contain ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  if (name === "cd") {
    /* CD — iridescent conic gradient (§3 "소재감" 용도) */
    return (
      <div
        className={`shrink-0 ${className}`}
        style={{ width: size, height: size }}
        aria-hidden="true"
      >
        <div className="relative size-full">
          <div className="iridescent absolute inset-0 rounded-full shadow-object" />
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_32%_26%,rgba(255,255,255,.92),rgba(255,255,255,0)_46%)]" />
          <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/70" />
          <div
            className="absolute rounded-full bg-white/85 ring-1 ring-inset ring-[#e0d5ec]"
            style={{ inset: "33%" }}
          />
          <div
            className="absolute rounded-full bg-[#fcf7fe] ring-1 ring-[#d6c9e8]"
            style={{ inset: "42%" }}
          />
        </div>
      </div>
    );
  }

  const box = { width: size, height: size };

  if (name === "flip-phone") {
    return (
      <svg viewBox="0 0 120 120" style={box} className={className} aria-hidden="true">
        <defs>
          <linearGradient id="fo-phone" x1=".15" y1="0" x2=".9" y2="1">
            <stop offset="0" stopColor="#fff" />
            <stop offset=".3" stopColor="#ffdcee" />
            <stop offset=".62" stopColor="#ff96c8" />
            <stop offset=".86" stopColor="#ffe4f2" />
            <stop offset="1" stopColor="#f06ab0" />
          </linearGradient>
          <linearGradient id="fo-phone-screen" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#2b1b3d" />
            <stop offset="1" stopColor="#1b1226" />
          </linearGradient>
        </defs>
        {/* body */}
        <rect x="36" y="10" width="48" height="100" rx="15" fill="url(#fo-phone)" stroke="#ff9ecd" strokeWidth="1" />
        {/* hinge */}
        <rect x="36" y="57" width="48" height="3" fill="#fff" opacity=".75" />
        {/* screen */}
        <rect x="43" y="19" width="34" height="30" rx="4" fill="url(#fo-phone-screen)" />
        <path d="M60 30.5c-1.6-2.4-6-2-6 1.4 0 2.6 4 5.3 6 6.6 2-1.3 6-4 6-6.6 0-3.4-4.4-3.8-6-1.4Z" fill="#ff5fa8" />
        {/* keypad */}
        <g fill="#fff" opacity=".72">
          {[0, 1, 2, 3].map((r) =>
            [0, 1, 2].map((c) => (
              <rect key={`${r}-${c}`} x={45 + c * 11} y={66 + r * 10} width="9" height="7" rx="2.5" />
            )),
          )}
        </g>
        {/* charm */}
        <path d="M84 24c6 3 10 7 12 12" stroke="#cdbcec" strokeWidth="1.2" fill="none" />
        <path d="M96 36l2.4 4.6 5.1.7-3.7 3.6.9 5.1-4.7-2.4-4.7 2.4.9-5.1-3.7-3.6 5.1-.7L96 36Z" fill="#ffcfe8" stroke="#ff9ecd" strokeWidth=".8" />
      </svg>
    );
  }

  if (name === "heart") {
    return (
      <svg viewBox="0 0 120 120" style={box} className={className} aria-hidden="true">
        <defs>
          <radialGradient id="fo-heart" cx=".34" cy=".26" r=".85">
            <stop offset="0" stopColor="#fff" />
            <stop offset=".34" stopColor="#ffc3e0" />
            <stop offset=".72" stopColor="#ff6fb2" />
            <stop offset="1" stopColor="#e83e93" />
          </radialGradient>
        </defs>
        <path
          d="M60 104S14 76 14 46.5C14 31 26 21 38.5 21 47 21 55 25.5 60 33c5-7.5 13-12 21.5-12C94 21 106 31 106 46.5 106 76 60 104 60 104Z"
          fill="url(#fo-heart)"
        />
        <ellipse cx="42" cy="45" rx="11" ry="8" fill="#fff" opacity=".7" transform="rotate(-24 42 45)" />
      </svg>
    );
  }

  if (name === "crystal-ball") {
    return (
      <svg viewBox="0 0 120 120" style={box} className={className} aria-hidden="true">
        <defs>
          <radialGradient id="fo-ball" cx=".35" cy=".3" r=".8">
            <stop offset="0" stopColor="#fff" />
            <stop offset=".38" stopColor="#e8dcff" />
            <stop offset=".78" stopColor="#b490ff" />
            <stop offset="1" stopColor="#9b6bff" />
          </radialGradient>
        </defs>
        <path d="M36 92h48l-6 14H42z" fill="#c0a6f0" />
        <circle cx="60" cy="56" r="42" fill="url(#fo-ball)" />
        <ellipse cx="44" cy="40" rx="12" ry="9" fill="#fff" opacity=".75" transform="rotate(-28 44 40)" />
      </svg>
    );
  }

  if (name === "padlock") {
    return (
      <svg viewBox="0 0 120 120" style={box} className={className} aria-hidden="true">
        <defs>
          <linearGradient id="fo-lock" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f6f0ff" />
            <stop offset=".5" stopColor="#e0d0ff" />
            <stop offset="1" stopColor="#a480f0" />
          </linearGradient>
          <linearGradient id="fo-key" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fdfdfe" />
            <stop offset=".55" stopColor="#d8cee9" />
            <stop offset="1" stopColor="#a89ec0" />
          </linearGradient>
        </defs>
        <path d="M38 50V38a18 18 0 0 1 36 0v12" fill="none" stroke="url(#fo-lock)" strokeWidth="9" strokeLinecap="round" />
        <rect x="22" y="50" width="62" height="52" rx="8" fill="url(#fo-lock)" />
        <path d="M53 72a7 7 0 1 1 14 0c0 3-2 5-4 6l1 8h-8l1-8c-2-1-4-3-4-6Z" fill="#fff" opacity=".8" />
        <circle cx="96" cy="62" r="12" fill="none" stroke="url(#fo-key)" strokeWidth="6" />
        <path d="M96 74v26m0-8h8m-8-10h6" stroke="url(#fo-key)" strokeWidth="6" strokeLinecap="round" />
      </svg>
    );
  }

  if (name === "tamagotchi") {
    return (
      <svg viewBox="0 0 120 120" style={box} className={className} aria-hidden="true">
        <defs>
          <linearGradient id="fo-tama" x1=".2" y1="0" x2=".8" y2="1">
            <stop offset="0" stopColor="#fff" />
            <stop offset=".32" stopColor="#ddeeff" />
            <stop offset=".68" stopColor="#ded0ff" />
            <stop offset="1" stopColor="#ffc9e6" />
          </linearGradient>
        </defs>
        {/* bead chain */}
        <g fill="#cdbcec">
          <circle cx="60" cy="8" r="4" />
          <circle cx="70" cy="12" r="4" />
          <circle cx="78" cy="19" r="4" />
        </g>
        <ellipse cx="58" cy="68" rx="38" ry="42" fill="url(#fo-tama)" />
        <ellipse cx="46" cy="44" rx="9" ry="7" fill="#fff" opacity=".6" transform="rotate(-26 46 44)" />
        <rect x="36" y="46" width="44" height="36" rx="6" fill="#2b1b3d" />
        {/* smiley */}
        <g fill="#ff6fb2">
          <rect x="48" y="58" width="5" height="6" rx="1.4" />
          <rect x="63" y="58" width="5" height="6" rx="1.4" />
          <path d="M49 70c2.5 3.4 6 5 9 5s6.5-1.6 9-5" stroke="#ff6fb2" strokeWidth="3.4" fill="none" strokeLinecap="round" />
        </g>
        <g fill="#cdbcec">
          <circle cx="45" cy="94" r="4.5" />
          <circle cx="58" cy="97" r="4.5" />
          <circle cx="71" cy="94" r="4.5" />
        </g>
      </svg>
    );
  }

  if (name === "key") {
    return (
      <svg viewBox="0 0 120 120" style={box} className={className} aria-hidden="true">
        <defs>
          <linearGradient id="fo-key2" x1=".1" y1="0" x2=".9" y2="1">
            <stop offset="0" stopColor="#fdfdfe" />
            <stop offset=".38" stopColor="#d0c4e4" />
            <stop offset=".6" stopColor="#ffffff" />
            <stop offset="1" stopColor="#8f85a8" />
          </linearGradient>
        </defs>
        <g transform="rotate(-28 60 60)">
          <circle cx="60" cy="30" r="17" fill="none" stroke="url(#fo-key2)" strokeWidth="9" />
          <circle cx="60" cy="30" r="6" fill="#ffeef7" />
          <path
            d="M60 47v46m0-10h13m-13-13h9"
            stroke="url(#fo-key2)"
            strokeWidth="9"
            strokeLinecap="round"
          />
        </g>
        <path d="M30 84a7 7 0 1 1 14 0 7 7 0 0 1-14 0Z" fill="#ffb3dc" />
      </svg>
    );
  }

  if (name === "butterfly") {
    return (
      <svg viewBox="0 0 120 120" style={box} className={className} aria-hidden="true">
        <defs>
          <linearGradient id="fo-bfly" x1=".1" y1="0" x2=".9" y2="1">
            <stop offset="0" stopColor="#ffe9f7" />
            <stop offset=".45" stopColor="#e2d2ff" />
            <stop offset="1" stopColor="#bfe8ff" />
          </linearGradient>
        </defs>
        <g fill="url(#fo-bfly)" stroke="#c9b2f0" strokeWidth="1.2">
          <path d="M56 56 27 21c-6.6-8-19.6-4.6-21.6 5.4L.9 55.6C.4 64 6.8 71 15.2 71H56V56Z" transform="translate(4 6)" />
          <path d="M64 56l29-35c6.6-8 19.6-4.6 21.6 5.4l4.5 29.2c.5 8.4-5.9 15.4-14.3 15.4H64V56Z" transform="translate(-4 6)" />
          <path d="M56 77H24c-7 0-11.4 7.6-7.8 13.6l7.6 12.8c4.4 7.4 15.4 7 19.4-.6L56 77Z" transform="translate(4 2)" />
          <path d="M64 77h32c7 0 11.4 7.6 7.8 13.6l-7.6 12.8c-4.4 7.4-15.4 7-19.4-.6L64 77Z" transform="translate(-4 2)" />
        </g>
        <rect x="57.6" y="24" width="4.8" height="72" rx="2.4" fill="#fff" opacity=".9" />
      </svg>
    );
  }

  if (name === "star-charm") {
    return (
      <svg viewBox="0 0 120 120" style={box} className={className} aria-hidden="true">
        <defs>
          <linearGradient id="fo-charm" x1=".2" y1="0" x2=".85" y2="1">
            <stop offset="0" stopColor="#fff" />
            <stop offset=".38" stopColor="#ffd8ee" />
            <stop offset=".72" stopColor="#ded0ff" />
            <stop offset="1" stopColor="#c6ecff" />
          </linearGradient>
        </defs>
        <g fill="#cdbcec">
          <circle cx="60" cy="9" r="4.5" />
          <circle cx="60" cy="20" r="4.5" />
        </g>
        <path
          d="m60 28 11.6 24.6L98 56.4 78.9 74.7l4.6 26.6L60 88.7l-23.5 12.6 4.6-26.6L22 56.4l26.4-3.8L60 28Z"
          fill="url(#fo-charm)"
          stroke="#d6bff5"
          strokeWidth="1.2"
        />
        <ellipse cx="49" cy="52" rx="8" ry="5.5" fill="#fff" opacity=".8" transform="rotate(-26 49 52)" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 120 120" style={box} className={className} aria-hidden="true">
      <defs>
        <linearGradient id="fo-env" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" />
          <stop offset=".55" stopColor="#ffe6f4" />
          <stop offset="1" stopColor="#ffc0e0" />
        </linearGradient>
      </defs>
      <rect x="14" y="30" width="92" height="62" rx="5" fill="url(#fo-env)" stroke="#ff9ecd" />
      <path d="M14 35l46 32 46-32" fill="none" stroke="#ff9ecd" strokeWidth="2" />
      <circle cx="92" cy="34" r="11" fill="#ff4fa3" />
      <text x="92" y="38" textAnchor="middle" fontSize="12" fill="#fff" fontWeight="700">
        1
      </text>
    </svg>
  );
}
