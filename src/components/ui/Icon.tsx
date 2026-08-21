import type { SVGProps } from "react";

/**
 * Functional Icon (§10) — Thin Line, stroke 1.5px.
 * 색은 currentColor를 따르며 Pink / Lavender / Baby Blue 중 하나만 사용한다.
 */
export type IconName =
  | "heart"
  | "globe"
  | "lock"
  | "star"
  | "notice"
  | "guide"
  | "review"
  | "faq"
  | "chat"
  | "mail"
  | "user"
  | "receipt"
  | "box"
  | "gift"
  | "ticket"
  | "logout"
  | "close"
  | "arrow-right"
  | "chevron-left"
  | "chevron-right"
  | "menu";

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
}

const paths: Record<IconName, React.ReactNode> = {
  heart: (
    <path d="M12 20.5S3.5 15.2 3.5 9.4A4.4 4.4 0 0 1 12 7.3a4.4 4.4 0 0 1 8.5 2.1c0 5.8-8.5 11.1-8.5 11.1Z" />
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.2 2.3 3.3 5.3 3.3 8.5s-1.1 6.2-3.3 8.5c-2.2-2.3-3.3-5.3-3.3-8.5S9.8 5.8 12 3.5Z" />
    </>
  ),
  lock: (
    <>
      <rect x="4.5" y="10.5" width="15" height="10" rx="1.5" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
    </>
  ),
  star: (
    <path d="m12 3.8 2.5 5.3 5.7.8-4.1 4 1 5.7-5.1-2.7-5.1 2.7 1-5.7-4.1-4 5.7-.8L12 3.8Z" />
  ),
  notice: (
    <>
      <path d="M4 10v4h3l6 3.5V6.5L7 10H4Z" />
      <path d="M17 9.2a4 4 0 0 1 0 5.6" />
    </>
  ),
  guide: (
    <>
      <rect x="5" y="3.5" width="14" height="17" rx="1.5" />
      <path d="M8.5 8h7M8.5 12h7M8.5 16h4" />
    </>
  ),
  review: <path d="M4.5 5.5h15v10h-8.5l-4 3.5v-3.5h-2.5v-10Z" />,
  faq: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M9.8 9.6a2.2 2.2 0 1 1 2.9 2.1c-.6.2-.9.7-.9 1.3v.5" />
      <path d="M12 16.4h.01" />
    </>
  ),
  chat: (
    <>
      <path d="M4.5 5.5h15v9h-9l-3.5 3v-3h-2.5v-9Z" />
      <path d="M9 10h.01M12 10h.01M15 10h.01" />
    </>
  ),
  mail: (
    <>
      <rect x="3.5" y="5.5" width="17" height="13" rx="1.5" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="3.8" />
      <path d="M4.8 20.2c.6-3.6 3.6-6.2 7.2-6.2s6.6 2.6 7.2 6.2" />
    </>
  ),
  receipt: (
    <>
      <path d="M6 3.5h12v17l-2-1.4-2 1.4-2-1.4-2 1.4-2-1.4-2 1.4v-17Z" />
      <path d="M9.5 8.5h5M9.5 12.5h5" />
    </>
  ),
  box: (
    <>
      <rect x="3.5" y="4.5" width="17" height="4" rx="1" />
      <path d="M5.5 8.5v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-10" />
      <path d="M10 12.5h4" />
    </>
  ),
  gift: (
    <>
      <rect x="3.5" y="8.5" width="17" height="4" rx="1" />
      <path d="M5.5 12.5v7a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-7M12 8.5v12" />
      <path d="M12 8.5S10.8 4 8.6 4a2.2 2.2 0 0 0 0 4.5M12 8.5S13.2 4 15.4 4a2.2 2.2 0 0 1 0 4.5" />
    </>
  ),
  ticket: (
    <>
      <path d="M3.5 8.5v-2h17v2a2.2 2.2 0 0 0 0 4.4v4.6h-17v-4.6a2.2 2.2 0 0 0 0-4.4Z" />
      <path d="m9.5 10 5 4m0-4-5 4" />
    </>
  ),
  logout: (
    <>
      <path d="M14.5 4.5h-8a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h8" />
      <path d="M11 12h9.5m-3.5-3.5 3.5 3.5-3.5 3.5" />
    </>
  ),
  close: <path d="m6 6 12 12M18 6 6 18" />,
  "arrow-right": <path d="M4.5 12h14m-5-5 5 5-5 5" />,
  "chevron-left": <path d="m14 5-7 7 7 7" />,
  "chevron-right": <path d="m10 5 7 7-7 7" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
};

export function Icon({ name, size = 20, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
