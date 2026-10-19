import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from './gsap'
import { prefersReducedMotion } from './motion'

// One-shot entrance for a section: fades the children in when it enters the viewport.
export function useReveal(selector = '.reveal') {
  const ref = useRef(null)
  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.fromTo(
        selector,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', stagger: 0.08, scrollTrigger: { trigger: ref.current, start: 'top 80%', once: true } },
      )
    },
    { scope: ref },
  )
  return ref
}
