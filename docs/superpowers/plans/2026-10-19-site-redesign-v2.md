# Site Redesign v2 (light surface + gradient orbs) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Re-skin the redesign branch to the v2 spec: near-white page, neutral UI, colour only in a Three.js gradient-orb card and product boards, Geist type at weight 500, calm GSAP motion. Content and copy unchanged.

**Architecture:** Same React/Vite/Tailwind/GSAP/three stack and component split. Tokens change in `src/index.css`; the wave engine is replaced by `src/engine/orbField.js` behind the same control interface; Hero gains a `.hero-stage` card that hosts the engine; Products/About move to rounded `Surface` cards; a `Frame` component draws the container hairlines.

**Tech Stack:** React 19, Vite 7, Tailwind 4 (`@theme` tokens), GSAP 3 + ScrollTrigger, three (lazy), vitest + jsdom + testing-library, sharp, playwright-core.

**Spec:** `docs/superpowers/specs/2026-10-19-site-redesign-v2-design.md` (visual) + `docs/superpowers/specs/2026-10-19-site-redesign-design.md` (content, facts, constraints).

## Global Constraints

- Palette exactly as spec §4.2: `--bg #FAFAF8`, `--surface #F3F3F0`, `--surface-2 #ECECE8`, `--fg #111110`, `--fg-muted #6E6D68`, `--fg-faint #9A9994`, lines `rgba(17,17,16,.08/.16)`. No `#fff`/`#000`. No UI accent colour. Orb palettes ember / lilac / mist / peach as §4.2 + §8.1.
- Fonts: Geist 400/500 + Geist Mono 400 from Google Fonts, non-blocking; Chinese system stack; no 700+ weight anywhere.
- One eyebrow (Manifesto). No gradient text, no glass, no numbers, no em-dash in EN copy.
- Engine gating unchanged (`canRunEngine`: width ≥ 768, no reduced motion, WebGL). Engine starts after load + idle. DPR ≤ 1.5.
- Copy in `src/translations.js` unchanged except two additions (`about.labels.*`, `nav.cta`).
- Lighthouse desktop performance and accessibility ≥ 90; `npm test` green before each commit.

## Review Focus

1. Engine never covers text: `.hero-stage` is below the hero copy; copy renders without the engine (Task 4 test).
2. Hover lift only on cards that contain a link; non-link cards must not get `:hover` transform (Task 6 CSS test).
3. Frame vertical lines must not capture pointer events or sit above content (Task 2 test asserts `pointer-events: none` and `z-index` below content).
4. Reduced motion: orb engine renders one frame; word reveal and reveals are skipped (Task 3 test).
5. Mobile: no horizontal overflow at 375px with the new cards and boards (Task 9 Playwright check).

---

### Task 1: Tokens, fonts, manifest, legal pages

**Files:** Modify `src/index.css` (tokens + base + controls), `index.html` (font links, theme-color, og:image → `/og.png`), `public/site.webmanifest`, `public/legal.css`; Test `src/test/tokens.test.js`, `src/test/fixpass.test.jsx`, `src/test/legalPages.test.js`.

- [ ] Step 1: Rewrite `tokens.test.js` expectations: `--bg: #FAFAF8`, `--surface: #F3F3F0`, `--fg: #111110`, `--fg-muted: #6E6D68`, no `--accent` token, no `#FF5A1F` outside the `--orb-*` block, Geist + Geist Mono in `index.html`, no Space Grotesk / JetBrains. Add `legalPages` assertion that `legal.css` carries `#FAFAF8`. Update manifest assertion in `fixpass` to `#FAFAF8`.
- [ ] Step 2: Run `npx vitest run src/test/tokens.test.js src/test/fixpass.test.jsx src/test/legalPages.test.js` → FAIL on palette/fonts.
- [ ] Step 3: Implement tokens (`@theme` + `:root`), base, `.display` (weight 500, `-.02em`, lh 1.05; zh 500 / 1.2 / 0), `.mono` (Geist Mono 13px), `.eyebrow`, `.muted`, `.faint`, `.wrap` (`min(100% - 3rem, 1200px)`), `.btn-primary` (black pill), `.btn-secondary` (white pill, 1px `--line-strong`), `.btn-link` (underline), focus ring black, selection `--surface-2`, grain opacity .02; delete `.vignette`. Fonts in `index.html`; manifest + legal.css tokens.
- [ ] Step 4: Run the three test files → PASS. Run `npm test` → everything that references old tokens still passes (others fail later tasks; note them).
- [ ] Step 5: Commit `feat(v2): light tokens, Geist, neutral controls`.

### Task 2: Frame + Surface + section header

**Files:** Create `src/components/Frame.jsx`, `src/components/Surface.jsx`, `src/components/SectionHead.jsx`; Modify `src/AppInner.jsx`, `src/index.css`; Test `src/test/frame.test.jsx`.

