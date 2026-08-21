import Link from "next/link";
import { FortuneObject, type ObjectName } from "./FortuneObject";
import { testTypes } from "@/lib/products";

/**
 * 테스트 종류 카테고리 메뉴 — 누르면 해당 종류 목록 페이지로 이동한다.
 * 2000년대 포털의 바로가기 아이콘 열 문법.
 */
export function TestTypeMenu() {
  return (
    <nav aria-label="테스트 종류">
      <ul className="grid grid-cols-4 gap-2">
        {testTypes.map((type) => (
          <li key={type.slug}>
            <Link
              href={`/tests/${type.slug}`}
              className="group flex flex-col items-center gap-1.5 py-1"
            >
              <span
                /* 아이콘 뒤 아주 옅은 바탕 */
                className="mx-auto flex aspect-square w-[72px] items-center justify-center rounded-win bg-[#f9f5f9] transition-transform duration-200 ease-out group-hover:-translate-y-1 group-active:translate-y-0 group-active:scale-95"
              >
                {/* 흰 배경 위에 오브젝트만 — 원본 렌더의 잔여 흰색은 multiply로 사라진다 */}
                <FortuneObject
                  name={type.object as ObjectName}
                  src={type.image}
                  alt=""
                  size={58}
                  className="mix-blend-multiply"
                />
              </span>
              <span className="dot-text text-[13px] font-bold leading-tight text-ink">
                {type.id}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
