# SwiftMind Systems 官网重写 · 设计文档

日期:2026-10-19 · 状态:待用户审核 · 仓库:ethanyandev/swiftmind-systems · 线上:https://swiftmindsystems.com(Cloudflare Pages)

## 1. 意图

现有官网是一套通用 SaaS 模板:靛蓝+绿渐变、图标卡片网格、空话标题("创新科技,敏捷未来")。
重写目标是让访客在十秒内按这个顺序形成印象:**① 这家公司技术能力强(尤其 AI 方向) → ② 审美好 → ③ 顺带知道做了哪些产品**。
首页是一次技术能力的展示,不是产品目录;产品信息往后排,但要完整。

参考方向(用户已选,2026-10-19):motionsites.ai 的 **Agent Wave**(黑白粒子曲面首屏)+ **Cosmo Forge**(黑底单一橙色、等宽字、硬网格的版式规矩)。
明确拒绝的懒惰默认:深色底 + 紫蓝渐变光晕 + 玻璃卡片的「AI 公司标配」。

## 2. 目标 / 非目标 / 反目标

**目标**
- 首屏有一个真实跑在浏览器里的视觉引擎(粒子曲面),靠「代码在动」证明技术,而不是靠配色暗示。
- 全站一种审美、一种点缀色、一套字体,从头到尾不漂移。
- 四个产品各有一屏,带真实截图和官网链接;状态真实(已上线 / 开发中)。
- 收尾一屏给一个明确动作:发邮件(预约通话待有链接后再加)。
- 中英双语,中文为默认(保留现有 `LanguageContext` 机制)。
- 手机端完整可用;减少动效模式下退化为静态画面;Lighthouse 性能不低于现状。

**非目标**
- 不做多页面路由,仍是单页滚动。
- 不做 CMS、博客、表单后端。联系方式就是 mailto 和预约链接。
- 不做浅色主题,不保留「colorful / monochrome」主题开关(`ThemeContext`、`ThemeSwitch` 删除)。
- 不接入统计、埋点(后续如需另开任务)。

**反目标(做成这样算失败)**
- 看起来像任何一个 AI SaaS 模板:紫光晕、玻璃卡、渐变文字、每段一个小标签眉题、`01 02 03` 编号卡片阵列。
- 粒子引擎卡顿、在手机上发热、或首屏白屏等待 three.js。
- 中文排版粗糙:标题断行难看、字重不够、英文等宽字混排中文时基线乱。
- 假数字(「99% 客户满意」「24/7」这类无来源指标)。现有站的 stats 区整体删除。

## 3. 约束

- 技术栈沿用:React 19 + Vite 7 + Tailwind 4 + GSAP 3,新增 `three`(仅首屏引擎,动态 import)。不引入 Next、不引入组件库。
- 部署不变:`scripts/deploy.sh` → Cloudflare Pages。构建产物必须仍是纯静态 `dist/`。
- 不加载中文网络字体(体积与首屏);中文走系统字体栈。
- 图片:产品截图已在 `public/SaveVia/`(18 张)与 `public/VA/`(14 张);SkillGrove 只有 `skillgrove.png`、`skillgrove-logo.png`;Moodtini 只有 `moodtini.png`、`moodtini-logo.png`。截图需压成 WebP、限宽 1600px。
- 三张 logo 偏大(`logo-transparent.png` 677KB、`vamerchant-logo.png` 838KB),需重新导出。

## 4. 设计决定(已定)

### 4.1 三个旋钮
- SOUL 7 · SPECTACLE 7 · DENSITY 5。register = brand。

### 4.2 色彩与质感(全站锁定)
- 背景 `#0A0A0B`(不是纯黑),前景 `#F2F2F0`(不是纯白),中性灰全部偏冷一点点。
- 点缀色唯一:**信号橙 `#FF5A1F`**。只用于:主按钮、产品状态点、hover 下划线、少量编号。不做大面积橙色块。
- 粒子:纯白到灰的单色,不上橙。橙只属于 UI 层,冷热对比靠这个分层来。
- 质感层:全站固定 SVG `feTurbulence` 颗粒(opacity ≈ .035);首屏径向暗角;边框一律 `rgba(255,255,255,.08–.16)`。
- 不用渐变文字、不用玻璃模糊卡片、不用发光阴影。