**Interfaces:** `Frame()` renders `<div class="frame" aria-hidden="true"><span class="frame-line frame-line-l"/><span class="frame-line frame-line-r"/></div>` inside a `.page` wrapper; `Surface({ as='div', className, children, ...rest })` renders `<as class="surface …">`; `SectionHead({ id, title, body })` renders `<div class="section-head"><h2 class="display section-title">{title}</h2><p class="section-body muted">{body}</p></div>`.

- [ ] Step 1: Write `frame.test.jsx`: `AppInner` contains `.page > .frame` with two `.frame-line`s, `aria-hidden`; CSS has `.frame { pointer-events: none` and `.frame-line` absolute; `.section-rule` has two `.rule-dot`s. `Surface` passes className and `as`.
- [ ] Step 2: Run → FAIL (components missing).
- [ ] Step 3: Implement components and CSS: `.page { position: relative }`, `.frame` absolute inset 0, lines at `calc(50% - min(50% - 1.5rem, 600px))` left/right, hidden < 768; `.section-rule` (hairline with `::before/::after` dots at the container edges); `.surface` radius 24 / `.surface-sm` radius 16, padding tokens; `.section-head` two-col ≥ 768 (7/5).
- [ ] Step 4: Run → PASS. Commit `feat(v2): frame, surface and section head primitives`.

### Task 3: Orb engine

**Files:** Create `src/engine/orbField.js`; Delete `src/engine/waveField.js`; Test `src/test/orbField.test.js` (replaces `waveField.test.js`).

**Interfaces:** `createOrbField(canvas, { THREE, reduced, dpr, raf, caf }) → { setPointer(nx, ny), setScroll(p), pause(), resume(), resize(w, h), dispose() }`. Exports `ORBS = [{ r: 1, x: .55, y: 0, palette: 'ember' }, { r: .8, x: -.45, y: .05, palette: 'lilac' }, { r: .65, x: -.05, y: -.1, palette: 'mist' }, { r: .5, x: .15, y: .25, palette: 'peach' }]` and `PALETTES` (hex triples from spec).

- [ ] Step 1: Write `orbField.test.js` with fake THREE (`SphereGeometry`, `PlaneGeometry`, `Mesh`, `Group`, `ShaderMaterial`, `Color`, `Vector2`, `WebGLRenderer`, `PerspectiveCamera`, `Scene`): 4 sphere meshes + 4 shadow planes added to a group; each sphere material `uniforms.uA/uB/uC` equal the palette hex; `setPointer(1, 0)` sets `group.rotation.y` target ≠ 0 and after one frame moves toward it; `setScroll(1)` sets `group.position.y` to `-SCROLL_SHIFT`; reduced renders once with no raf; dispose disposes 8 geometries + 8 materials + renderer and cancels raf; `resize` updates renderer and camera.
- [ ] Step 2: Run → FAIL (module missing).
- [ ] Step 3: Implement: perspective camera fov 35 at z 7 looking at origin; sphere geometry 64×64; vertex shader passes normal + world pos; fragment: `simplex(pos*1.6 + t*.08)` mixes A→B→C, fresnel `pow(1 - dot(n, v), 2.2)` toward C, grain `hash(uv + t)*.06 - .03`; shadow plane radial alpha ≤ .18 under each orb; float `y += sin(t*freq + phase) * r*.12`; pointer eases group rotation (`±.06 rad`); scroll shifts group y by `SCROLL_SHIFT = .6`.
- [ ] Step 4: Run → PASS. Delete `waveField.js` + old test. `npm test` → only Hero/engine tests fail (fixed in Task 4). Commit `feat(v2): gradient orb engine`.

### Task 4: Hero with engine stage

**Files:** Modify `src/components/Hero.jsx`, `src/components/HeroEngine.jsx`, `src/index.css`; Test `src/test/hero.test.jsx`, `src/test/heroEngine.test.jsx`, `src/test/heroEngineUnmount.test.jsx`, `src/test/fixpass.test.jsx`.

- [ ] Step 1: Update tests: Hero renders `.hero-copy` grid with `h1`, `.hero-actions` (`btn-primary` → `#products`, `btn-secondary` → `#contact`), subtitle, then `.hero-stage` containing `img.hero-still` (1200×560) and the engine slot; tag inside the stage. Engine tests target `.hero-stage canvas.is-ready` and `.hero-stage.is-engine-ready`. fixpass CSS assertion → `.hero-stage.is-engine-ready .hero-still { opacity: 0 }`. Add test: with `useCanRunEngine` false the copy still renders and no canvas exists.
- [ ] Step 2: Run → FAIL.
- [ ] Step 3: Implement Hero markup; HeroEngine captures `host.closest('.hero-stage')` as `stage` at effect start and toggles the class on it; `createOrbField` import. CSS: `.hero` padding-top 96px + nav; `.hero-copy` 7/5 grid, subtitle `padding-top: 8px`; `.hero-stage` surface, height `clamp(360px, 56vh, 560px)` (`clamp(240px, 42vh, 360px)` < 768), `overflow: hidden`, `position: relative`; still `object-fit: cover`; canvas/still fades as before.
- [ ] Step 4: Run → PASS. Commit `feat(v2): hero copy row and orb stage`.

