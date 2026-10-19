# SwiftMind 官网重写 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 swiftmindsystems.com 从通用 SaaS 模板重写成「黑白粒子首屏 + 硬网格版式」的单页官网,中英双语,Cloudflare Pages 静态部署。

**Architecture:** 仍是 Vite 单页 React 应用。`src/translations.js` + `src/data/products.js` 是唯一内容源;页面由 7 个 section 组件顺序组成;首屏粒子引擎是独立的纯 JS 模块 `src/engine/waveField.js`,由 `HeroEngine.jsx` 通过 `React.lazy` 懒加载并按 `canRunEngine()` 门控,引擎缺席时首屏靠 CSS 层 + 静态 WebP 完整可读。

**Tech Stack:** React 19 · Vite 7 · Tailwind 4(`@theme` tokens)· GSAP 3 + `@gsap/react` · three(懒加载)· vitest + jsdom + @testing-library/react · sharp(脚本)· playwright-core(截图脚本)

**Spec:** `docs/superpowers/specs/2026-10-19-site-redesign-design.md`

## Global Constraints

- 背景 `#0A0A0B`,前景 `#F2F2F0`,点缀色唯一 `#FF5A1F`;代码里不得出现 `#fff`/`#ffffff`/`#000`/`#000000`。
- 字体:Space Grotesk 700(英文标题)、JetBrains Mono 400/500(等宽)、中文走系统栈 `"PingFang SC","Hiragino Sans GB","Noto Sans CJK SC","Microsoft YaHei",sans-serif`;不加载中文网络字体。
- 禁用:渐变文字、`backdrop-filter` 玻璃卡(导航滚动后的 blur 除外)、发光 box-shadow、图标卡片网格、marquee。
- 文案禁用词(zh):赋能、引领、卓越、一站式、创新科技;英文字符串不得含 em-dash `—`;任何字符串不得含 `\d+%` 或 `$\d`(假精确数字)。
- 全页眉题(小号大写标签)只允许 Manifesto 一处。
- 产品状态真实:SaveVia=`live`,Moodtini=`development`,VAMerchant/SkillGrove=`retired`(Archive,无链接无截图)。
- 引擎门控:视口宽 < 768、`prefers-reduced-motion: reduce`、WebGL 不可用三者任一 → 不加载 three。DPR 上限 1.5。
- 首屏 JS(不含 three chunk)gzip < 120KB;Lighthouse 桌面 性能 ≥ 90、可访问性 ≥ 90。
- 所有 `<img>` 带 `alt`、`width`、`height`;触控目标 ≥ 44px;焦点环 `2px solid #FF5A1F` 外描边。
- 提交信息英文,末尾带 `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`;不 push,由用户决定。

## Review Focus

1. **窄视口 + 引擎已挂载后缩窗**:桌面加载后把窗口缩到 700px,引擎应继续运行或安全暂停,不得报错、不得留下错尺寸画布。→ Task 6 测试 `resize keeps canvas size in sync`。
2. **语言切换后 `<html lang>` 与所有可见字符串同步**:切到 EN 后页面不得残留中文(包括 `aria-label`、按钮)。→ Task 3 测试 `every key has zh and en`,Task 11 测试 `no zh characters rendered in en mode`。
3. **键盘用户打开移动菜单**:Tab 到菜单按钮、Enter 打开、Esc 关闭、焦点回到按钮。→ Task 4 测试。
4. **WebGL 创建失败(例如显卡黑名单)**:`import('three')` 成功但 `WebGLRenderer` 构造抛错时,首屏必须保持静态图而不是白屏。→ Task 6 测试 `engine factory throwing leaves fallback visible`。
5. **mailto 在没有邮件客户端的浏览器里什么都不发生**:邮箱必须以明文出现且可选中复制。→ Task 9 测试 `email address rendered as text`。

---

### Task 1: 测试基建与模板残留清理

**Files:**
- Modify: `package.json`(scripts `test`、`test:watch`;devDependencies 新增 `vitest`、`jsdom`、`@testing-library/react`、`@testing-library/jest-dom`、`@testing-library/user-event`)
- Modify: `vite.config.js`(加 `test: { environment: 'jsdom', setupFiles: './src/test/setup.js', globals: true }`)
- Create: `src/test/setup.js`(`import '@testing-library/jest-dom/vitest'`)
- Create: `src/test/renderWithProviders.jsx`
- Delete: `src/counter.ts`、`src/main.ts`、`src/style.css`、`src/typescript.svg`、`src/contexts/ThemeContext.jsx`、`src/components/ThemeSwitch.jsx`、`src/components/CoreValues.jsx`、`src/components/Logo.jsx`、`src/components/LanguageSwitch.jsx`、`tsconfig.json`(项目是 JSX,无 TS 源)
- Modify: `src/App.jsx`(去掉 `ThemeProvider`,暂时只渲染 `<LanguageProvider><div id="app" /></LanguageProvider>`,旧组件 import 全部移除;旧组件文件 Navbar/Hero/Products/About/Footer 先保留,后续任务逐个重写覆盖)

**Interfaces:**
- Produces: `renderWithProviders(ui, { language = 'zh' } = {})` → `@testing-library/react` 的 render 结果;内部用 `LanguageProvider` 包裹并通过 `initialLanguage` prop 设初始语言(该 prop 在 Task 3 加入 `LanguageProvider`,本任务先按 `LanguageProvider` 现状包裹即可)。

- [ ] **Step 1: 安装依赖**

Run: `npm i -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event`

- [ ] **Step 2: 写一个冒烟测试**

`src/test/smoke.test.jsx`:
```jsx
import { render, screen } from '@testing-library/react'
import App from '../App'
test('app mounts', () => { render(<App />); expect(document.getElementById('app')).toBeInTheDocument() })
```

