import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from './gsap'
import { prefersReducedMotion } from './motion'

// One-shot entrance: each matching child fades in when it enters the viewport.
export function useReveal(selector = '.reveal') {
  const ref = useRef(null)
  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      // One trigger per element, so cards further down reveal when they arrive, not with the section top.
      // clearProps hands transform back to CSS afterwards, so hover lift works on revealed cards.
      gsap.utils.toArray(selector, ref.current).forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            delay: (i % 3) * 0.08,
            clearProps: 'transform',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          },
        )
      })
    },
    { scope: ref },
  )
  return ref
}
