import { vi } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { act, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from './renderWithProviders'
import { splitWords } from '../lib/text'

const css = readFileSync(resolve(process.cwd(), 'src/index.css'), 'utf8')

// Review finding 1: the still image must give way to the live canvas.
test('stylesheet hides the still once the engine is ready', () => {
  expect(css).toMatch(/\.hero-stage\.is-engine-ready \.hero-still\s*\{[^}]*opacity:\s*0/)
})

// Review finding 3: english body copy must not fall back to the 700-only display face.
test('english body text is not forced onto Space Grotesk', () => {
  expect(css).not.toMatch(/:lang\(en\)\s*body/)
})

// Review finding 4: chinese line-start punctuation and latin runs stay in one unit.
test('splitWords keeps chinese punctuation attached and latin runs whole', () => {
  expect(splitWords('AI。', 'zh')).toEqual(['AI。'])
  expect(splitWords('开始，用', 'zh')).toEqual(['开', '始，', '用'])
  expect(splitWords('幻灯片里的 AI。每', 'zh').join('')).toBe('幻灯片里的 AI。每')
  expect(splitWords('有想法？聊聊。', 'zh')).toEqual(['有', '想', '法？', '聊', '聊。'])
})

// Review finding 5: widening past the breakpoint closes the menu and releases scroll.
test('menu closes when the viewport grows past 768px', async () => {
  const listeners = []
  const original = window.matchMedia
  window.matchMedia = vi.fn(query => ({
    matches: false,
    media: query,
    addEventListener: (_, cb) => listeners.push(cb),
    removeEventListener: () => {},
  }))
  const { default: Nav } = await import('../components/Nav')
  const user = userEvent.setup()
  renderWithProviders(<Nav />)
  const button = screen.getByRole('button', { name: '菜单' })
  await user.click(button)
  expect(button).toHaveAttribute('aria-expanded', 'true')
  act(() => listeners.forEach(cb => cb({ matches: true })))
  expect(button).toHaveAttribute('aria-expanded', 'false')
  expect(document.body.style.overflow).toBe('')
  window.matchMedia = original
})

// Review finding 6: the manifest ships too, so it obeys the copy rules and the palette.
test('web manifest carries the new description and palette', () => {
  const manifest = JSON.parse(readFileSync(resolve(process.cwd(), 'public/site.webmanifest'), 'utf8'))
  expect(manifest.description).not.toMatch(/赋能|引领|卓越|一站式|创新科技/)
  expect(manifest.theme_color.toUpperCase()).toBe('#FAFAF8')
  expect(manifest.background_color.toUpperCase()).toBe('#FAFAF8')
})

// Review finding 7: product data must not point at the screenshots carrying the savings banner.
test('savevia screens are the banner-free set', () => {
  const { PRODUCTS } = require('../data/products')
  const savevia = PRODUCTS.find(p => p.slug === 'savevia')
  expect(savevia.screens.map(s => s.src)).toEqual(['/screens/savevia-1.webp', '/screens/savevia-2.webp'])
  const manifest = readFileSync(resolve(process.cwd(), 'public/screens/SOURCES.md'), 'utf8')
  expect(manifest).toMatch(/savevia-1\.webp ← public\/SaveVia\/4\.png/)
  expect(manifest).toMatch(/savevia-2\.webp ← public\/SaveVia\/6\.png/)
  expect(manifest).not.toMatch(/savevia-\d\.webp ← public\/SaveVia\/1\.png/)
})
