import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const css = readFileSync(resolve(process.cwd(), 'src/index.css'), 'utf8')
const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8')

test('palette is the v2 near-white surface set with neutral text', () => {
  expect(css).toMatch(/--bg:\s*#FAFAF8/i)
  expect(css).toMatch(/--surface:\s*#F3F3F0/i)
  expect(css).toMatch(/--surface-2:\s*#ECECE8/i)
  expect(css).toMatch(/--fg:\s*#111110/i)
  expect(css).toMatch(/--fg-muted:\s*#6E6D68/i)
  expect(css).toMatch(/--fg-faint:\s*#6B6A65/i)
  expect(css).toMatch(/color-scheme:\s*light/)
  expect(css).not.toMatch(/#0A0A0B|#F5F2EC|#141311/i)
})

test('the interface layer has no accent colour; orange lives only in the orb palette block', () => {
  expect(css).not.toMatch(/--accent:/)
  const orbBlock = css.match(/\/\* orb palettes \*\/[\s\S]*?\/\* end orb palettes \*\//)
  expect(orbBlock).not.toBeNull()
  const outside = css.replace(orbBlock[0], '')
  expect(outside).not.toMatch(/#FF5A1F|#FF9A5C|#7B6CFF/i)
})

test('no pure white or black anywhere in the stylesheet', () => {
  expect(css).not.toMatch(/#fff\b|#ffffff|#000\b|#000000/i)
})

test('no gradient text, no heavy display weights', () => {
  expect(css).not.toMatch(/background-clip:\s*text/)
  expect(css).not.toMatch(/font-weight:\s*(6|7|8|9)00/)
})

test('grain, reduced-motion and a neutral focus ring are present', () => {
  expect(css).toMatch(/feTurbulence/)
  expect(css).toMatch(/prefers-reduced-motion/)
  expect(css).toMatch(/:focus-visible\s*\{[^}]*outline:\s*2px solid var\(--fg\)/)
})

test('index.html loads Geist and Geist Mono non-blocking and sets zh-CN', () => {
  expect(html).toMatch(/<html lang="zh-CN">/)
  expect(html).toMatch(/family=Geist:wght@400;500/)
  expect(html).toMatch(/family=Geist\+Mono:wght@400/)
  expect(html).toMatch(/display=swap/)
  expect(html).toMatch(/media="print"/)
  expect(html).not.toMatch(/Space\+Grotesk|JetBrains|Inter/)
  expect(html).toMatch(/theme-color" content="#FAFAF8"/)
  expect(html).toMatch(/og:image" content="https:\/\/swiftmindsystems\.com\/og\.png"/)
})
