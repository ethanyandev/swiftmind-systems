import { screen, within } from '@testing-library/react'
import { renderWithProviders } from './renderWithProviders'
import Products from '../components/Products'

beforeEach(() => localStorage.clear())

test('lists live and in-development products, archive is text only', () => {
  renderWithProviders(<Products />)
  expect(screen.getByRole('heading', { name: '产品' })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: 'SaveVia' })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: 'Moodtini' })).toBeInTheDocument()
  expect(screen.queryByRole('heading', { name: 'VAMerchant' })).toBeNull()
  const archive = document.querySelector('ul.archive')
  expect(archive.querySelectorAll('li')).toHaveLength(2)
  expect(archive).toHaveTextContent('VAMerchant')
  expect(archive).toHaveTextContent('已下线')
  expect(archive.querySelector('a, img')).toBeNull()
})

test('savevia row links out safely, moodtini row has no links', () => {
  renderWithProviders(<Products />)
  const savevia = screen.getByRole('heading', { name: 'SaveVia' }).closest('.product-row')
  const web = within(savevia).getByRole('link', { name: '官网' })
  expect(web).toHaveAttribute('href', 'https://savevia.app')
  expect(web).toHaveAttribute('target', '_blank')
  expect(web.getAttribute('rel')).toContain('noopener')
  expect(within(savevia).getByRole('link', { name: 'App Store' })).toHaveAttribute('href', 'https://apps.apple.com/ca/app/id6756332569')
  const moodtini = screen.getByRole('heading', { name: 'Moodtini' }).closest('.product-row')
  expect(within(moodtini).queryAllByRole('link')).toHaveLength(0)
  expect(within(moodtini).getByText('开发中')).toBeInTheDocument()
})

test('every screenshot has alt, dimensions and lives under /screens/', () => {
  renderWithProviders(<Products />)
  const imgs = document.querySelectorAll('.product-row img')
  expect(imgs.length).toBeGreaterThan(0)
  for (const img of imgs) {
    expect(img.getAttribute('alt')).toBeTruthy()
    expect(img).toHaveAttribute('width')
    expect(img).toHaveAttribute('height')
    expect(img.getAttribute('src')).toMatch(/^\/screens\//)
    expect(img).toHaveAttribute('loading', 'lazy')
  }
})
