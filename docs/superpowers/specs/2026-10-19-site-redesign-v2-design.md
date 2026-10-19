# SwiftMind Systems 官网重写 v2 · 设计文档(浅色 · 球体方向)

日期:2026-10-19 · 状态:待用户审核 · 取代 `2026-10-19-site-redesign-design.md` 的视觉部分;内容、文案、产品事实、部署约束沿用 v1。

## 1. 意图

v1(黑白粒子曲面 + 硬网格 + 黑体大字)用户看过两版(深色、暖纸色)后反馈「整体感觉不好、眼睛累」。诊断:问题不在底色,而在骨架——900 字重大标题、灰色粒子、等宽标签、硬线网格,读起来是「开发者工具 / 海报」,冷、糙、无层次。

用户 2026-10-19 重新选定方向:**ElevenLabs(elevenlabs.io)的整体感觉**——干净、简洁、浅色,颜色只出现在画面里,再加上克制的动效。访客印象顺序不变:① 技术能力强(AI 方向)→ ② 审美好 → ③ 知道产品是什么。

Design Read:`AI 软件工作室 · 干净轻盈、颜色只在画面里 · register=brand · SPECTACLE=6 · hero-engine=Three.js 磨砂渐变球体`

拒绝的懒惰默认:深色 + 紫蓝光晕 + 玻璃卡(AI 标配);也拒绝 v1 的黑白海报路线。

## 2. 目标 / 非目标 / 反目标

**目标**
- 页面第一眼是「干净、亮、有颜色的光」,不是「黑白、硬、冷」。
- 首屏仍有一个真实跑在浏览器里的引擎(球体),但它装在一张卡片里,不铺满屏,不压文字。
- 全站只有一套中性色(黑/灰/米白)做界面,所有彩色只出现在球体和产品图底板上。
- 动效贯穿全页但幅度小:淡入、上浮、视差、悬停,没有满屏粒子、没有闪。
- 其余目标沿用 v1:四个产品信息完整、状态真实、中英双语、手机可用、减少动效退化、Lighthouse ≥ 90。

**非目标**
- 不改内容结构、不改文案、不改产品事实、不改隐私/条款正文(只换皮)。
- 不做深色主题、不做主题开关。
- 不放客户 logo 墙、不放任何数字指标(没有真实来源)。

**反目标**
- 做成 ElevenLabs 的像素级复制(字体、球体、布局全照抄);我们借的是「配方」:浅底、中等字重、颜色只在画面里、圆角卡片节奏。
- 球体引擎卡顿、手机发热、首屏等 three.js。
- 标题又回到 800–900 字重的黑体;界面上出现彩色按钮、彩色标签。
- 眉题(小标签)超过一处;出现 `01 02 03` 编号卡片阵列、渐变文字、玻璃模糊卡。

## 3. 约束(沿用 v1,只列有变化的)

- 技术栈不变:React 19 + Vite 7 + Tailwind 4 + GSAP 3 + three(懒加载)。
- 现有组件、测试、脚本(`capture-hero.mjs`、`optimize-images.mjs`、`deploy.sh`)保留并改造,不从零重建仓库。
- 字体:英文新增 **Geist**(400/500)与 **Geist Mono**(400),Google Fonts,latin 子集,非阻塞加载;移除 Space Grotesk 与 JetBrains Mono。中文仍走系统字体栈,不加载中文网络字体。
- 构建产物仍是纯静态 `dist/`,Cloudflare Pages 部署流程不变。

## 4. 设计决定(已定)

### 4.1 三个旋钮
SOUL 6 · SPECTACLE 6 · DENSITY 5 · register = brand。

### 4.2 色彩与质感(全站锁定)
- 页面底 `--bg: #FAFAF8`;卡片面 `--surface: #F3F3F0`;卡片内更深一层 `--surface-2: #ECECE8`。
- 文字 `--fg: #111110`;次级 `--fg-muted: #6E6D68`;更弱 `--fg-faint: #9A9994`(只用于页脚、标签)。
- 线 `--line: rgba(17,17,16,.08)`,强一级 `--line-strong: rgba(17,17,16,.16)`。角点 `--dot: rgba(17,17,16,.35)`,4px 方点。
- **界面层没有强调色。** 主按钮黑底白字胶囊,次按钮白底黑字描边胶囊,链接黑字下划线。v1 的 `#FF5A1F` 不再作为 UI 色。焦点环:黑色 2px 外描边 + 2px 偏移。
- **彩色只在画面层。** 三组「球体色相」,每组 3 个色标,供引擎和产品图底板使用:
  - ember(暖):`#FF5A1F → #FF9A5C → #FFD9B8`
  - lilac(冷):`#7B6CFF → #C9A7FF → #FFC2E8`
  - mist(中性):`#C9D1CC → #E6EBE7 → #F7F9F7`
