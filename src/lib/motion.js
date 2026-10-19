export function prefersReducedMotion(win = typeof window !== 'undefined' ? window : undefined) {
  try {
    return Boolean(win?.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches)
  } catch {
    return false
  }
}
