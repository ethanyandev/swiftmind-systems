// Hero demo script: one real answer from Xiaowei, the assistant inside SaveVia 2.0.
// Every number is quoted from the source capture below, not written for the site.
// Card art comes from SaveVia's own card library (~/work/savevia/savevia/web/static/cards).
// Kept out of translations.js on purpose: the copy rules ban prices and percentages in marketing text;
// this is product output with a source.
export const DEMO = {
  source: '~/work/savevia/docs/appstore/screenshots/6.9/03-chat.png (SaveVia 2.0, captured 2026-10-19)',
  question: {
    zh: '我每月买菜 $800、加油 $200，哪张卡返现最高？',
    en: 'I spend $800 a month on groceries and $200 on gas. Which card gives the most cash back?',
  },
  who: { zh: '小维', en: 'Xiaowei' },
  status: { zh: '已查 1 步 · 用时 4 秒', en: '1 lookup · 4 seconds' },
  card: {
    name: { zh: 'MBNA 智能现金白金 Plus 卡', en: 'MBNA Smart Cash Platinum Plus' },
    meta: { zh: 'Mastercard · 年费 $0', en: 'Mastercard · $0 annual fee' },
    image: '/demo/mbna.webp',
  },
  rows: [
    { label: { zh: '买菜前 $6,000 × 5%', en: 'Groceries, first $6,000 × 5%' }, value: 300 },
    { label: { zh: '加油 $2,400 × 5%', en: 'Gas $2,400 × 5%' }, value: 120 },
    { label: { zh: '超出封顶的买菜 $3,600 × 0.5%', en: 'Groceries above the cap $3,600 × 0.5%' }, value: 18 },
  ],
  total: { label: { zh: '一年净拿', en: 'Net per year' }, value: 438 },
  rankingTitle: { zh: '同一份消费，四张卡一年净拿', en: 'Same spending, net per year on four cards' },
  ranking: [
    { name: 'MBNA Smart Cash Platinum Plus', image: '/demo/mbna.webp', value: 438, fee: { zh: '免年费', en: 'No fee' } },
    { name: 'Neo World Elite', image: '/demo/neo.webp', value: 403, fee: { zh: '年费 $149', en: '$149 fee' } },
    { name: 'CIBC Dividend Visa Infinite', image: '/demo/cibc.webp', value: 360, fee: { zh: '年费 $120', en: '$120 fee' } },
    { name: 'Triangle World Elite', image: '/demo/triangle.webp', value: 312, fee: { zh: '免年费', en: 'No fee' } },
  ],
  caption: {
    zh: '演示：SaveVia 里的 AI 助手小维回答一个真实问题。它先查卡库，再按封顶逐项计算，最后给出四张卡的一年净收益排名，第一名是 MBNA 智能现金白金 Plus 卡，一年净拿约 438 加元。',
    en: 'Demo: Xiaowei, the AI assistant in SaveVia, answers a real question. It looks up the card library, computes each category against the caps, and ranks four cards by net yearly return; the top pick is the MBNA Smart Cash Platinum Plus at about 438 dollars a year.',
  },
  label: { zh: 'SaveVia 2.0 · 真实回答', en: 'SaveVia 2.0 · real answer' },
}

// Milliseconds from loop start at which each step appears. 11 steps:
// question, status, card, row 1-3, total, ranking 1-4.
export const DEMO_STEPS = [300, 1100, 2000, 2600, 3000, 3400, 4000, 4600, 4850, 5100, 5350]
// How long the finished answer stays on screen before the loop restarts.
export const DEMO_HOLD = 4500
