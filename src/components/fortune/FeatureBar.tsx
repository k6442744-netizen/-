import { Icon, type IconName } from "@/components/ui/Icon";

interface Feature {
  icon: IconName;
  title: string;
  desc: string;
  color: string;
}

/** Feature Bar (§12-2) — 간편결제 / 즉시확인 / 비밀보장 / 후기 */
const features: Feature[] = [
  { icon: "heart", title: "간편 결제", desc: "카드, 간편결제 OK", color: "text-brand-pink" },
  { icon: "globe", title: "즉시 확인", desc: "구매 후 바로 확인", color: "text-brand-lav" },
  { icon: "lock", title: "100% 비밀보장", desc: "안전한 상담 시스템", color: "text-[#4fb8e0]" },
  { icon: "star", title: "누적 후기 10만+", desc: "많은 분들이 찾고 있어요", color: "text-brand-pink" },
];

export function FeatureBar() {
  return (
    <section
      aria-label="서비스 특징"
      className="overflow-hidden rounded-win border border-line bg-white shadow-card"
    >
      <ul className="grid grid-cols-2">
        {features.map((f, i) => (
          <li
            key={f.title}
            className={`flex items-center gap-2.5 px-3 py-3.5 ${
              i % 2 === 0 ? "border-r border-silver" : ""
            } ${i < 2 ? "border-b border-silver" : ""}`}
          >
            <Icon name={f.icon} size={20} className={`shrink-0 ${f.color}`} />
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold leading-tight text-ink">
                {f.title}
              </p>
              <p className="mt-1 truncate dot-text text-[12px] leading-tight text-ink-soft">
                {f.desc}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
