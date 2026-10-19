import { PRODUCTS, ARCHIVE, STATUS } from '../data/products'
import { translations } from '../translations'

test('products are ordered and unique', () => {
  const orders = PRODUCTS.map(p => p.order)
  expect(orders).toEqual([...orders].sort((a, b) => a - b))
  expect(new Set(PRODUCTS.map(p => p.slug)).size).toBe(PRODUCTS.length)
})

test('every product has a known status', () => {
  for (const p of PRODUCTS) expect(Object.values(STATUS)).toContain(p.status)
})

test('products in development have no links', () => {
  for (const p of PRODUCTS.filter(p => p.status === STATUS.development)) expect(p.links).toEqual([])
})

test('screens are webp under /screens/ with dimensions', () => {
  for (const p of PRODUCTS) for (const s of p.screens) {
    expect(s.src).toMatch(/^\/screens\/.+\.webp$/)
    expect(s.w).toBeGreaterThan(0)
    expect(s.h).toBeGreaterThan(0)
  }
})

test('archive slugs exist in translations and carry no description', () => {
  for (const a of ARCHIVE) {
    expect(translations.products[a.slug]).toBeDefined()
    expect(translations.products[a.slug].description).toBeUndefined()
  }
})
