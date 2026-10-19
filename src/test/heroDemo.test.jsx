import { vi } from 'vitest'
import { act, screen } from '@testing-library/react'
import { renderWithProviders } from './renderWithProviders'
import { DEMO, DEMO_STEPS, DEMO_HOLD } from '../data/demo'

const motion = { reduced: false }
vi.mock('../lib/motion', async importOriginal => {
  const mod = await importOriginal()
  return { ...mod, prefersReducedMotion: () => motion.reduced }
})

beforeEach(() => {
  localStorage.clear()
  vi.useFakeTimers()
})
afterEach(() => vi.useRealTimers())

const shown = () => document.querySelectorAll('.demo [data-step].is-in').length
const total = () => document.querySelectorAll('.demo [data-step]').length

test('demo data is the real SaveVia answer: rows add up to the total', () => {
  const sum = DEMO.rows.reduce((n, r) => n + r.value, 0)
  expect(sum).toBe(DEMO.total.value)
  expect(DEMO.total.value).toBe(438)
  expect(DEMO.source).toMatch(/03-chat\.png/)
})

test('the stage is a figure with a screen-reader caption and a hidden visual', async () => {
  motion.reduced = false
  const { default: HeroDemo } = await import('../components/HeroDemo')
  renderWithProviders(<HeroDemo />)
  const fig = document.querySelector('figure.hero-stage.demo')
  expect(fig).not.toBeNull()
  expect(fig.querySelector('figcaption.sr-only')).toHaveTextContent('小维')
  expect(fig.querySelector('.demo-visual')).toHaveAttribute('aria-hidden', 'true')
  expect(fig.querySelector('.demo-question')).toHaveTextContent(DEMO.question.zh)
  expect(fig.querySelector('.demo-card-name')).toHaveTextContent(DEMO.card.name.zh)
  expect(fig.querySelector('.demo-total')).toHaveTextContent('$438')
  expect(document.querySelector('canvas')).toBeNull()
})

test('steps appear in order, hold, then the loop restarts', async () => {
  motion.reduced = false
  const { default: HeroDemo } = await import('../components/HeroDemo')
  renderWithProviders(<HeroDemo />)
  expect(shown()).toBe(0)
  act(() => vi.advanceTimersByTime(DEMO_STEPS[0] + 1))
  expect(shown()).toBe(1)
  act(() => vi.advanceTimersByTime(DEMO_STEPS[DEMO_STEPS.length - 1]))
  expect(shown()).toBe(total())
  // Elapsed so far: DEMO_STEPS[0] + 1 + last. The loop restarts at last + DEMO_HOLD.
  const last = DEMO_STEPS[DEMO_STEPS.length - 1]
  act(() => vi.advanceTimersByTime(last + DEMO_HOLD - (DEMO_STEPS[0] + 1 + last) + 5))
  expect(shown()).toBe(0)
  act(() => vi.advanceTimersByTime(DEMO_STEPS[0]))
  expect(shown()).toBe(1)
})

test('reduced motion shows the finished answer and schedules nothing', async () => {
  motion.reduced = true
  const { default: HeroDemo } = await import('../components/HeroDemo')
  renderWithProviders(<HeroDemo />)
  expect(shown()).toBe(total())
  act(() => vi.advanceTimersByTime(60000))
  expect(shown()).toBe(total())
})

test('english mode uses the english script', async () => {
  motion.reduced = true
  const { default: HeroDemo } = await import('../components/HeroDemo')
  renderWithProviders(<HeroDemo />, { language: 'en' })
  expect(screen.getByText(DEMO.question.en)).toBeInTheDocument()
  expect(document.querySelector('.demo-card-name')).toHaveTextContent('MBNA Smart Cash Platinum Plus')
})
