import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const privacy = readFileSync(resolve(process.cwd(), 'public/privacy.html'), 'utf8')
const terms = readFileSync(resolve(process.cwd(), 'public/terms.html'), 'utf8')

test.each([
  ['privacy', privacy],
  ['terms', terms],
])('%s page has the shared frame and no banned content', (_, html) => {
  expect(html).toContain('lang="zh-CN"')
  expect(html).toContain('/legal.css')
  expect(html).toContain('info@swiftmindsystems.com')
  expect(html).toContain('Draft, pending review')
  expect(html).not.toContain('—')
  expect(html).not.toMatch(/\d+%|\$\d/)
})

test('privacy names the host, terms names the governing law', () => {
  expect(privacy).toContain('Cloudflare')
  expect(terms).toContain('British Columbia')
})