- [ ] **Step 3: 跑测试确认失败**(`vite.config.js` 还没有 test 配置、App 还引用 ThemeProvider)

Run: `npx vitest run`
Expected: FAIL

- [ ] **Step 4: 加 vitest 配置、setup 文件、改 App.jsx、删除残留文件**

- [ ] **Step 5: 跑测试与构建**

Run: `npx vitest run && npm run build`
Expected: 1 passed;build 成功。

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "chore: add vitest and remove template leftovers"
```

---

### Task 2: 设计 token、字体与质感层

**Files:**
- Modify: `index.html`(`<html lang="zh-CN">`;`<head>` 加 Google Fonts `Space+Grotesk:wght@700` 与 `JetBrains+Mono:wght@400;500`,`display=swap`;`<meta name="theme-color" content="#0A0A0B">`;`<title>SwiftMind Systems</title>`;`<meta name="description">` 文案取 Task 3 的 `meta.description.zh`,先写中文)
- Rewrite: `src/index.css`
- Delete: `tailwind.config.js`(Tailwind 4 用 CSS `@theme`,不需要)
- Test: `src/test/tokens.test.js`

**Interfaces:**
- Produces(CSS 自定义属性,全站引用):`--bg: #0A0A0B; --fg: #F2F2F0; --fg-muted: #9A9A96; --accent: #FF5A1F; --line: rgba(255,255,255,.1); --line-strong: rgba(255,255,255,.18); --font-display: "Space Grotesk", <中文栈>; --font-mono: "JetBrains Mono", ui-monospace, monospace; --font-body: <中文栈>`。
- Produces(工具类):`.display`(`font-family: var(--font-display); font-weight: 700; letter-spacing: -.03em; line-height: .92;` 且 `:lang(zh-CN)` 下 `font-weight: 600; letter-spacing: 0; line-height: 1.15`)、`.mono`(等宽、`font-size: .8125rem`、`letter-spacing: .02em`)、`.eyebrow`(`.mono` + 大写 + `letter-spacing: .18em` + `color: var(--fg-muted)`)、`.btn-primary`(橙底、`color: var(--bg)`、高 48px、`padding: 0 1.5rem`、无圆角 2px)、`.btn-link`(前景色文字 + 橙色 1px 下划线 hover 加粗)、`.hairline`(`border-top: 1px solid var(--line)`)。
- Produces:`body::before` 固定定位的 feTurbulence 颗粒层,`opacity: .035`,`pointer-events: none`,`z-index: 1`;`.vignette`(径向渐变暗角,用于 Hero)。
- Produces:`:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px }`;`::selection` 橙底黑字;`html { scroll-behavior: smooth }` 在 `prefers-reduced-motion` 下为 `auto`。

- [ ] **Step 1: 写 token 测试**

`src/test/tokens.test.js`:读取 `src/index.css` 文本,断言:
```js
expect(css).toMatch(/--accent:\s*#FF5A1F/i)
expect(css).not.toMatch(/#fff\b|#ffffff|#000\b|#000000/i)
expect(css).not.toMatch(/background-clip:\s*text/)
expect(css).toMatch(/feTurbulence/)
expect(css).toMatch(/prefers-reduced-motion/)
expect(css).toMatch(/:focus-visible/)
```

- [ ] **Step 2: 跑测试确认失败**

Run: `npx vitest run src/test/tokens.test.js`
Expected: FAIL(现有 css 含 `#ffffff`、无 feTurbulence)

- [ ] **Step 3: 重写 `src/index.css`、改 `index.html`、删 `tailwind.config.js`**

`@import "tailwindcss";` 保留;token 放在 `@theme { --color-bg: #0A0A0B; ... }` 同时在 `:root` 暴露上面列出的短名变量。

- [ ] **Step 4: 跑测试与构建**