### 4.3 字体
- 英文标题:**Space Grotesk**(700),`clamp()` 大字号、字距 `-.03em`、行高 .92。
- 等宽:**JetBrains Mono**(400/500),用于编号、状态、导航、页脚、所有「系统感」文字。
- 中文:`"PingFang SC","Hiragino Sans GB","Noto Sans CJK SC","Microsoft YaHei",sans-serif`;中文标题字重 600,行高 1.15,字距 0;中文段落行高 1.8。
- 两种网络字体都从 Google Fonts 以 `display=swap` 加载,子集 latin。

### 4.4 首屏引擎(唯一的 spectacle)
- three.js `Points`,约 40k 顶点组成一张平面网格,顶点着色器用两层 simplex noise 做起伏,形成 Agent Wave 式的「布面在风里」的曲面;相机略俯视。
- 交互:鼠标位置以小权重偏移噪声中心(惯性跟随);滚动进度驱动噪声时间与相机 y 位移,首屏滚出后引擎暂停渲染(IntersectionObserver)。
- 退化:`prefers-reduced-motion` 或 WebGL 不可用或视口宽 < 768 → 不加载 three,显示一张预渲染的静态 WebP(由引擎在桌面上截一帧导出,放 `public/hero-still.webp`)。
- 性能:DPR 上限 1.5;移动端不跑;three 通过 `import()` 懒加载,首屏文字先渲染,引擎 fade-in。
- 引擎是背景层(z 0),文字在 z 5,引擎缺席时页面信息完整。

### 4.5 页面骨架(自上而下)
1. **Nav**:单行 ≤ 72px,左 logo 字标(文字,不用 png),右 Products / About / Contact + 语言切换(ZH / EN 等宽字)。滚动后加 backdrop-blur 与下边框。
2. **Hero**(100dvh):粒子引擎 + 左下对齐的标题。标题方向(两语各写,最终文案见 §5):说清「我们用 AI 和软件工程做产品」,一句即可;副标题一行;一个主按钮「看产品」+ 一个文字链「联系我们」。右下角一行等宽字:`SwiftMind Systems Ltd. · Canada`(不写城市与年份,用户 2026-10-19 决定)。
3. **Manifesto**:一段 3–4 句的大字宣言,GSAP 逐词淡入;版式为左侧窄栏等宽字小标题、右侧大字。全页**唯一**允许的眉题就在这里。
4. **Products**:标题「Products」。产品现状(用户 2026-10-19 确认):**SaveVia 在线**(savevia.app + App Store),**Moodtini 开发中**(无可链接页面),**VAMerchant、SkillGrove 已下线**。版式:
   - 两个全宽行(SaveVia、Moodtini),硬网格分隔线:
     左栏(等宽):`01` 编号、状态点(橙=Live,灰=In development)、产品名、一句定位、3–4 条能力(纯文本,不用图标)、链接(SaveVia:官网 + App Store;Moodtini:无链接)。
     右栏:真实截图,带轻微 3° 透视和滚动视差(CSS transform),这是全页唯一的 3D 时刻。SaveVia 用 `public/SaveVia/` 里的手机截图并排两张;Moodtini 用 `moodtini.png`。
   - 其后一条紧凑的「Archive」带:VAMerchant、SkillGrove 各一行(等宽字:名称 · 一句定位 · 年份区间或「Retired」),不放截图、不放链接。目的:展示做过的宽度,但不假装它们还在。(设计者决定,可推翻:也可以整体不提下线产品)
   - 顺序:SaveVia → Moodtini → Archive。
