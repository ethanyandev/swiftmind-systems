import { prefersReducedMotion } from '../lib/motion'

test('prefersReducedMotion reads the media query', () => {
  expect(prefersReducedMotion({ matchMedia: () => ({ matches: true }) })).toBe(true)
  expect(prefersReducedMotion({ matchMedia: () => ({ matches: false }) })).toBe(false)
})

test('prefersReducedMotion is false when matchMedia throws', () => {
  expect(prefersReducedMotion({ matchMedia: () => { throw new Error('nope') } })).toBe(false)
})