Run: `npx vitest run && npm run build`
Expected: PASS;build 成功。

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: design tokens, fonts and grain substrate"
```

---

### Task 3: 文案、产品数据与语言上下文

**Files:**
- Rewrite: `src/translations.js`(保留 `export const translations` 与 `export const t = (key, language)`;`t` 找不到 key 时返回 key 不变)
- Create: `src/data/products.js`
- Modify: `src/contexts/LanguageContext.jsx`
- Test: `src/test/copy.test.js`、`src/test/products.test.js`、`src/test/language.test.jsx`

**Interfaces:**
- Produces `translations` 顶层 key:`meta`、`nav`、`hero`、`manifesto`、`products`、`about`、`contact`、`footer`、`legal`;每个叶子都是 `{ zh, en }`。
- Produces `products.js`:
  ```js
  export const PRODUCTS = [
    { slug: 'savevia', status: 'live', order: 1,
      links: [{ kind: 'web', href: 'https://savevia.app' }, { kind: 'appstore', href: 'https://apps.apple.com/ca/app/id6756332569' }],
      screens: [{ src: '/screens/savevia-1.webp', w: 1290, h: 2796 }, { src: '/screens/savevia-2.webp', w: 1290, h: 2796 }] },
    { slug: 'moodtini', status: 'development', order: 2, links: [],
      screens: [{ src: '/screens/moodtini-1.webp', w: 1600, h: 1008 }] },
  ]
  export const ARCHIVE = [{ slug: 'vamerchant' }, { slug: 'skillgrove' }]
  export const STATUS = { live: 'live', development: 'development', retired: 'retired' }
  ```
  产品的 `name/tagline/description/features[]` 都从 `translations.products.<slug>` 取。
- Produces `LanguageProvider({ initialLanguage = 'zh', children })`,context 值 `{ language, setLanguage, toggleLanguage }`;`language` 变化时设置 `document.documentElement.lang`(zh→`zh-CN`,en→`en`),并写 `localStorage['lang']`,初始化时优先读 localStorage。
- Produces 定稿文案(写入 `translations.js`,英文字符串不得含 `—`):
  - `meta.description`:zh「SwiftMind Systems 是一家加拿大软件公司,自己设计、开发并上线 AI 产品。」en「SwiftMind Systems is a Canadian software company that designs, builds and ships its own AI products.」
  - `nav`:`products` 产品/Products;`about` 关于/About;`contact` 联系/Contact;`menu` 菜单/Menu;`close` 关闭/Close;`lang` 语言/Language。
  - `hero.title`(默认版,另两版写在 PR 描述里):zh「我们把 AI 做成能用的产品。」en「We turn AI into products people actually use.」;备选 B zh「少谈概念,多发版本。」en「Less talk about AI. More shipping.」;备选 C zh「软件工程,加上 AI,做成真产品。」en「Software engineering plus AI, shipped as real products.」
  - `hero.subtitle`:zh「加拿大的小团队,自己设计、自己写、自己上线。」en「A small team in Canada that designs, builds and ships its own products.」
  - `hero.cta`:看产品/See products;`hero.secondary`:联系我们/Contact us;`hero.tag`:`SwiftMind Systems Ltd. · Canada`(两语相同)。
  - `manifesto.eyebrow`:我们怎么做事/How we work;`manifesto.body`:zh「我们不做幻灯片里的 AI。每一个产品都从一个真实的麻烦开始,用模型和代码把它解决掉,然后交到用户手里。能上线的,才算数。」en「We don't build AI for slide decks. Every product starts with a real annoyance, gets solved with models and code, and goes into users' hands. If it doesn't ship, it doesn't count.」
  - `products.heading`:产品/Products;`products.status.live`:已上线/Live;`products.status.development`:开发中/In development;`products.status.retired`:已下线/Retired;`products.archiveHeading`:过去的产品/Archive;`products.links.web`:官网/Website;`products.links.appstore`:App Store(两语相同)。
  - `products.savevia`:`name` SaveVia;`tagline` zh「加拿大信用卡情报站」en「Credit card intelligence for Canada」;`description` zh「把各家银行的信用卡条款、返现和开卡奖励抓下来、读懂、放进一张表里,再让 AI 助手小维根据你的消费结构告诉你该刷哪张。」en「Pulls every Canadian bank's card terms, cashback rates and welcome offers into one place, then lets Xiaowei, the AI assistant, tell you which card to use based on how you spend.」;`features`:[每周自动更新的卡片库/Card library refreshed weekly, 按消费结构算收益/Earnings computed from your spending mix, AI 助手小维答疑/Xiaowei, an AI assistant for card questions, iOS App 与网页版/iOS app and web]。
  - `products.moodtini`:`name` Moodtini;`tagline` zh「按心情推荐鸡尾酒的 AI」en「Mood-based AI cocktail picks」;`description` zh「告诉它你现在的心情和场合,它从配方库里挑一杯最合适的,附调法。」en「Tell it your mood and the occasion; it picks a cocktail from the recipe library and shows you how to make it.」;`features`:[心情与场景输入/Mood and occasion input, 个性化推荐/Personalised recommendations, 调酒步骤/Step-by-step mixing]。
  - `products.vamerchant`:`name` VAMerchant;`tagline` zh「服务商预约与排班系统」en「Appointment and scheduling for service providers」。
  - `products.skillgrove`:`name` SkillGrove;`tagline` zh「线上课程平台」en「Online course platform」。
  - `about.heading`:关于/About;`about.body`:zh「SwiftMind Systems 是一家在加拿大注册的软件公司。我们自己出产品,也接少量定制开发;从需求、设计、后端、前端到上线,一条线做完。擅长的方向是把大模型接进真实业务:数据抓取与结构化、对话助手、推荐系统。」en「SwiftMind Systems is a software company registered in Canada. We build our own products and take on a small amount of custom work, covering the whole line from requirements and design to backend, frontend and launch. Our strength is wiring large language models into real workflows: data extraction and structuring, conversational assistants, recommendation systems.」;`about.principles`:[先上线,再打磨。/Ship first, then polish., 数字必须有来源。/Every number has a source., 代码自己写,不转包。/We write the code ourselves.];`about.line`:`SwiftMind Systems Ltd. · Canada · info@swiftmindsystems.com`。
  - `contact.heading`:zh「有想法?聊聊。」en「Have an idea? Let's talk.」;`contact.cta`:发邮件/Email us;`contact.email`:`info@swiftmindsystems.com`。
  - `footer.copyright`:`© 2026 SwiftMind Systems Ltd.`;`footer.privacy`:隐私政策/Privacy;`footer.terms`:服务条款/Terms;`footer.savevia`:`savevia.app`。
  - `legal.draft`:初稿,待审定/Draft, pending review。

- [ ] **Step 1: 写文案规则测试**

`src/test/copy.test.js`:递归遍历 `translations` 所有叶子,断言:
```js
// 每个叶子有非空 zh 与 en
// zh 字符串不含 /赋能|引领|卓越|一站式|创新科技/
// en 字符串不含 '—'
// 任何字符串不匹配 /\d+%|\$\d/
// t('hero.title','en') === 'We turn AI into products people actually use.'
// t('nope.key','zh') === 'nope.key'
```
`src/test/products.test.js`:
```js
// PRODUCTS 按 order 升序且 slug 唯一;每个 status ∈ STATUS
// status==='development' 的产品 links 为空
// 每个 screens[i] 有 src/w/h,src 以 '/screens/' 开头且 .webp 结尾
// ARCHIVE 的 slug 在 translations.products 里存在且没有 description 键
```
`src/test/language.test.jsx`:
```jsx
// renderWithProviders(<Probe/>, { language: 'en' }) 后 document.documentElement.lang === 'en'
// 调 toggleLanguage 后 lang === 'zh-CN' 且 localStorage.lang === 'zh'
```

- [ ] **Step 2: 跑测试确认失败**

Run: `npx vitest run src/test/copy.test.js src/test/products.test.js src/test/language.test.jsx`
Expected: FAIL

- [ ] **Step 3: 重写 translations.js、新建 products.js、改 LanguageContext.jsx、更新 renderWithProviders 传 `initialLanguage`**

- [ ] **Step 4: 跑全部测试**

Run: `npx vitest run`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: final copy, product data and language context"
```

