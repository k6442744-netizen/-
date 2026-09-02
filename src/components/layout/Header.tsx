import Link from "next/link";
import { PixelDecoration } from "@/components/y2k/PixelDecoration";
import { PixelLabel } from "@/components/y2k/PixelLabel";
import { MobileMenu } from "./MobileMenu";
import { HeaderAuth } from "./HeaderAuth";

/** 좌: 메뉴 / 중앙: 로고 / 우: 로그인 */
export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-silver bg-page/95 backdrop-blur-[6px]">
      <div className="relative flex h-14 items-center justify-between px-[calc(var(--page-padding)-8px)]">
        <MobileMenu />

        <Link
          href="/"
          aria-label="FORTUNE PORTAL 홈"
          className="absolute left-1/2 flex -translate-x-1/2 items-center gap-1.5"
        >
          <PixelDecoration shape="star" size={11} className="text-[#ffa6d2]" />
          <PixelLabel className="!text-[15px] font-bold tracking-[0.03em] text-[#ff8ec7]">
            FORTUNE PORTAL
          </PixelLabel>
          <PixelDecoration shape="star" size={11} className="text-[#ffa6d2]" />
        </Link>

        <HeaderAuth />
      </div>
    </header>
  );
}