### Task 5: Nav

**Files:** Modify `src/components/Nav.jsx`, `src/translations.js` (+ `nav.cta`), `src/index.css`; Test `src/test/nav.test.jsx`, `src/test/copy.test.js` (if it enumerates keys).

- [ ] Step 1: Test: desktop nav has links `产品/关于/联系` (not `.mono`), a `btn-primary` link named `联系我们` → `#contact`, lang toggle `.mono`; mobile menu also lists the CTA.
- [ ] Step 2: Run → FAIL. Step 3: Implement (`nav.cta: { zh: '联系我们', en: 'Contact us' }`; nav links Geist 400 muted; scrolled threshold 24px; pill `min-height: 40px` in nav). Step 4: PASS. Commit `feat(v2): nav with contact pill`.

### Task 6: Products as surface cards

**Files:** Modify `src/components/Products.jsx`, `src/components/ProductRow.jsx`, `src/index.css`; Test `src/test/productsView.test.jsx`, `src/test/fixpass.test.jsx`.

- [ ] Step 1: Tests: section has `.section-head` with heading `产品` + intro from `products.intro` (new key; see Step 3); each product is `article.product-card.surface`; no `.is-flipped`; links are `btn-secondary`; `.board[data-palette="ember"]` for savevia, `lilac` for moodtini; feature list `li` count = features; archive is `ul.archive` with 2 `li.surface-sm`, no links/imgs; CSS: `.product-card:hover` absent, `.archive li:hover` absent (no lift on non-link cards); `.product-features li + li { border-top`.
- [ ] Step 2: FAIL. Step 3: Implement; add `products.intro` copy: zh「两个在做的产品，一个已上线，一个在开发。下面是过去做过的。」/ en "Two products in progress: one live, one in development. Past work is listed below." (new copy, flagged for user); board 4:3, padding 32px, diagonal gradient from palette stops 2→3 + grain; phones side-by-side, second `translateY(24px)`; parallax on `.shots` ±16px. Step 4: PASS. Commit `feat(v2): product cards with colour boards`.

### Task 7: About, Contact, Footer, Manifesto restyle

**Files:** Modify `src/components/About.jsx`, `Contact.jsx`, `Footer.jsx`, `Manifesto.jsx` (class only), `src/translations.js` (+ `about.labels.{p1,p2,p3}`), `src/index.css`; Test `src/test/aboutContactFooter.test.jsx`, `src/test/manifesto.test.jsx`.

- [ ] Step 1: Tests: About has `.section-head`, `ul.principles` with 3 `li.surface-sm` each containing `.mono` label (`发布`, `数据`, `工程`) and the principle text; Contact heading centered class `.contact-heading`, `btn-primary` mailto, `code.email`; Footer unchanged behaviour with `.faint`; Manifesto still the only eyebrow.
- [ ] Step 2: FAIL. Step 3: Implement (`about.labels`: zh 发布/数据/工程, en Ship/Numbers/Engineering). Step 4: PASS. Commit `feat(v2): about cards, contact, footer, manifesto weight`.

### Task 8: Motion

**Files:** Modify `src/components/Hero.jsx` (intro timeline via `useGSAP`), `src/lib/useReveal.js` (stagger 80ms), `src/components/Products.jsx` / `About.jsx` (use `.reveal` on cards), `src/index.css` (hover lift on `.surface.has-link`, nav blur). Test `src/test/motion.test.js` (+ `heroIntro` reduced-motion skip).

- [ ] Step 1: Test: Hero with reduced motion does not call `gsap.fromTo` (mock `../lib/gsap`); CSS has `.surface.has-link:hover { transform: translateY(-2px)` and `box-shadow`.
- [ ] Step 2: FAIL. Step 3: Implement hero intro (words via `splitWords`, y 16, stagger .04, then actions/subtitle, then stage y 24 → 0). Step 4: PASS. Commit `feat(v2): entrance motion and hover lift`.

### Task 9: Capture, og image, verification, preview

**Files:** Modify `scripts/capture-hero.mjs` (stage crop 1200×560 → `public/hero-still.webp`; page top 1200×630 → `public/og.png`), `index.html` og:image, `CLOUDFLARE-DEPLOYMENT.md` (test count), memory.

- [ ] Step 1: `npm run build && node scripts/capture-hero.mjs` → both files written; commit images.
- [ ] Step 2: Playwright checks at 375 / 768 / 1440: no horizontal overflow, no canvas < 768, canvas ≥ 768. Lighthouse desktop ≥ 90 (target 100).
- [ ] Step 3: `npm test` green; commit `feat(v2): stills, og image, docs`. Deploy `DEPLOY_BRANCH=preview scripts/deploy.sh`.
