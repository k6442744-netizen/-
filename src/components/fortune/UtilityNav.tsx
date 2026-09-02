import Link from "next/link";
import { Icon, type IconName } from "@/components/ui/Icon";
import { KAKAO_CHANNEL_URL } from "@/lib/links";

const items: {
  icon: IconName;
  label: string;
  href: string;
  /** 카카오 채널처럼 서비스 밖으로 나가는 링크 */
  external?: boolean;
}[] = [
  { icon: "notice", label: "공지사항", href: "/notice" },
  { icon: "guide", label: "이용안내", href: "/guide" },
  { icon: "review", label: "후기보기", href: "/reviews" },
  { icon: "faq", label: "FAQ", href: "/faq" },
  {
    icon: "chat",
    label: "1:1 문의",
    href: KAKAO_CHANNEL_URL,
    external: true,
  },
];

const linkClass =
  "flex min-h-[52px] items-center gap-2.5 px-4 text-[14px] font-medium text-ink transition-colors hover:bg-page-pink";

/** Utility Nav (§13) — 마지막 항목은 2열 그리드에서 전체 폭을 차지한다. */
export function UtilityNav() {
  return (
    <nav aria-label="고객지원" className="rounded-win border border-line bg-white shadow-card">
      <ul className="grid grid-cols-2">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li
              key={item.label}
              className={`${isLast ? "col-span-2" : ""} ${
                !isLast && i % 2 === 0 ? "border-r border-silver" : ""
              } ${i < items.length - 1 ? "border-b border-silver" : ""}`}
            >
              {item.external ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  <Icon
                    name={item.icon}
                    size={18}
                    className="shrink-0 text-brand-lav"
                  />
                  {item.label}
                </a>
              ) : (
                <Link href={item.href} className={linkClass}>
                  <Icon
                    name={item.icon}
                    size={18}
                    className="shrink-0 text-brand-lav"
                  />
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