---

### Task 4: 导航

**Files:**
- Create: `src/components/Nav.jsx`(覆盖并删除旧 `Navbar.jsx`)
- Test: `src/test/nav.test.jsx`

**Interfaces:**
- Produces `<Nav />`:固定顶部,高 64px,`z-index: 50`;左侧文字字标 `SwiftMind`(`.display`,`font-size: 1.125rem`,链到 `#top`);桌面右侧三个锚链接(`#products` `#about` `#contact`,`.mono`)+ 语言切换按钮(容器 `<div data-lang-toggle>` 内两个按钮 `中`(`aria-label="Chinese"`)与 `EN`(`aria-label="English"`),当前项 `aria-pressed="true"` 且橙色);`window.scrollY > 8` 时加 class `is-scrolled`(`backdrop-filter: blur(12px)` + 底部 `hairline`)。
- 移动端(< 768):右侧只剩菜单按钮(`aria-expanded`、`aria-controls="nav-menu"`),点开为全屏层 `#nav-menu`(`.display` 大号列表,三个锚 + 语言切换),Esc 关闭并把焦点还给按钮;打开时 `body` 加 `overflow: hidden`。
- 使用 `t('nav.*', language)`。

- [ ] **Step 1: 写测试**

`src/test/nav.test.jsx`:
```jsx
// 渲染后存在 link name 'SwiftMind' 和三个锚(href '#products' '#about' '#contact')
// 语言 zh 时按钮 '中' aria-pressed true;点击 'EN' 后 document.documentElement.lang === 'en' 且链接文本变为 'Products'
// 菜单按钮:userEvent.keyboard('{Enter}') 后 aria-expanded true 且 #nav-menu 可见;'{Escape}' 后 aria-expanded false 且 document.activeElement 为菜单按钮
```

- [ ] **Step 2: 跑测试确认失败**

Run: `npx vitest run src/test/nav.test.jsx`
Expected: FAIL(模块不存在)

- [ ] **Step 3: 实现 `Nav.jsx`,删除 `Navbar.jsx`,在 `App.jsx` 中挂载 `<Nav />`**

- [ ] **Step 4: 跑测试**

Run: `npx vitest run`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: nav with language toggle and mobile menu"
```

---

### Task 5: 首屏静态层与引擎门控

**Files:**
- Create: `src/lib/motion.js`
- Create: `src/components/Hero.jsx`(覆盖并删除旧 `Hero.jsx`)
- Create: `public/hero-still.webp`(本任务先放占位:用 sharp 生成 1600×1000 纯色 `#0A0A0B` WebP,Task 6 替换为真图)
- Test: `src/test/motion.test.js`、`src/test/hero.test.jsx`

**Interfaces:**
- Produces `motion.js`:
  - `prefersReducedMotion(win = window) → boolean`
  - `hasWebGL(doc = document) → boolean`(创建 canvas 试 `getContext('webgl2') || getContext('webgl')`,异常返回 false)
  - `canRunEngine({ width, reduced, webgl }) → boolean`(纯函数:`width >= 768 && !reduced && webgl`)
  - `useCanRunEngine() → boolean`(hook:首次挂载时综合上面三者;监听 `resize` 以 200ms 防抖重算 width 条件)
- Produces `<Hero />`:`<section id="top" class="hero">` 高 `100dvh`,`position: relative`,背景层顺序:`<img src="/hero-still.webp" alt="" width=1600 height=1000 class="hero-still">`(`object-fit: cover`,绝对定位,`z 0`)→ 引擎插槽 `<div class="hero-engine" />`(Task 6 填充,`z 0`)→ `.vignette`(`z 2`)→ 内容(`z 5`):左下对齐,`h1.display` 文案 `hero.title`,`p` `hero.subtitle`,`a.btn-primary[href="#products"]` `hero.cta`,`a.btn-link[href="#contact"]` `hero.secondary`;右下角 `.mono` `hero.tag`。
- `h1` 字号 `clamp(2.4rem, 7.5vw, 7rem)`;内容区 `max-width: 72rem`,左右 `padding: clamp(1rem, 4vw, 3rem)`。

- [ ] **Step 1: 写测试**

`src/test/motion.test.js`:
```js
// canRunEngine({width:1280,reduced:false,webgl:true}) === true
// width 767 → false;reduced true → false;webgl false → false
// hasWebGL 传入 getContext 抛错的假 document → false
```
`src/test/hero.test.jsx`:
```jsx
// 渲染后 heading level 1 文本为 '我们把 AI 做成能用的产品。'(zh)
// 存在 link '看产品' href '#products' 与 link '联系我们' href '#contact'
// 存在 img src '/hero-still.webp' alt ''
```

- [ ] **Step 2: 跑测试确认失败**

Run: `npx vitest run src/test/motion.test.js src/test/hero.test.jsx`
Expected: FAIL

