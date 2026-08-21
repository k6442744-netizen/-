import { PixelLabel } from "./PixelLabel";

interface StatusBadgeProps {
  label: string;
  className?: string;
}

/** Pixel Status Label (§15) — Hero의 `NOW ONLINE` 같은 상태 표시. Radius 999px (§6). */
export function StatusBadge({ label, className = "" }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-line bg-white/85 py-1.5 pl-2.5 pr-3 backdrop-blur-[2px] ${className}`}
    >
      <span
        aria-hidden="true"
        className="blink-dot size-[6px] rounded-full bg-brand-pink"
      />
      <PixelLabel className="text-ink-soft">{label}</PixelLabel>
    </span>
  );
}
