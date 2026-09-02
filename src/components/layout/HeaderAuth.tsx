"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "@/lib/session";

/** 헤더 우측 — 로그인 전에만 버튼을 둔다. 로그인 뒤에는 메뉴가 계정을 맡는다 */
export function HeaderAuth() {
  const { session } = useSession();
  const pathname = usePathname();

  if (session) return <span className="size-9 shrink-0" aria-hidden="true" />;

  return (
    <Link
      href={`/login/?next=${encodeURIComponent(pathname)}`}
      className="flex h-9 shrink-0 items-center rounded-win border border-[#ff8ec7] bg-white px-3 text-[13px] font-semibold text-brand-pink transition-colors hover:bg-[#ffeef7]"
    >
      로그인
    </Link>
  );
}