- [ ] **Step 3: 实现 `motion.js`、`Hero.jsx`,生成占位 `hero-still.webp`,挂到 `App.jsx`(Nav 之后)**

占位图命令:`npx -y sharp-cli`不稳定,改为临时 node 一行:`node -e "require('sharp')({create:{width:1600,height:1000,channels:3,background:'#0A0A0B'}}).webp().toFile('public/hero-still.webp')"`(sharp 在 Task 8 正式加入 devDependencies,此处先 `npm i -D sharp`)。

- [ ] **Step 4: 跑测试与构建**

Run: `npx vitest run && npm run build`
Expected: PASS;build 成功。

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: hero static layer and engine gating"
```

---

### Task 6: 粒子引擎、懒加载与静态帧脚本

**Files:**
- Create: `src/engine/waveField.js`
- Create: `src/components/HeroEngine.jsx`
- Modify: `src/components/Hero.jsx`(在 `.hero-engine` 插槽内按 `useCanRunEngine()` 懒加载 `HeroEngine`)
- Create: `scripts/capture-hero.mjs`
- Modify: `package.json`(dependencies 新增 `three`;devDependencies 新增 `playwright-core`;script `"capture:hero": "node scripts/capture-hero.mjs"`)
- Replace: `public/hero-still.webp`
- Test: `src/test/waveField.test.js`、`src/test/heroEngine.test.jsx`

**Interfaces:**
- Produces `createWaveField(canvas, { THREE, dpr = Math.min(devicePixelRatio, 1.5), reduced = false })` → `{ setPointer(nx, ny), setScroll(p), pause(), resume(), resize(w, h), dispose() }`;`THREE` 由调用方注入(便于测试注入假对象)。`nx, ny ∈ [-1, 1]`,`p ∈ [0, 1]`。`reduced=true` 时只渲染一帧不启动循环。
- 算法(构建者按此实现,参数可调):
  - 网格 `200 × 200` 点,平面 x ∈ [-800, 800],y ∈ [-500, 500];`THREE.Points` + `ShaderMaterial`,`transparent`,`depthWrite:false`,`blending: NormalBlending`。
  - 相机 `PerspectiveCamera(45, aspect, 1, 4000)`,位置 `(0, 260, 520)`,`lookAt(0, 0, 0)`。
  - 顶点着色器:uniforms `uTime, uPointer(vec2 世界坐标), uScroll, uDpr`;2D simplex noise(内联实现);
    `h = snoise(p.xy*0.0025 + uTime*0.08)*60.0 + snoise(p.xy*0.008 - uTime*0.12)*18.0;`
    `h += 40.0 * exp(-dot(p.xy-uPointer, p.xy-uPointer) / (200.0*200.0));`
    `gl_PointSize = uDpr * (1.2 + 1.6 * clamp((h+60.0)/140.0, 0.0, 1.0)) * (520.0 / -mv.z);`
    varying `vAlpha = 0.25 + 0.75 * clamp((h+60.0)/140.0, 0.0, 1.0)`。
  - 片元:圆点裁剪(`length(gl_PointCoord-0.5)>0.5 → discard`),颜色 `vec3(0.95)`,alpha `vAlpha * (1.0 - d*2.0)`。
  - `setPointer` 把 ndc 映射到平面坐标并做 `0.08` 系数的惯性插值;`setScroll(p)`:`camera.position.y = 260 + p*160`,`uTime` 速度乘 `(1 + p)`。
  - `resize` 更新 renderer 尺寸与相机 aspect;`dispose` 取消 raf、`geometry.dispose()`、`material.dispose()`、`renderer.dispose()`。
- Produces `<HeroEngine />`:`useEffect` 内 `import('three')` 后创建 canvas 到容器、调用 `createWaveField`;构造异常时 `console.warn` 并移除 canvas(静态图保持可见);`pointermove` 节流到 raf 更新 `setPointer`;`scroll` 用 `IntersectionObserver`(阈值 0)在首屏离开视口时 `pause()`、回来 `resume()`,滚动进度用 `scrollY / innerHeight` 钳到 [0,1] 传 `setScroll`;`resize` 监听;卸载 `dispose()`。canvas 淡入(`opacity 0→1`,600ms)。
- Produces `scripts/capture-hero.mjs`:`playwright-core` 以 `channel: 'chrome'` 启动本机 Chrome,`viewport 1600×1000`,`deviceScaleFactor 1`,打开 `http://localhost:4173/`(先 `npm run build && npm run preview` 由脚本自己拉起 `vite preview` 子进程),等待 `.hero-engine canvas` 出现并 `waitForTimeout(2500)`,截取 `.hero` 元素(把内容层 `.hero-content` 临时设 `visibility:hidden`),用 sharp 转 WebP `quality 80` 写入 `public/hero-still.webp`,关闭子进程。

- [ ] **Step 1: 写测试**

`src/test/waveField.test.js`:用假 `THREE`(记录构造调用、`WebGLRenderer.setSize/render/dispose` 为 vi.fn,`ShaderMaterial` 保存 uniforms)注入:
```js
// createWaveField 返回的对象含 setPointer/setScroll/pause/resume/resize/dispose 六个函数
// reduced:true 时 render 被调用恰好 1 次且未注册 requestAnimationFrame
// resize(800,600) 后 renderer.setSize 以 (800,600,false) 被调
// setScroll(1) 后 camera.position.y === 420
// dispose() 后 renderer.dispose、geometry.dispose、material.dispose 各被调 1 次
```
`src/test/heroEngine.test.jsx`:mock `three` 模块为抛错的 `WebGLRenderer`:
```jsx
// 渲染 <Hero/> 并把 useCanRunEngine mock 为 true;等待后 .hero-engine 内没有 canvas,img.hero-still 仍在文档中,console.warn 被调
```

