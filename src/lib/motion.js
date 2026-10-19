import { useEffect, useState } from 'react'

export const ENGINE_MIN_WIDTH = 768

export function prefersReducedMotion(win = typeof window !== 'undefined' ? window : undefined) {
  try {
    return Boolean(win?.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches)
  } catch {
    return false
  }
}

export function hasWebGL(doc = typeof document !== 'undefined' ? document : undefined) {
  try {
    const canvas = doc.createElement('canvas')
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}

export function canRunEngine({ width, reduced, webgl }) {
  return width >= ENGINE_MIN_WIDTH && !reduced && Boolean(webgl)
}

function evaluate() {
  return canRunEngine({
    width: window.innerWidth,
    reduced: prefersReducedMotion(),
    webgl: hasWebGL(),
  })
}

export function useCanRunEngine() {
  const [ok, setOk] = useState(false)
  useEffect(() => {
    setOk(evaluate())
    let timer
    const onResize = () => {
      clearTimeout(timer)
      timer = setTimeout(() => setOk(evaluate()), 200)
    }
    window.addEventListener('resize', onResize)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', onResize)
    }
  }, [])
  return ok
}
