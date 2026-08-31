import Link from "next/link";
import { DotLabel } from "@/components/y2k/DotLabel";
import { Icon } from "@/components/ui/Icon";

/** 서브 페이지 헤더 — 뒤로가기 + Pixel Font 화면 라벨 */
export function SubHeader({
  title,
  backHref = "/",
}: {
  /** 화면 제목 (한글, 페이퍼로지) */
  title: string;
  backHref?: string;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-silver bg-page/95 backdrop-blur-[6px]">
      <div className="relative flex h-14 items-center px-[calc(var(--page-padding)-8px)]">
        <Link
          href={backHref}
          aria-label="뒤로 가기"
          className="flex size-11 items-center justify-center rounded-win text-ink transition-colors hover:bg-page-lav"
        >
          <Icon name="chevron-left" size={20} />
        </Link>

        <h1 className="pointer-events-none absolute inset-x-0 text-center">
          <DotLabel className="text-[16px] text-ink">{title}</DotLabel>
        </h1>
      </div>
    </header>
  );
}