- [ ] **Step 2: 跑测试确认失败**

Run: `npx vitest run src/test/waveField.test.js src/test/heroEngine.test.jsx`
Expected: FAIL

- [ ] **Step 3: `npm i three && npm i -D playwright-core`;实现 `waveField.js`、`HeroEngine.jsx`,接入 `Hero.jsx`**

- [ ] **Step 4: 跑测试与构建,检查 chunk**

Run: `npx vitest run && npm run build`
Expected: PASS;build 输出里 three 为独立 chunk(文件名含 `three`),主 `index-*.js` gzip < 120KB。

- [ ] **Step 5: 浏览器实测**

Run: `npm run preview` 后用 Chrome 打开 `http://localhost:4173/`。
Expected:首屏出现白色粒子曲面并随鼠标起伏;DevTools Performance 录 5 秒,帧率 ≥ 55fps(达不到则把网格降到 160×160);Rendering 面板开启 `prefers-reduced-motion: reduce` 刷新后只显示静态图且无 canvas;把窗口缩到 700px 刷新后无 canvas。

- [ ] **Step 6: 写 `capture-hero.mjs` 并生成真图**

Run: `npm run capture:hero && ls -la public/hero-still.webp`
Expected:文件存在且 < 300KB;用图片查看器打开能看到粒子曲面。

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: three.js wave field hero engine with lazy load and still capture"
```

---

### Task 7: 宣言区

**Files:**
- Create: `src/components/Manifesto.jsx`
- Modify: `package.json`(devDependencies 无变化;dependencies 新增 `@gsap/react`)
- Test: `src/test/manifesto.test.jsx`

**Interfaces:**
- Produces `<Manifesto />`:`<section id="manifesto">`,两栏网格(`grid-template-columns: minmax(8rem, 1fr) 4fr`,< 768 单栏):左栏 `<p class="eyebrow">` `manifesto.eyebrow`(全站唯一眉题);右栏 `<p class="display manifesto-body">` 字号 `clamp(1.6rem, 3.6vw, 3.4rem)`,`manifesto.body` 按「词」拆成 `<span class="word">`(中文按字符、英文按空格拆;`aria-hidden` 包裹的拆分 span + 一个 `sr-only` 完整句子)。
- 动效:`useGSAP` + `ScrollTrigger`(`start: 'top 75%'`,once),`.word` 从 `opacity .15` 到 `1`,`stagger .018`;`prefersReducedMotion()` 为真时不注册动画、直接 `opacity 1`。
- Produces 工具函数 `splitWords(text, lang) → string[]` 放在 `src/lib/text.js`。

- [ ] **Step 1: 写测试**

`src/test/manifesto.test.jsx`:
```jsx
// splitWords('能上线的,才算数。','zh') 长度等于字符数且 join('') 还原原文
// splitWords('If it ships, it counts.','en') → ['If','it','ships,','it','counts.']
// 渲染后 sr-only 元素文本等于 manifesto.body.zh;eyebrow 文本 '我们怎么做事'
```

- [ ] **Step 2: 跑测试确认失败**

Run: `npx vitest run src/test/manifesto.test.jsx`
Expected: FAIL

- [ ] **Step 3: `npm i @gsap/react`;实现 `text.js`、`Manifesto.jsx`,挂到 App(Hero 之后)**

jsdom 下 `ScrollTrigger` 需要 `vi.mock('gsap/ScrollTrigger')`,在 `src/test/setup.js` 统一 mock。

- [ ] **Step 4: 跑测试**

Run: `npx vitest run`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: manifesto section with word reveal"
```

---

### Task 8: 产品区、Archive 与截图压缩脚本

**Files:**
- Create: `scripts/optimize-images.mjs`
- Create: `public/screens/savevia-1.webp`、`public/screens/savevia-2.webp`、`public/screens/moodtini-1.webp`
- Delete: `public/SaveVia/`、`public/VA/`、`public/skillgrove.png`、`public/vamerchant.png`、`public/moodtini.png`、`public/logo-transparent.png`、`public/*-logo.png`(保留 favicon 系列与 `site.webmanifest`)
- Create: `src/components/Products.jsx`(覆盖旧文件)、`src/components/ProductRow.jsx`
- Modify: `package.json`(script `"optimize:images": "node scripts/optimize-images.mjs"`;`sharp` 已在 devDependencies)
- Test: `src/test/products.test.jsx`(组件测试,与 Task 3 的数据测试同文件夹不同名:`productsView.test.jsx`)

**Interfaces:**
- Produces `scripts/optimize-images.mjs`:`node scripts/optimize-images.mjs <input...> --out public/screens --prefix <name>`,对每个输入文件 `sharp().resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 82 })` 写到 `<out>/<prefix>-<n>.webp`,打印尺寸。本任务实际调用:`node scripts/optimize-images.mjs public/SaveVia/1.png public/SaveVia/3.png --out public/screens --prefix savevia` 与 `... public/moodtini.png --prefix moodtini`(构建者可换成更能说明产品的两张手机截图,但输出文件名必须与 `products.js` 一致)。
- Produces `<Products />`:`<section id="products">`,标题 `h2.display` `products.heading`;遍历 `PRODUCTS` 渲染 `<ProductRow product index />`;其后 `h3.mono` `products.archiveHeading` + `<ul class="archive">`,每项 `.mono`:`name · tagline · <status>`(用 `products.status.retired`)。
- Produces `<ProductRow product index />`:`.hairline` 上边框,两栏(`5fr 7fr`,< 768 单栏且截图在上);左栏:`.mono` 编号 `String(index+1).padStart(2,'0')`、状态点 `<span class="dot" data-status>`(live=橙,development=灰)+ 状态文字、`h3.display` 名称、`p` tagline、`p` description、`ul` features(纯文本,无图标)、链接行(`a.btn-link` 外链 `target="_blank" rel="noopener"`,文案 `products.links.<kind>`;无链接时不渲染该行);右栏:`.shots` 容器,`screens` 每张 `<img loading="lazy" decoding="async" width height alt="{name} screenshot {n}">`,两张竖屏并排、单张横屏独占,容器 `transform: perspective(1200px) rotateY(-3deg)`,`useGSAP` ScrollTrigger `scrub` 做 `y: -24 → 24` 视差(reduced 时不注册)。
- 版式交替:index 为奇数时左右栏互换(`direction: rtl` 容器 + 子项 `direction: ltr`),避免视觉重复。

