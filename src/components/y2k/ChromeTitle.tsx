import type { ReactNode } from "react";

interface ChromeTitleProps {
  children: ReactNode;
  tone?: "silver" | "pink";
  className?: string;
}

/**
 * Display / Hero typography (§4-A)
 * 3D·Chrome·Glossy 효과는 이 계층에만 허용한다 (§20-5).
 */
export function ChromeTitle({
  children,
  tone = "silver",
  className = "",
}: ChromeTitleProps) {
  return (
    <span
      className={`chrome-text ${tone === "pink" ? "chrome-pink" : "chrome-silver"} font-display ${className}`}
    >
      {children}
    </span>
  );
}
