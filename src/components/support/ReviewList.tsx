import { DotLabel } from "@/components/y2k/DotLabel";
import { toneText } from "@/lib/tone";
import { findProduct } from "@/lib/products";
import { reviews } from "@/lib/support";

const average =
  Math.round(
    (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10,
  ) / 10;

/** 별점 — 채운 별과 빈 별로 5개를 채운다 */
function Stars({ rating, size = 13 }: { rating: number; size?: number }) {
  return (
    <span
      aria-label={`5점 만점에 ${rating}점`}
      className="flex shrink-0 items-center gap-px"
      style={{ fontSize: size }}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          aria-hidden="true"
          className={n <= rating ? "text-brand-pink" : "text-silver"}
        >
          ★
        </span>
      ))}
    </span>
  );
}

/** 후기 — 상품별로 실제 이용자가 남긴 한 줄 */
export function ReviewList() {
  return (
    <>
      <section className="flex items-center gap-4 rounded-win border border-line bg-white px-4 py-4 shadow-card">
        <div className="text-center">
          <p className="dot-title text-[30px] leading-none text-ink">
            {average}
          </p>
          <Stars rating={Math.round(average)} size={12} />
        </div>
        <div className="min-w-0 flex-1 border-l border-silver pl-4">
          <p className="text-[14px] font-bold text-ink">
            총 {reviews.length}개의 후기
          </p>
          <p className="mt-1 dot-text text-[13px] leading-[1.6] text-ink-soft">
            운세를 본 뒤 남겨 주신 이야기예요.
          </p>
        </div>
      </section>

      <ul className="mt-4 space-y-2.5">
        {reviews.map((review) => {
          const product = findProduct(review.productId);
          return (
            <li
              key={review.id}
              className="rounded-win border border-line bg-white px-4 py-3.5 shadow-card"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2">
                  <Stars rating={review.rating} />
                  <span className="text-[14px] font-bold text-ink">
                    {review.name}
                  </span>
                </span>
                <span className="dot-text text-[12px] text-ink-faint">
                  {review.date}
                </span>
              </div>

              {product ? (
                <DotLabel
                  className={`mt-1.5 inline-block rounded-tag border border-line px-1.5 py-px text-[11px] ${toneText[product.tone]}`}
                >
                  {product.name}
                </DotLabel>
              ) : null}

              <p className="mt-2 dot-text text-[14px] leading-[1.75] text-ink-body">
                {review.body}
              </p>
            </li>
          );
        })}
      </ul>
    </>
  );
}
