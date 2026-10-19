import { vi } from 'vitest'
import { act, waitFor } from '@testing-library/react'
import { renderWithProviders } from './renderWithProviders'

const field = { setPointer: vi.fn(), setScroll: vi.fn(), pause: vi.fn(), resume: vi.fn(), resize: vi.fn(), dispose: vi.fn() }
vi.mock('../engine/waveField', () => ({ createWaveField: vi.fn(() => field) }))
vi.mock('three', () => ({}))

// Review finding 8 / Review Focus 1: shrinking below 768 after mount tears the engine down cleanly.
test('shrinking the window below 768px disposes the engine and removes the canvas', async () => {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(() => ({}))
  Object.defineProperty(window, 'innerWidth', { configurable: true, writable: true, value: 1280 })
  const { default: Hero } = await import('../components/Hero')
  renderWithProviders(<Hero />)
  await waitFor(() => expect(document.querySelector('.hero-engine canvas.is-ready')).not.toBeNull())
  expect(document.querySelector('.hero.is-engine-ready')).not.toBeNull()
  vi.useFakeTimers()
  window.innerWidth = 700
  act(() => {
    window.dispatchEvent(new Event('resize'))
    vi.advanceTimersByTime(250)
  })
  vi.useRealTimers()
  expect(field.dispose).toHaveBeenCalledTimes(1)
  expect(document.querySelector('.hero-engine canvas')).toBeNull()
  expect(document.querySelector('.hero.is-engine-ready')).toBeNull()
})