- [ ] **Step 1: 写测试**

`src/test/productsView.test.jsx`:
```jsx
// 渲染后 heading '产品';存在 heading 'SaveVia' 与 'Moodtini';不存在 heading 'VAMerchant'
// SaveVia 行内有 link '官网' href 'https://savevia.app' target '_blank' rel 包含 'noopener',以及 link 'App Store'
// Moodtini 行内没有任何 link;状态文字 '开发中'
// archive 列表有 2 个 li,文本包含 'VAMerchant' 与 '已下线'
// 所有 img 都有非空 alt、width、height,且 src 以 '/screens/' 开头
```

- [ ] **Step 2: 跑测试确认失败**

Run: `npx vitest run src/test/productsView.test.jsx`
Expected: FAIL

- [ ] **Step 3: 写 `optimize-images.mjs`,生成三张 WebP,`git rm` 旧图目录与 logo 图**

Run: `ls -la public/screens && du -sh public`
Expected:三张 webp 每张 < 400KB;`public` 总大小 < 2MB。

- [ ] **Step 4: 实现 `Products.jsx`、`ProductRow.jsx`,挂到 App(Manifesto 之后)**

- [ ] **Step 5: 跑测试与构建**

Run: `npx vitest run && npm run build`
Expected: PASS;build 成功。

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: products section, archive strip and image pipeline"
```

---

### Task 9: 关于、联系与页脚

**Files:**
- Create: `src/components/About.jsx`(覆盖旧文件)、`src/components/Contact.jsx`、`src/components/Footer.jsx`(覆盖旧文件)
- Test: `src/test/aboutContactFooter.test.jsx`

**Interfaces:**
- Produces `<About />`:`<section id="about">`,`h2.display` `about.heading`;两栏(`7fr 5fr`,< 768 单栏):左 `p` `about.body`(行高 1.8);右 `ul.principles` 三条 `li.display`(字号 `clamp(1.25rem, 2vw, 1.75rem)`,每条上方 `.hairline`);底部 `.mono` 一行 `about.line`。
- Produces `<Contact />`:`<section id="contact">`,`h2.display` 字号 `clamp(2.6rem, 9vw, 8rem)` `contact.heading`;其下一行:`a.btn-primary[href="mailto:info@swiftmindsystems.com"]` `contact.cta` + `<code class="mono email">` 明文 `contact.email`(`user-select: all`)。
- Produces `<Footer />`:`.hairline`,`.mono`,两端对齐:左 `footer.copyright`;右三个链接:`https://savevia.app`(外链)、`/privacy.html`(`footer.privacy`)、`/terms.html`(`footer.terms`)。< 768 时上下堆叠。
- 三个组件进入视口时 `useGSAP` 做一次 `opacity 0→1, y 24→0`(reduced 时跳过)。

- [ ] **Step 1: 写测试**

`src/test/aboutContactFooter.test.jsx`:
```jsx
// About:heading '关于';列表 3 项,第 1 项文本 '先上线,再打磨。'
// Contact:heading '有想法?聊聊。';link '发邮件' href 'mailto:info@swiftmindsystems.com';存在文本 'info@swiftmindsystems.com' 的 code 元素
// Footer:文本 '© 2026 SwiftMind Systems Ltd.';link '隐私政策' href '/privacy.html';link '服务条款' href '/terms.html';link 'savevia.app' href 'https://savevia.app'
```

- [ ] **Step 2: 跑测试确认失败**

Run: `npx vitest run src/test/aboutContactFooter.test.jsx`
Expected: FAIL

- [ ] **Step 3: 实现三个组件,挂到 App(Products 之后,顺序 About → Contact → Footer)**

- [ ] **Step 4: 跑测试**

Run: `npx vitest run`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: about, contact and footer sections"
```

---

### Task 10: 隐私政策与服务条款静态页

**Files:**
- Create: `public/privacy.html`、`public/terms.html`、`public/legal.css`
- Test: `src/test/legalPages.test.js`

**Interfaces:**
- 两页为独立 HTML(不走 React):`<html lang="zh-CN">`,引用 `/legal.css`(复用 Task 2 的 token 值与字体,`max-width: 68ch`,`.mono` 页眉链接回 `/`),顶部 `<p class="mono">` 显示「初稿,待审定 · Draft, pending review」与日期 `2026-10-19`。
- 内容结构(中文在前,英文在后,同页两段):
  - 隐私政策:我们是谁(SwiftMind Systems Ltd.,加拿大;本站 swiftmindsystems.com)/ 本网站收集什么(本站为静态页面,不设账号、不埋点、不使用 Cookie;托管在 Cloudflare,Cloudflare 会记录访问日志用于安全与限流)/ 邮件联系(你发邮件给 info@swiftmindsystems.com 时我们保存该往来邮件用于回复)/ 各产品有各自的隐私政策(SaveVia 见 savevia.app)/ 联系方式。
  - 服务条款:本站内容仅作介绍;产品的使用条款以各产品页面为准;商标与内容归 SwiftMind Systems Ltd.;免责(内容可能过期,不构成任何承诺);适用法律为加拿大不列颠哥伦比亚省;联系方式。
- 两页都不得出现 `—`、假数字,正文字体走系统中文栈。

- [ ] **Step 1: 写测试**

`src/test/legalPages.test.js`:读取两个 html 文本:
```js
// 都包含 'lang="zh-CN"'、'/legal.css'、'info@swiftmindsystems.com'、'Draft, pending review'
// 都不含 '—';都不匹配 /\d+%|\$\d/
// privacy 含 'Cloudflare';terms 含 'British Columbia'
```

- [ ] **Step 2: 跑测试确认失败**

Run: `npx vitest run src/test/legalPages.test.js`
Expected: FAIL

- [ ] **Step 3: 写三个文件**

- [ ] **Step 4: 跑测试与构建,确认 dist 里有两页**

Run: `npx vitest run && npm run build && ls dist/privacy.html dist/terms.html dist/legal.css`
Expected: PASS;三个文件存在。

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: privacy and terms static pages"
```

