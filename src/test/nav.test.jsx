import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from './renderWithProviders'
import Nav from '../components/Nav'

beforeEach(() => localStorage.clear())

test('renders wordmark, the three section anchors and a contact pill', () => {
  renderWithProviders(<Nav />)
  expect(screen.getByRole('link', { name: 'SwiftMind' })).toHaveAttribute('href', '#top')
  const nav = screen.getByRole('navigation')
  const products = within(nav).getByRole('link', { name: '产品' })
  expect(products).toHaveAttribute('href', '#products')
  expect(products).not.toHaveClass('mono')
  expect(within(nav).getByRole('link', { name: '关于' })).toHaveAttribute('href', '#about')
  expect(within(nav).getByRole('link', { name: '联系' })).toHaveAttribute('href', '#contact')
  const pill = within(nav).getByRole('link', { name: '联系我们' })
  expect(pill).toHaveAttribute('href', '#contact')
  expect(pill).toHaveClass('btn-primary')
  expect(document.querySelector('[data-lang-toggle]')).toHaveClass('mono')
})

test('the mobile menu also carries the contact pill', () => {
  renderWithProviders(<Nav />)
  const menu = document.getElementById('nav-menu')
  expect(within(menu).getByRole('link', { name: '联系我们', hidden: true })).toHaveAttribute('href', '#contact')
})

test('language toggle marks the active language and switches copy', async () => {
  const user = userEvent.setup()
  renderWithProviders(<Nav />)
  const zh = screen.getAllByRole('button', { name: /Chinese/ })[0]
  const en = screen.getAllByRole('button', { name: /English/ })[0]
  expect(zh).toHaveAttribute('aria-pressed', 'true')
  expect(en).toHaveAttribute('aria-pressed', 'false')
  await user.click(en)
  expect(document.documentElement.lang).toBe('en')
  expect(screen.getAllByRole('link', { name: 'Products' })[0]).toHaveAttribute('href', '#products')
  expect(en).toHaveAttribute('aria-pressed', 'true')
})

test('mobile menu opens with Enter, closes with Escape and restores focus', async () => {
  const user = userEvent.setup()
  renderWithProviders(<Nav />)
  const button = screen.getByRole('button', { name: '菜单' })
  expect(button).toHaveAttribute('aria-expanded', 'false')
  button.focus()
  await user.keyboard('{Enter}')
  expect(button).toHaveAttribute('aria-expanded', 'true')
  expect(document.getElementById('nav-menu')).toBeVisible()
  expect(document.body.style.overflow).toBe('hidden')
  await user.keyboard('{Escape}')
  expect(button).toHaveAttribute('aria-expanded', 'false')
  expect(document.activeElement).toBe(button)
  expect(document.body.style.overflow).toBe('')
})
