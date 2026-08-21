import type { NextConfig } from "next";

/**
 * GitHub Pages(정적 호스팅) 배포용 설정.
 * 프로젝트 페이지는 `https://<user>.github.io/<repo>/` 아래에 서빙되므로
 * CI에서 `NEXT_PUBLIC_BASE_PATH=/<repo>` 를 주입한다. 로컬 dev에서는 비어 있다.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  // 정적 export에서는 next/image 최적화 서버를 쓸 수 없다
  images: { unoptimized: true },
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,
};

export default nextConfig;
