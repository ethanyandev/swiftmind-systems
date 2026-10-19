# Cloudflare Pages 部署(2026-10-19 起)

官网从 AWS Amplify 迁到 Cloudflare Pages,与 savevia / ethanyan-site 共用同一个 Cloudflare 账号,零托管费。

## 现状

- Pages 项目:`swiftmind-systems`,预览地址 https://swiftmind-systems.pages.dev
- 生产分支:`main`(本机构建后推 `dist/`,不走 Git 集成)
- 域名:swiftmindsystems.com 的 zone 在同一 Cloudflare 账号(NS maria/porter)
- 安全头:`public/_headers`(HSTS / nosniff / X-Frame-Options DENY / Referrer-Policy;`/assets/*` 一年强缓存)
- www → 根域 301:zone 的 Redirect Rule「Redirect from WWW to root」(Pages 的 `_redirects` 不支持按主机名跳转,所以不用它)

## 发版

```bash
npm test && npm run build          # 本地检查:73 个 vitest 用例 + 构建
DEPLOY_BRANCH=preview scripts/deploy.sh   # 先发预览:https://preview.swiftmind-systems.pages.dev
scripts/deploy.sh                  # 终审通过后发生产
```

Lighthouse(桌面):`npm run preview &` 然后 `npx -y lighthouse http://localhost:4173/ --preset=desktop --only-categories=performance,accessibility --quiet --chrome-flags="--headless=new"`。
首屏静态帧:引擎参数改过后跑 `npm run build && npm run capture:hero` 重新生成 `public/hero-still.webp`。

脚本做的事:读 `~/.config/savevia/env` 里的 `SAVEVIA_CF_ACCOUNT_ID` / `SAVEVIA_CF_PAGES_TOKEN`,`npm ci && npm run build`,`wrangler pages deploy dist`。

### 坑

1. **Cloudflare API 不能走 Clash 代理**,脚本里已 `unset` 全部代理变量;装 wrangler 的 `npx` 仍可走代理。
2. **wrangler ≥ 4.150 会把 `pages project create` 转成 Workers 部署**:需要 Workers 权限(现有 token 没有),
   还会改写 `package.json` / `vite.config.js` / `package-lock.json` 并生成 `wrangler.jsonc`、`.wrangler/deploy/config.json`。
   项目已用 `--force` 按传统 Pages 建好,之后 `pages deploy` 不再被转;若哪天又出现这些文件,直接 `git checkout` 回滚并删掉。
3. 三个 savevia token 都**没有 swiftmindsystems.com 的 DNS 权限**(`SAVEVIA_CF_DEPLOY_TOKEN` 只限 savevia.app zone),改 DNS 要在面板手动或另发 token。

## 域名切换(2026-10-19 已完成)

1. Pages 项目 → Custom domains 添加根域和 www;同账号 zone,Cloudflare 自动把原 CloudFront CNAME 改成
   `CNAME → swiftmind-systems.pages.dev` 橙云
2. SSL/TLS 由 Automatic 改为 **Full (strict)**
3. Rules → Redirect Rules 用模板「Redirect from WWW to root」建 301(保留 query string)
4. 验证通过:根域 200 `server: cloudflare` + HSTS;`www/?a=1` 301 → 根域带 query;http → https 301

## Amplify 下线(2026-10-19 已完成)

Amplify 应用 `d2ta1enr2l7er5`(ca-central-1)已删除,DNS 里两条 ACM 验证 CNAME 已删,仓库 `amplify.yml` / `DEPLOYMENT.md` 已移除。
回滚只能重建 Amplify,实际已无必要:Pages 自身可回滚到任意历史 deployment。

