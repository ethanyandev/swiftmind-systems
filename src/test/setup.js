import '@testing-library/jest-dom/vitest'

if (typeof globalThis.IntersectionObserver === 'undefined') {
  globalThis.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
}

vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: { create: () => ({ kill() {} }), getAll: () => [], refresh() {}, kill() {} },
}))
