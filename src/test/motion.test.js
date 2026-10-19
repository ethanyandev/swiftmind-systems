import { canRunEngine, hasWebGL, prefersReducedMotion } from '../lib/motion'

test('engine runs only on wide, motion-ok, webgl-capable clients', () => {
  expect(canRunEngine({ width: 1280, reduced: false, webgl: true })).toBe(true)
  expect(canRunEngine({ width: 767, reduced: false, webgl: true })).toBe(false)
  expect(canRunEngine({ width: 1280, reduced: true, webgl: true })).toBe(false)
  expect(canRunEngine({ width: 1280, reduced: false, webgl: false })).toBe(false)
})

test('hasWebGL is false when getContext throws', () => {
  const doc = { createElement: () => ({ getContext: () => { throw new Error('nope') } }) }
  expect(hasWebGL(doc)).toBe(false)
})

test('hasWebGL is true when a webgl context is returned', () => {
  const doc = { createElement: () => ({ getContext: () => ({}) }) }
  expect(hasWebGL(doc)).toBe(true)
})

test('prefersReducedMotion reads the media query', () => {
  const win = { matchMedia: () => ({ matches: true }) }
  expect(prefersReducedMotion(win)).toBe(true)
})
