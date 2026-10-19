import { screen } from '@testing-library/react'
import { renderWithProviders } from './renderWithProviders'
import Hero from '../components/Hero'

beforeEach(() => localStorage.clear())

test('hero shows the title, subtitle, both pill actions and the tag', () => {
  renderWithProviders(<Hero />)
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('我们把 AI 做成能用的产品。')
  expect(document.querySelector('.hero-copy .hero-subtitle')).toHaveTextContent('加拿大的小团队')
  const primary = screen.getByRole('link', { name: '看产品' })
  expect(primary).toHaveAttribute('href', '#products')
  expect(primary).toHaveClass('btn-primary')
  const secondary = screen.getByRole('link', { name: '联系我们' })
  expect(secondary).toHaveAttribute('href', '#contact')
  expect(secondary).toHaveClass('btn-secondary')
})

test('the copy row comes before the demo stage', () => {
  renderWithProviders(<Hero />)
  const copy = document.querySelector('#top .hero-copy')
  const stage = document.querySelector('#top figure.hero-stage.demo')
  expect(stage).not.toBeNull()
  expect(copy.compareDocumentPosition(stage) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  expect(stage.querySelector('.hero-tag')).toHaveTextContent('SaveVia 2.0')
  expect(document.querySelector('canvas, img.hero-still')).toBeNull()
})
