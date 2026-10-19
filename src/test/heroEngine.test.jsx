import { vi } from 'vitest'
import { waitFor } from '@testing-library/react'
import { renderWithProviders } from './renderWithProviders'

vi.mock('../lib/motion', async importOriginal => {
  const mod = await importOriginal()
  return { ...mod, useCanRunEngine: () => true }
})

vi.mock('three', () => ({
  WebGLRenderer: class { constructor() { throw new Error('WebGL unavailable') } },
}))

test('a throwing WebGLRenderer leaves the still image and no canvas', async () => {
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
  const { default: Hero } = await import('../components/Hero')
  renderWithProviders(<Hero />)
  await waitFor(() => expect(warn).toHaveBeenCalled())
  expect(document.querySelector('.hero-stage canvas')).toBeNull()
  expect(document.querySelector('img.hero-still')).toBeInTheDocument()
  warn.mockRestore()
})