- 质感:固定 SVG `feTurbulence` 颗粒,`opacity .02`(浅色页更低);球体自身在着色器里带颗粒;不做暗角(浅色页没有必要)。
- 阴影:卡片不带投影;球体下方有一片柔和椭圆影(引擎内部绘制)。悬停上浮时允许一层极淡投影 `0 12px 40px rgba(17,17,16,.06)`。
- 圆角:大卡 24px,小卡 16px,胶囊按钮 999px,截图 12px。

### 4.3 字体与字号
- 英文标题:Geist 500,字距 `-.02em`,行高 1.05。字号台阶:hero `clamp(2.5rem, 4.6vw, 4.25rem)`;区块标题 `clamp(2rem, 3.4vw, 3rem)`;收尾一句 `clamp(2.5rem, 5vw, 4.5rem)`。**不再有 900 字重、不再有 7rem。**
- 中文标题:系统黑体 500,行高 1.2,字距 0;字号与英文同台阶但各减 10%(中文字形更满)。
- 正文:Geist 400 / 系统 400,17px,行高 1.6;中文段落行高 1.8。
- 等宽:Geist Mono 400,13px,只用于:导航语言切换、产品状态、页脚、邮箱地址、唯一的眉题。不再用于导航主链接和按钮。
- 颜色层级:标题 `--fg`,段落 `--fg-muted`,标签 `--fg-faint`。

### 4.4 首屏引擎(唯一的 spectacle)
- 载体:hero 文案下方一张全宽(容器宽 1200px)大圆角卡片 `--surface`,高度 `clamp(360px, 56vh, 560px)`。引擎只在这张卡片内渲染,文字永远不与球体重叠。
- 内容:**4 颗球**,半径比例 1 : .8 : .65 : .5,横向错落排布,最大的一颗略偏右。每颗球绑定一组色相(ember、lilac、mist、ember 的浅端),材质为自定义 ShaderMaterial:
  - 颜色 = 三色标按 `simplex(position * 1.6 + time * .08)` 混合,再按 fresnel 向最浅色标提亮(边缘发亮像磨砂玻璃),fragment 里叠 `hash(uv + time)` 颗粒 ±3%。
  - 不用灯光、不用环境贴图,全靠着色器,保证颜色与 §4.2 完全一致。
  - 每颗球下方一片椭圆影(透明平面,径向渐变 alpha ≤ .18)。
- 动:每颗球按各自相位做缓慢上下漂浮(周期 6–9s,幅度 = 半径 × .12),整体随鼠标位置做轻微视差(群组旋转 ±.06 rad,惯性跟随);滚动时群组 y 随进度微移;卡片离开视口即暂停渲染。
- 退化(沿用 v1 门槛 `canRunEngine`):`prefers-reduced-motion`、无 WebGL、或视口 < 768 → 不加载 three,卡片内显示 `public/hero-still.webp`(由 `scripts/capture-hero.mjs` 从引擎截取一帧,改为只截这张卡片)。引擎就绪后静态图淡出(沿用 `is-engine-ready` 机制)。
- 性能:DPR ≤ 1.5;引擎在 `load` + idle 后启动;three 单独分块。

### 4.5 页面骨架(自上而下)

全页外框:一个 1200px 容器,左右两条贯穿全页的竖向细线(`--line`);每个区块之间一条横向细线,线与竖线交点放角点。这是 ElevenLabs「有网格的纸」的质感来源,但线要极淡。

1. **Nav**(64px,固定):左文字字标「SwiftMind」(Geist 500);右:产品 / 关于 / 联系(Geist 400,`--fg-muted`,悬停变 `--fg`)+ 语言切换(Geist Mono「中 / EN」)+ 黑色胶囊「联系我们」(mailto)。滚动超过 24px 后加 `backdrop-blur` 和底线。手机折叠逻辑沿用现有 `#nav-menu`。
2. **Hero**:上方留白 96px;两栏——左:标题(文案沿用 v1 的 A 版「我们把 AI 做成能用的产品。」/ EN 同)+ 按钮行(黑胶囊「看产品」→ `#products`,白胶囊「联系我们」→ `#contact`);右:副标题一段(`--fg-muted`,17px,最大 40ch)。下方即 §4.4 的引擎卡片。卡片右下角一行 Geist Mono:`SwiftMind Systems Ltd. · Canada`。
3. **Manifesto**:左窄栏放全页唯一眉题(Geist Mono「Manifesto」),右宽栏放宣言正文(Geist 500 / 系统 500,`clamp(1.5rem, 2.4vw, 2.1rem)`,行高 1.35),GSAP 逐词淡入沿用。字重从 v1 的大黑体降为 500。
4. **Products**:区块头两栏——左标题「产品」,右一段话(沿用 v1 products.intro 文案)。之后每个产品一张大卡(`--surface`,24px 圆角,内边距 40px):
   - 左栏:状态(Geist Mono + 实心圆点,Live = `--fg`,In development = `--fg-faint`)、产品名(区块标题台阶)、一句定位、3–4 条能力(纯文本列表,行间细线)、链接(白胶囊「官网」、「App Store」,`rel="noopener noreferrer"`)。
   - 右栏:一块圆角「底板」(SaveVia 用 ember 组的浅两色做对角渐变并叠颗粒;Moodtini 用 lilac 组),截图落在底板上,滚动时截图相对底板做 ±16px 视差。SaveVia 两张手机截图并排、Moodtini 一张横图,素材沿用 `public/screens/`。
   - 奇偶行不再左右翻转(卡片节奏一致更干净)。
   - Archive:两张小卡并排(`--surface`,16px 圆角):产品名 + 一句定位 + Geist Mono「已下线 / Retired」。
