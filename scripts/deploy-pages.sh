#!/usr/bin/env bash
# GitHub Pages 수동 배포 — out/ 을 gh-pages 브랜치로 강제 푸시한다.
# (토큰에 workflow 스코프가 생기면 .github/workflows/deploy.yml 로 자동화 가능)
set -euo pipefail

REPO_URL="https://github.com/k6442744-netizen/-.git"
REPO_NAME="-"

cd "$(dirname "$0")/.."

echo "▸ static export 빌드 (basePath=/$REPO_NAME)"
NEXT_PUBLIC_BASE_PATH="/$REPO_NAME" \
  NEXT_PUBLIC_SITE_URL="https://k6442744-netizen.github.io/$REPO_NAME" \
  pnpm build

echo "▸ gh-pages 브랜치 푸시"
cd out
rm -rf .git
git init -q -b gh-pages
git add -A
git commit -q -m "Deploy FORTUNE PORTAL static export"
git push -q --force "$REPO_URL" gh-pages

echo "✓ https://k6442744-netizen.github.io/$REPO_NAME/"
