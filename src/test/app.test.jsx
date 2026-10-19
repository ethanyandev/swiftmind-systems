import { renderWithProviders } from './renderWithProviders'
import AppInner from '../AppInner'

beforeEach(() => localStorage.clear())

test('english mode renders no chinese characters outside the language toggle', () => {
  renderWithProviders(<AppInner />, { language: 'en' })
  const clone = document.body.cloneNode(true)
  clone.querySelectorAll('[data-lang-toggle]').forEach(el => el.remove())
  expect(clone.textContent).not.toMatch(/[一-鿿]/)
})

test('main holds the five sections in order with one eyebrow', () => {
  renderWithProviders(<AppInner />)
  const ids = [...document.querySelectorAll('#main > section')].map(s => s.id)
  expect(ids).toEqual(['top', 'manifesto', 'products', 'about', 'contact'])
  expect(document.querySelectorAll('.eyebrow')).toHaveLength(1)
})

test('skip link is the first focusable element and targets main', () => {
  renderWithProviders(<AppInner />)
  const first = document.body.querySelector('a, button, input, [tabindex]')
  expect(first).toHaveClass('skip-link')
  expect(first).toHaveAttribute('href', '#main')
})
