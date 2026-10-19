#!/usr/bin/env bash
# 官网发版:本机构建 → wrangler 推到 Cloudflare Pages 项目 swiftmind-systems(与 savevia 共用同一 CF 账号与 token)。
# 用法 scripts/deploy.sh
# 凭据来自 ~/.config/savevia/env(SAVEVIA_CF_ACCOUNT_ID / SAVEVIA_CF_PAGES_TOKEN)。
# 坑:① Cloudflare API 走 Clash 代理会挂,这里强制直连;② wrangler ≥4.150 会把 pages 命令转成 Workers 部署
#     (token 没 Workers 权限,还会改写 package.json/vite.config),必须 --force 走传统 Pages。
set -euo pipefail
cd "$(dirname "$0")/.."
set -a; . "$HOME/.config/savevia/env"; set +a
export CLOUDFLARE_ACCOUNT_ID="$SAVEVIA_CF_ACCOUNT_ID"
export CLOUDFLARE_API_TOKEN="$SAVEVIA_CF_PAGES_TOKEN"
unset http_proxy https_proxy all_proxy HTTP_PROXY HTTPS_PROXY ALL_PROXY
npm ci
npm run build
npx -y wrangler@4.151.1 pages deploy dist --project-name swiftmind-systems --branch main --commit-dirty=true
echo "web deployed: $(date)"
