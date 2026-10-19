// Product facts that are not copy. Names, taglines, descriptions and features live in translations.products.<slug>.
export const STATUS = { live: 'live', development: 'development', retired: 'retired' }

export const PRODUCTS = [
  {
    slug: 'savevia',
    status: STATUS.live,
    order: 1,
    palette: 'ember',
    links: [
      { kind: 'web', href: 'https://savevia.app' },
      { kind: 'appstore', href: 'https://apps.apple.com/ca/app/id6756332569' },
    ],
    screens: [
      { src: '/screens/savevia-1.webp', w: 1290, h: 2796 },
      { src: '/screens/savevia-2.webp', w: 1290, h: 2796 },
    ],
  },
  {
    slug: 'moodtini',
    status: STATUS.development,
    order: 2,
    palette: 'lilac',
    links: [],
    screens: [{ src: '/screens/moodtini-1.webp', w: 1600, h: 1008 }],
  },
]

export const ARCHIVE = [{ slug: 'vamerchant' }, { slug: 'skillgrove' }]