---

### Task 11: 整页集成、语言全量校验、性能与 finesse 预检、预览部署

**Files:**
- Modify: `src/App.jsx`(最终顺序 `Nav → main#main[Hero, Manifesto, Products, About, Contact] → Footer`;`<a href="#main" class="skip-link">` 跳转链接在最前)
- Create: `public/404.html`(同 `legal.css` 风格,一句「页面不存在 / Page not found」+ 回首页链接)
- Modify: `index.html`(`<meta name="description">` 两语各一条用 `lang` 区分的做法不可行,保留中文;加 Open Graph `og:title`、`og:description`、`og:image=/hero-still.webp`)
- Modify: `scripts/deploy.sh`(`DEPLOY_BRANCH` 变量,见 Step 8)
- Modify: `CLOUDFLARE-DEPLOYMENT.md`(加「本地检查:`npm test`、`npm run build`、Lighthouse 命令」三行,以及预览分支用法)
- Test: `src/test/app.test.jsx`

**Interfaces:**
- Consumes: Task 4–9 的全部组件。

- [ ] **Step 1: 写整页测试**

`src/test/app.test.jsx`:
```jsx
// renderWithProviders(<App/>, { language: 'en' }) 后 document.body.textContent 不匹配 /[\u4e00-\u9fff]/(英文模式下无汉字;'中' 语言切换按钮的 aria-label 用英文 'Chinese',可见文本 '中' 需排除:断言时先移除 [data-lang-toggle] 元素)
// zh 模式下存在 5 个 section(ids: top, manifesto, products, about, contact)且 #main 包含它们
// 文档内 eyebrow class 元素恰好 1 个
// 第一个可聚焦元素是 skip-link
```

- [ ] **Step 2: 跑测试确认失败**

Run: `npx vitest run src/test/app.test.jsx`
Expected: FAIL

- [ ] **Step 3: 完成 App.jsx、404 页、index.html OG 标签、文档**

- [ ] **Step 4: 跑全部测试与构建**

Run: `npx vitest run && npm run build`
Expected: 全部 PASS;build 成功;`dist/assets/index-*.js` gzip < 120KB(从 build 输出读)。

- [ ] **Step 5: Lighthouse**

Run: `npm run preview &` 然后 `npx -y lighthouse http://localhost:4173/ --preset=desktop --only-categories=performance,accessibility --quiet --chrome-flags="--headless=new" --output=json --output-path=/tmp/lh.json && node -e "const r=require('/tmp/lh.json').categories;console.log('perf',r.performance.score*100,'a11y',r.accessibility.score*100)"`
Expected: `perf ≥ 90`,`a11y ≥ 90`;不达标回到对应组件修(常见:截图未 lazy、字体阻塞、对比度)。

- [ ] **Step 6: finesse 预检**

Run: `node ~/.claude/skills/finesse-ui/scripts/detect.mjs --json dist/index.html`(脚本不存在则按 `~/.claude/skills/finesse-ui/references/preflight.md` 逐条手工核对 A–G 硬规则,把结果写进 PR 描述)
Expected: `p0 === 0`。另外手工核对:375px 宽无横向滚动;Hero 文字 ≤ 4 个元素;眉题 1 个;无 `—`。

- [ ] **Step 7: 移动端实测**

Run: Chrome DevTools 设备模式 iPhone 14(390 宽)打开 `http://localhost:4173/`。
Expected:首屏为静态图 + 文字,无 canvas;菜单可开合;产品截图堆叠在文字上方;无横向滚动。

- [ ] **Step 8: 预览部署(不动生产)**

先改 `scripts/deploy.sh`:`--branch main` 改为 `--branch "${DEPLOY_BRANCH:-main}"`,并在注释里写明「`DEPLOY_BRANCH=preview scripts/deploy.sh` 发预览,不带变量发生产」。
Run: `DEPLOY_BRANCH=preview scripts/deploy.sh`
Expected:输出 `Deployment complete`,预览地址 `https://preview.swiftmind-systems.pages.dev`;生产域名 swiftmindsystems.com 仍是旧站。用户终审通过后再跑不带变量的 `scripts/deploy.sh` 上生产。

- [ ] **Step 9: Commit**

```bash
git add -A && git commit -m "feat: assemble page, skip link, 404, og tags and deployment notes"
```

- [ ] **Step 10: 汇报**

给用户:预览地址;Hero 标题三版(A 默认 / B / C)供挑选;Lighthouse 分数;finesse 预检结果;待终审项(文案、隐私/条款初稿、截图选择)。
