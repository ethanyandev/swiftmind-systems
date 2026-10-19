import { translations, t } from '../translations'

const leaves = []
function walk(node, path) {
  if (node && typeof node === 'object' && 'zh' in node && 'en' in node) {
    leaves.push({ path, ...node })
    return
  }
  for (const [k, v] of Object.entries(node)) walk(v, path ? `${path}.${k}` : k)
}
walk(translations, '')

test('there is copy to check', () => {
  expect(leaves.length).toBeGreaterThan(30)
})

test('every leaf has non-empty zh and en', () => {
  for (const l of leaves) {
    expect(typeof l.zh === 'string' && l.zh.length > 0, l.path).toBe(true)
    expect(typeof l.en === 'string' && l.en.length > 0, l.path).toBe(true)
  }
})

test('zh copy avoids the banned marketing words', () => {
  for (const l of leaves) expect(l.zh, l.path).not.toMatch(/赋能|引领|卓越|一站式|创新科技/)
})

test('en copy has no em-dash', () => {
  for (const l of leaves) expect(l.en, l.path).not.toContain('—')
})

test('no fake-precise numbers anywhere', () => {
  for (const l of leaves) {
    expect(l.zh, l.path).not.toMatch(/\d+%|\$\d/)
    expect(l.en, l.path).not.toMatch(/\d+%|\$\d/)
  }
})

test('t resolves the hero title and falls back to the key', () => {
  expect(t('hero.title', 'en')).toBe('We turn AI into products people actually use.')
  expect(t('hero.title', 'zh')).toBe('我们把 AI 做成能用的产品。')
  expect(t('nope.key', 'zh')).toBe('nope.key')
})
