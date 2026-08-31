# FORTUNE PORTAL

모바일 웹 전용(최소 360px / 최대 420px) 사주 서비스.

- 디자인 시스템 원본: `DESIGN_SYSTEM.md` — 색/타이포/여백/컴포넌트 규칙은 항상 여기를 먼저 확인
- 구현 규칙 요약: `README.md`
- 토큰은 `src/app/globals.css` 한 곳에서만 정의. 하드코딩 색상값 금지
- 폰트는 페이퍼로지(Paperlogy) 한 계열. 역할 구분은 굵기·크기·자간으로만 하고 다른 서체를 추가하지 않는다
- 3D 에셋이 없으면 `FortuneObject` placeholder 유지 (임의 일러스트 추가 금지)

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