5. **About**:区块头两栏(左标题「关于」,右公司一段话)。下方三张小卡并排:每张顶部一个 Geist Mono 短标签(如「做法 01」不编号——改为「设计 / 工程 / 发布」这类词),下方一句「我们怎么工作」(沿用 v1 about.how 三条)。小卡不放图标。
6. **Contact**:居中一句大字(收尾台阶,500 字重)+ 黑胶囊「发邮件」(mailto)+ 其下 Geist Mono 写出邮箱地址(可选中)。
7. **Footer**:顶部细线;左「© 2026 SwiftMind Systems Ltd.」,右 savevia.app / Privacy / Terms,全部 Geist Mono `--fg-faint`。

### 4.6 动效清单(每处有理由,都可被 reduced-motion 关掉)
- 首屏:标题逐词淡入上浮(位移 16px,stagger 40ms),按钮和副标题随后;引擎卡片从 `opacity 0 / translateY 24px` 进入。理由:建立阅读顺序。
- 球体引擎:漂浮 + 鼠标视差(§4.4)。理由:技术展示。
- 区块进入:标题与卡片按 `opacity 0→1, y 24→0`,卡片之间 stagger 80ms,触发一次。理由:节奏。
- 卡片悬停:`translateY(-2px)` + §4.2 极淡投影,150ms。理由:可点反馈(只给有链接的卡)。
- 产品截图视差(§4.5)。理由:层次。
- Nav 滚动后毛玻璃。理由:内容滚过时的分层。
- 没有 marquee、没有打字机、没有数字滚动。

### 4.7 响应式
- < 1024:产品卡与 About 卡改单列;hero 两栏改上下。
- < 768:引擎不跑(静态图),hero 卡片高度 `clamp(240px, 42vh, 360px)`;nav 折叠;外框竖线隐藏(省空间);字号台阶各降一档。
- 触控目标 ≥ 44px。

### 4.8 可访问性与性能
- 对比:`--fg-muted` 对 `--bg` ≥ 4.5:1(#6E6D68 on #FAFAF8 ≈ 4.96:1,通过);`--fg-faint` 只用于 ≥ 13px 的非正文标签。
- 图片 alt、`<html lang>` 切换、跳转链接、焦点环沿用。
- 首屏 JS(不含 three)< 120KB gzip;Lighthouse 桌面 性能/可访问性 ≥ 90 为完成门槛,目标维持 100。

### 4.9 附属页面
- `public/privacy.html`、`public/terms.html`、`public/404.html`、`public/legal.css`:换成 §4.2 token 与 Geist,正文不动。
- `site.webmanifest`:`theme_color` / `background_color` 改为 `#FAFAF8`。
- og:image:由 capture 脚本顺带截一张 1200×630 的首屏(含文字)存 `public/og.png`(PNG,解决 v1 遗留的「og:image 是 WebP」)。

## 5. 文案
全部沿用 v1 已写入 `src/translations.js` 的内容(hero.title 用 A 版)。只有两处新增:About 三张小卡的短标签(各 2–4 字 / 1 词),以及 nav 右侧黑胶囊「联系我们 / Contact」。

## 6. 交给构建者的部分
- 球体着色器的噪声频率、fresnel 指数、颗粒强度:按「像磨砂玻璃、不像塑料」目测调,以 60fps 为底线。
- GSAP 时序细节、stagger 数值。
- 现有测试全部按新 token 与新结构更新;引擎单测改为断言「4 颗球 + 影子平面、pointer 改变群组旋转、scroll 改变群组 y」。
- 组件拆分建议:保留 `Nav / Hero / HeroEngine / Manifesto / Products / ProductRow / About / Contact / Footer`,新增 `Surface`(圆角卡片容器)与 `Frame`(外框线 + 角点)两个无状态组件;`src/engine/waveField.js` 替换为 `src/engine/orbField.js`(同一接口:`setPointer / setScroll / pause / resume / resize / dispose`)。
- 删除不再用的 token、`.vignette`、`.eyebrow` 以外的 v1 样式。

## 7. 用户已确认(2026-10-19)
1. 方向:B(浅色 + 彩色 3D 物体),以 ElevenLabs 的整体感觉为底,加克制动效。
2. 首屏卡片里放彩色球体(抽象),SaveVia 截图留在产品区。
3. v1 已确认的事实(无预约链接、SkillGrove / VAMerchant 下线、只有 SaveVia 有 App Store、不写城市年份、隐私条款由设计者定)全部沿用。
