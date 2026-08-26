import { Icon, type IconName } from "@/components/ui/Icon";

const items: { icon: IconName; label: string }[] = [
  { icon: "notice", label: "공지사항" },
  { icon: "guide", label: "이용안내" },
  { icon: "review", label: "후기보기" },
  { icon: "faq", label: "FAQ" },
  { icon: "chat", label: "1:1 문의" },
];

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
              <a
                href="#"
                className="flex min-h-[52px] items-center gap-2.5 px-4 text-[14px] font-medium text-ink transition-colors hover:bg-page-pink"
              >
                <Icon name={item.icon} size={18} className="shrink-0 text-brand-lav" />
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
