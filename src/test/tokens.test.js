import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const css = readFileSync(resolve(process.cwd(), 'src/index.css'), 'utf8')
const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8')

test('accent token is the locked signal orange', () => {
  expect(css).toMatch(/--accent:\s*#FF5A1F/i)
})

test('no pure white or black anywhere in the stylesheet', () => {
  expect(css).not.toMatch(/#fff\b|#ffffff|#000\b|#000000/i)
})

test('no gradient text', () => {
  expect(css).not.toMatch(/background-clip:\s*text/)
})

test('grain, reduced-motion and focus ring are present', () => {
  expect(css).toMatch(/feTurbulence/)
  expect(css).toMatch(/prefers-reduced-motion/)
  expect(css).toMatch(/:focus-visible/)
})

test('index.html loads the two web fonts with swap and sets zh-CN', () => {
  expect(html).toMatch(/<html lang="zh-CN">/)
  expect(html).toMatch(/Space\+Grotesk:wght@700/)
  expect(html).toMatch(/JetBrains\+Mono:wght@400;500/)
  expect(html).toMatch(/display=swap/)
  expect(html).not.toMatch(/Inter/)
})
