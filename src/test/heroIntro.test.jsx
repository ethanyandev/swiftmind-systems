import { vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from './renderWithProviders'

const tl = { from: vi.fn(function () { return this }), to: vi.fn(function () { return this }) }
const gsapMock = { timeline: vi.fn(() => tl), fromTo: vi.fn(), from: vi.fn(), to: vi.fn(), registerPlugin: vi.fn() }
vi.mock('../lib/gsap', () => ({ gsap: gsapMock, ScrollTrigger: {} }))

const motion = { reduced: false }
vi.mock('../lib/motion', async importOriginal => {
  const mod = await importOriginal()
  return { ...mod, prefersReducedMotion: () => motion.reduced, useCanRunEngine: () => false }
})

beforeEach(() => {
  localStorage.clear()
  vi.clearAllMocks()
})

test('hero runs an entrance timeline over the title words, actions, subtitle and stage', async () => {
  motion.reduced = false
  const { default: Hero } = await import('../components/Hero')
  renderWithProviders(<Hero />)
  expect(gsapMock.timeline).toHaveBeenCalledTimes(1)
  const targets = tl.from.mock.calls.map(c => c[0])
  expect(targets).toEqual(['.hero-title .word', '.hero-actions', '.hero-subtitle', '.hero-stage'])
  expect(document.querySelectorAll('.hero-title .word').length).toBeGreaterThan(1)
  expect(document.querySelector('.hero-title .sr-only')).toHaveTextContent('我们把 AI 做成能用的产品。')
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('我们把 AI 做成能用的产品。')
})

test('reduced motion skips the entrance timeline entirely', async () => {
  motion.reduced = true
  const { default: Hero } = await import('../components/Hero')
  renderWithProviders(<Hero />)
  expect(gsapMock.timeline).not.toHaveBeenCalled()
  expect(tl.from).not.toHaveBeenCalled()
})
