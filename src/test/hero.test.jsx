import { screen } from '@testing-library/react'
import { renderWithProviders } from './renderWithProviders'
import Hero from '../components/Hero'

beforeEach(() => localStorage.clear())

test('hero shows the title, both actions and the tag', () => {
  renderWithProviders(<Hero />)
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('我们把 AI 做成能用的产品。')
  expect(screen.getByRole('link', { name: '看产品' })).toHaveAttribute('href', '#products')
  expect(screen.getByRole('link', { name: '联系我们' })).toHaveAttribute('href', '#contact')
  expect(screen.getByText('SwiftMind Systems Ltd. · Canada')).toBeInTheDocument()
})

test('hero carries the still image as a decorative background', () => {
  renderWithProviders(<Hero />)
  const img = document.querySelector('img.hero-still')
  expect(img).toHaveAttribute('src', '/hero-still.webp')
  expect(img).toHaveAttribute('alt', '')
  expect(img).toHaveAttribute('width', '1600')
  expect(img).toHaveAttribute('height', '1000')
})

test('hero section is the #top landmark with an engine slot', () => {
  renderWithProviders(<Hero />)
  expect(document.getElementById('top')).not.toBeNull()
  expect(document.querySelector('#top .hero-engine')).not.toBeNull()
})
