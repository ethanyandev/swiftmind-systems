// Single source of copy. Every leaf is { zh, en }. English strings never use an em-dash.
export const translations = {
  meta: {
    description: {
      zh: 'SwiftMind Systems 是一家加拿大软件公司，自己设计、开发并上线 AI 产品。',
      en: 'SwiftMind Systems is a Canadian software company that designs, builds and ships its own AI products.',
    },
  },
  nav: {
    products: { zh: '产品', en: 'Products' },
    about: { zh: '关于', en: 'About' },
    contact: { zh: '联系', en: 'Contact' },
    menu: { zh: '菜单', en: 'Menu' },
    close: { zh: '关闭', en: 'Close' },
    lang: { zh: '语言', en: 'Language' },
    home: { zh: '回到顶部', en: 'Back to top' },
    skip: { zh: '跳到正文', en: 'Skip to content' },
    cta: { zh: '联系我们', en: 'Contact us' },
  },
  hero: {
    title: { zh: '我们把 AI 做成能用的产品。', en: 'We turn AI into products people actually use.' },
    subtitle: {
      zh: '加拿大的小团队，自己设计、自己写、自己上线。',
      en: 'A small team in Canada that designs, builds and ships its own products.',
    },
    cta: { zh: '看产品', en: 'See products' },
    secondary: { zh: '联系我们', en: 'Contact us' },
    tag: { zh: 'SwiftMind Systems Ltd. · Canada', en: 'SwiftMind Systems Ltd. · Canada' },
  },
  manifesto: {
    eyebrow: { zh: '我们怎么做事', en: 'How we work' },
    body: {
      zh: '我们不做幻灯片里的 AI。每一个产品都从一个真实的麻烦开始，用模型和代码把它解决掉，然后交到用户手里。能上线的，才算数。',
      en: "We don't build AI for slide decks. Every product starts with a real annoyance, gets solved with models and code, and goes into users' hands. If it doesn't ship, it doesn't count.",
    },
  },
  products: {
    heading: { zh: '产品', en: 'Products' },
    intro: {
      zh: '两个在做的产品，一个已上线，一个在开发。下面还列了过去做过的。',
      en: 'Two products in progress: one live, one in development. Past work is listed below.',
    },
    archiveHeading: { zh: '过去的产品', en: 'Archive' },
    status: {
      live: { zh: '已上线', en: 'Live' },
      development: { zh: '开发中', en: 'In development' },
      retired: { zh: '已下线', en: 'Retired' },
    },
    links: {
      web: { zh: '官网', en: 'Website' },
      appstore: { zh: 'App Store', en: 'App Store' },
    },
    screenshotAlt: { zh: '{name} 截图 {n}', en: '{name} screenshot {n}' },
    savevia: {
      name: { zh: 'SaveVia', en: 'SaveVia' },
      tagline: { zh: '加拿大信用卡情报站', en: 'Credit card intelligence for Canada' },
      description: {
        zh: '把各家银行的信用卡条款、返现和开卡奖励抓下来、读懂、放进一张表里，再让 AI 助手小维根据你的消费结构告诉你该刷哪张。',
        en: "Pulls every Canadian bank's card terms, cashback rates and welcome offers into one place, then lets Xiaowei, the AI assistant, tell you which card to use based on how you spend.",
      },
      features: {
        f1: { zh: '每周自动更新的卡片库', en: 'Card library refreshed weekly' },
        f2: { zh: '按消费结构算收益', en: 'Earnings computed from your spending mix' },
        f3: { zh: 'AI 助手小维答疑', en: 'Xiaowei, an AI assistant for card questions' },
        f4: { zh: 'iOS App 与网页版', en: 'iOS app and web' },
      },
    },
    moodtini: {
      name: { zh: 'Moodtini', en: 'Moodtini' },
      tagline: { zh: '按心情推荐鸡尾酒的 AI', en: 'Mood-based AI cocktail picks' },
      description: {
        zh: '告诉它你现在的心情和场合，它从配方库里挑一杯最合适的，附调法。',
        en: 'Tell it your mood and the occasion; it picks a cocktail from the recipe library and shows you how to make it.',
      },
      features: {
        f1: { zh: '心情与场景输入', en: 'Mood and occasion input' },
        f2: { zh: '个性化推荐', en: 'Personalised recommendations' },
        f3: { zh: '调酒步骤', en: 'Step-by-step mixing' },
      },
    },
    vamerchant: {
      name: { zh: 'VAMerchant', en: 'VAMerchant' },
      tagline: { zh: '服务商预约与排班系统', en: 'Appointment and scheduling for service providers' },
    },
    skillgrove: {
      name: { zh: 'SkillGrove', en: 'SkillGrove' },
      tagline: { zh: '线上课程平台', en: 'Online course platform' },
    },
  },
  about: {
    heading: { zh: '关于', en: 'About' },
    body: {
      zh: 'SwiftMind Systems 是一家在加拿大注册的软件公司。我们自己出产品，也接少量定制开发；从需求、设计、后端、前端到上线，一条线做完。擅长的方向是把大模型接进真实业务：数据抓取与结构化、对话助手、推荐系统。',
      en: 'SwiftMind Systems is a software company registered in Canada. We build our own products and take on a small amount of custom work, covering the whole line from requirements and design to backend, frontend and launch. Our strength is wiring large language models into real workflows: data extraction and structuring, conversational assistants, recommendation systems.',
    },
    labels: {
      p1: { zh: '发布', en: 'Ship' },
      p2: { zh: '数据', en: 'Numbers' },
      p3: { zh: '工程', en: 'Engineering' },
    },
    principles: {
      p1: { zh: '先上线，再打磨。', en: 'Ship first, then polish.' },
      p2: { zh: '数字必须有来源。', en: 'Every number has a source.' },
      p3: { zh: '代码自己写，不转包。', en: 'We write the code ourselves.' },
    },
    line: {
      zh: 'SwiftMind Systems Ltd. · Canada · info@swiftmindsystems.com',
      en: 'SwiftMind Systems Ltd. · Canada · info@swiftmindsystems.com',
    },
  },
  contact: {
    heading: { zh: '有想法？聊聊。', en: "Have an idea? Let's talk." },
    cta: { zh: '发邮件', en: 'Email us' },
    email: { zh: 'info@swiftmindsystems.com', en: 'info@swiftmindsystems.com' },
  },
  footer: {
    copyright: { zh: '© 2026 SwiftMind Systems Ltd.', en: '© 2026 SwiftMind Systems Ltd.' },
    privacy: { zh: '隐私政策', en: 'Privacy' },
    terms: { zh: '服务条款', en: 'Terms' },
    savevia: { zh: 'savevia.app', en: 'savevia.app' },
  },
  legal: {
    draft: { zh: '初稿，待审定', en: 'Draft, pending review' },
  },
}

export const t = (key, language) => {
  let value = translations
  for (const k of key.split('.')) {
    value = value?.[k]
    if (value === undefined) return key
  }
  if (value && typeof value === 'object' && 'zh' in value) return value[language] ?? value.zh
  return key
}