5. **About**:两栏。左:公司一段话(重写,不再是「致力于通过技术创新…」);右:三条「我们怎么工作」的短句(各 ≤ 20 字),不做图标卡片。下方一行等宽字:公司全称、Canada、邮箱。
6. **Contact / Finale**:超大字号一句话(如「有想法?聊聊。」/「Have an idea? Let's talk.」),下面一个主按钮「发邮件」(`mailto:info@swiftmindsystems.com`)+ 旁边等宽字直接写出邮箱地址(可选中复制)。预约通话按钮暂不做(用户 2026-10-19:暂无预约链接),以后有链接再加为次按钮。
7. **Footer**:顶部细线,等宽字,左版权「© 2026 SwiftMind Systems Ltd.」,右:savevia.app 外链、Privacy、Terms。Privacy / Terms 做成两个极简静态页(`public/privacy.html`、`public/terms.html`,同一套 token 的纯 HTML),内容参照 savevia 隐私政策的结构改写成公司通用版本,页面顶部标「初稿」,用户终审。

动效纪律:每处动效都有理由。Hero 引擎 = 技术展示;宣言逐词 = 引导阅读节奏;产品截图视差 = 建立层次;其余只做 opacity/transform 的进入过渡。不做 marquee。

### 4.6 响应式
- Nav:< 768 折叠为全屏菜单(等宽字大号列表)。
- Hero:静态图背景,标题字号 `clamp(2.4rem, 9vw, 7rem)`。
- Products:左右栏上下堆叠,截图在上。
- About:单栏。
- 触控目标 ≥ 44px;焦点环用橙色 2px 外描边。

### 4.7 可访问性与性能门槛
- 文字对比 ≥ 4.5:1(橙色文字只用在 ≥ 18px 粗体,或改为橙底黑字)。
- 所有图片有 alt;语言切换更新 `<html lang>`。
- 首屏 JS 预算:不含 three 时 < 120KB gzip;three 懒加载块单独。
- `npm run build` 后用 Lighthouse 桌面跑一次,性能/可访问性 ≥ 90 作为完成门槛。

## 5. 文案方向(中英各写,构建者按此起草,用户终审)

- 现有翻译文件 `src/translations.js` 的结构保留(`t(key, lang)`),内容全部重写。
- 语气:具体、短句、第一人称复数、不喊口号。禁用:赋能、引领、卓越、一站式、创新科技。
- Hero 标题方向:「我们把 AI 做成能用的产品。」/「We turn AI into products people actually use.」(供参考,非定稿)
- 每个产品:一句定位 + 3–4 条能力,来自现有翻译文件里的 features,去掉营销化的描述。
- SaveVia 描述里「每年可节省 $300–$1,000」属假精确数字,删除。
- Archive 两行的一句定位沿用现有翻译里的 tagline(VAMerchant:服务商预约管理系统;SkillGrove:线上教育课程平台)。

## 6. 交给构建者的部分

构建者审核后由设计者拍板的几条(标「设计者决定」,用户可推翻):
- **文案**:构建者直接写成定稿级别写入 `translations.js`,不留占位;用户在预览地址(`*.swiftmind-systems.pages.dev`)上终审,改动走后续小任务。首屏那一句先写三版放在 PR 描述里供用户挑。(设计者决定)
- **Hero 静态图**:先用 CSS 层(颗粒 + 暗角 + 纯色)做临时退化,引擎调稳后写 `scripts/capture-hero.mjs`(Playwright headless Chromium,1600×1000,导出 WebP)生成 `public/hero-still.webp` 并提交;脚本进仓库保证可复现。(设计者决定)
- **Logo**:Nav 用文字字标,`logo-transparent.png` 删除;产品行不放产品 logo,只用产品名文字 + 截图,四个 `*-logo.png` 从 `public/` 删除;favicon / manifest 图标保留不动。(设计者决定)
- **截图压缩**:新增 `scripts/optimize-images.mjs`(sharp,devDependency),一次性把 `public/SaveVia`、`public/VA` 及单张产品图转成 ≤1600px WebP,原 PNG 从仓库删除(git 历史里仍可取回);以后新增截图同样跑这个脚本。(设计者决定)
- **产品状态**(用户 2026-10-19 确认):SaveVia = Live,Moodtini = In development,VAMerchant / SkillGrove = Retired(进 Archive 带)。

- 粒子引擎的具体噪声参数、顶点数、相机角度:按 60fps 实测调。
- 截图裁剪与挑选:每个产品从现有文件里选 1–2 张最能说明产品的。
- GSAP 时序细节。
- 组件拆分:建议 `Nav / Hero / HeroEngine(lazy) / Manifesto / Products / ProductRow / About / Contact / Footer`,删除 `CoreValues`、`ThemeSwitch`、`ThemeContext`、`counter.ts`、`main.ts`、`style.css`、`typescript.svg` 等模板残留。

## 7. 用户已确认(2026-10-19)

1. 预约通话:暂无链接,只做邮件。
2. SkillGrove 已下线;Moodtini 开发中,无页面。
3. 应用商店:只有 SaveVia 有 App Store(`https://apps.apple.com/ca/app/id6756332569`,构建者再核一次链接可达);VAMerchant 已下线,无 Google Play。
4. 注册地城市、成立年份:不写。
5. 隐私政策 / 服务条款:由设计者决定,做极简静态页(见 §4.5 第 7 条)。
