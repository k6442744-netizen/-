/**
 * public/ 에셋 경로에 basePath를 붙인다.
 * `next/image`는 basePath를 자동으로 붙이지만 순수 <img> 태그는 붙지 않는다.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const asset = (path: string) => `${basePath}${path}`;
