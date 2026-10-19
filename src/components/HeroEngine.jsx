import React, { useEffect, useRef } from 'react'
import { createWaveField } from '../engine/waveField'

export default function HeroEngine() {
  const hostRef = useRef(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return undefined
    const section = host.parentElement
    let field = null
    let cancelled = false
    let pointerRaf = 0
    let pendingPointer = null
    const canvas = document.createElement('canvas')
    host.appendChild(canvas)

    const onPointer = e => {
      pendingPointer = e
      if (pointerRaf) return
      pointerRaf = requestAnimationFrame(() => {
        pointerRaf = 0
        if (!field || !pendingPointer) return
        const r = host.getBoundingClientRect()
        const nx = ((pendingPointer.clientX - r.left) / r.width) * 2 - 1
        const ny = ((pendingPointer.clientY - r.top) / r.height) * 2 - 1
        field.setPointer(nx, ny)
      })
    }
    const onScroll = () => {
      if (!field) return
      field.setScroll(window.scrollY / Math.max(window.innerHeight, 1))
    }
    const onResize = () => {
      if (!field) return
      field.resize(host.clientWidth, host.clientHeight)
    }
    const observer = new IntersectionObserver(
      entries => {
        if (!field) return
        if (entries[0].isIntersecting) field.resume()
        else field.pause()
      },
      { threshold: 0 },
    )

    // Start after the page has loaded and the main thread is idle, so the first paint is never delayed by the engine.
    const whenIdle = () =>
      new Promise(resolve => {
        const idle = () => (window.requestIdleCallback ? window.requestIdleCallback(resolve, { timeout: 1500 }) : setTimeout(resolve, 300))
        if (document.readyState === 'complete') idle()
        else window.addEventListener('load', idle, { once: true })
      })

    whenIdle()
      .then(() => import('three'))
      .then(THREE => {
        if (cancelled) return
        try {
          field = createWaveField(canvas, { THREE })
        } catch (err) {
          console.warn('[hero] engine unavailable, keeping static hero', err)
          canvas.remove()
          return
        }
        canvas.classList.add('is-ready')
        section?.classList.add('is-engine-ready')
        window.addEventListener('pointermove', onPointer, { passive: true })
        window.addEventListener('scroll', onScroll, { passive: true })
        window.addEventListener('resize', onResize)
        observer.observe(host)
      })
      .catch(err => {
        console.warn('[hero] failed to load engine', err)
        canvas.remove()
      })

    return () => {
      cancelled = true
      if (pointerRaf) cancelAnimationFrame(pointerRaf)
      window.removeEventListener('pointermove', onPointer)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      observer.disconnect()
      field?.dispose()
      canvas.remove()
      section?.classList.remove('is-engine-ready')
    }
  }, [])

  return <div ref={hostRef} className="hero-engine" aria-hidden="true" />
}
