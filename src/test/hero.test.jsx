import { vi } from 'vitest'
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
  expect(screen.getByText('SwiftMind Systems Ltd. · Canada')).toBeInTheDocument()
})

test('the copy row comes before the stage, and the stage holds the still, the engine slot and the tag', () => {
  renderWithProviders(<Hero />)
  const copy = document.querySelector('#top .hero-copy')
  const stage = document.querySelector('#top .hero-stage')
  expect(copy).not.toBeNull()
  expect(stage).not.toBeNull()
  expect(copy.compareDocumentPosition(stage) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  const img = stage.querySelector('img.hero-still')
  expect(img).toHaveAttribute('src', '/hero-still.webp')
  expect(img).toHaveAttribute('alt', '')
  expect(img).toHaveAttribute('width', '1200')
  expect(img).toHaveAttribute('height', '560')
  expect(stage.querySelector('.hero-engine')).not.toBeNull()
  expect(stage.querySelector('.hero-tag')).toHaveTextContent('SwiftMind Systems Ltd. · Canada')
  expect(stage.querySelector('.hero-engine').compareDocumentPosition(stage.querySelector('.hero-tag')) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
})

test('without the engine the copy still renders and no canvas is created', () => {
  renderWithProviders(<Hero />)
  expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  expect(document.querySelector('canvas')).toBeNull()
  expect(document.querySelector('.vignette')).toBeNull()
})
