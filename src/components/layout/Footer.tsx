import { PixelLabel } from "@/components/y2k/PixelLabel";

export function Footer() {
  return (
    <footer className="mt-12 border-t border-silver bg-page-lav/60 px-[var(--page-padding)] py-7">
      <div className="flex items-center gap-2">
        <PixelLabel as="p" className="!text-[13px] tracking-[0.03em] text-ink">
          FORTUNE PORTAL
        </PixelLabel>
        <PixelLabel
          as="span"
          className="rounded-full border border-silver-mid px-2 py-[3px] !text-[9px] text-ink-faint"
        >
          Y2K MAGIC
        </PixelLabel>
      </div>

      <nav aria-label="정책" className="mt-4 flex items-center gap-3">
        <a href="#" className="text-[13px] text-ink-soft underline-offset-4 hover:underline">
          이용약관
        </a>
        <span aria-hidden="true" className="h-3 w-px bg-silver" />
        <a href="#" className="text-[13px] font-semibold text-ink underline-offset-4 hover:underline">
          개인정보처리방침
        </a>
      </nav>

      <PixelLabel as="p" className="mt-5 !text-[9px] leading-[1.6] text-ink-faint">
        © 2026 FORTUNE PORTAL. ALL RIGHTS RESERVED.
      </PixelLabel>
    </footer>
  );
}
