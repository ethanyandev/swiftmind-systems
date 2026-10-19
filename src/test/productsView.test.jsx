import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { screen, within } from '@testing-library/react'
import { renderWithProviders } from './renderWithProviders'
import Products from '../components/Products'
import { translations } from '../translations'

const css = readFileSync(resolve(process.cwd(), 'src/index.css'), 'utf8')

beforeEach(() => localStorage.clear())

test('section opens with a head, lists live and in-development products as surface cards, archive as small cards', () => {
  renderWithProviders(<Products />)
  const head = document.querySelector('#products .section-head')
  expect(within(head).getByRole('heading', { name: '产品' })).toBeInTheDocument()
  expect(head.querySelector('.section-body')).toHaveTextContent(translations.products.intro.zh)
  const cards = document.querySelectorAll('#products article.product-card.surface')
  expect(cards).toHaveLength(2)
  expect(document.querySelector('.is-flipped')).toBeNull()
  expect(screen.queryByRole('heading', { name: 'VAMerchant' })).toBeNull()
  const archive = document.querySelector('ul.archive')
  const items = archive.querySelectorAll('li.surface-sm')
  expect(items).toHaveLength(2)
  expect(archive).toHaveTextContent('VAMerchant')
  expect(archive).toHaveTextContent('已下线')
  expect(archive.querySelector('a, img')).toBeNull()
})

test('savevia card links out safely with pill buttons, moodtini card has no links', () => {
  renderWithProviders(<Products />)
  const savevia = screen.getByRole('heading', { name: 'SaveVia' }).closest('.product-card')
  const web = within(savevia).getByRole('link', { name: '官网' })
  expect(web).toHaveAttribute('href', 'https://savevia.app')
  expect(web).toHaveAttribute('target', '_blank')
  expect(web.getAttribute('rel')).toContain('noopener')
  expect(web).toHaveClass('btn-secondary')
  expect(within(savevia).getByRole('link', { name: 'App Store' })).toHaveAttribute('href', 'https://apps.apple.com/ca/app/id6756332569')
  expect(savevia.querySelector('.board')).toHaveAttribute('data-palette', 'ember')
  expect(within(savevia).getByText('已上线')).toBeInTheDocument()
  const moodtini = screen.getByRole('heading', { name: 'Moodtini' }).closest('.product-card')
  expect(within(moodtini).queryAllByRole('link')).toHaveLength(0)
  expect(moodtini.querySelector('.board')).toHaveAttribute('data-palette', 'lilac')
  expect(within(moodtini).getByText('开发中')).toBeInTheDocument()
})

test('feature lists render every feature; screenshots have alt, dimensions and live under /screens/', () => {
  renderWithProviders(<Products />)
  const savevia = screen.getByRole('heading', { name: 'SaveVia' }).closest('.product-card')
  expect(savevia.querySelectorAll('.product-features li')).toHaveLength(Object.keys(translations.products.savevia.features).length)
  const imgs = document.querySelectorAll('.product-card img')
  expect(imgs.length).toBe(3)
  for (const img of imgs) {
    expect(img.getAttribute('alt')).toBeTruthy()
    expect(img).toHaveAttribute('width')
    expect(img).toHaveAttribute('height')
    expect(img.getAttribute('src')).toMatch(/^\/screens\//)
    expect(img).toHaveAttribute('loading', 'lazy')
  }
})

test('cards without links never lift on hover; feature rows are separated by hairlines', () => {
  expect(css).not.toMatch(/\.product-card:hover/)
  expect(css).not.toMatch(/\.archive li:hover/)
  expect(css).toMatch(/\.product-features li \+ li\s*\{[^}]*border-top/)
  expect(css).toMatch(/\.board\[data-palette=['"]ember['"]\]/)
  expect(css).toMatch(/\.board\[data-palette=['"]lilac['"]\]/)
})

test('only the card with links gets the hover lift class', () => {
  renderWithProviders(<Products />)
  expect(screen.getByRole('heading', { name: 'SaveVia' }).closest('.product-card')).toHaveClass('has-link')
  expect(screen.getByRole('heading', { name: 'Moodtini' }).closest('.product-card')).not.toHaveClass('has-link')
  expect(css).toMatch(/\.surface\.has-link:hover\s*\{[^}]*transform:\s*translateY\(-2px\)/)
})
