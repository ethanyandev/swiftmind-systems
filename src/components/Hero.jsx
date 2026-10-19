import React, { Suspense, lazy, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '../lib/gsap'
import { prefersReducedMotion, useCanRunEngine } from '../lib/motion'
import { useLanguage } from '../contexts/LanguageContext'
import { splitWords } from '../lib/text'
import { t } from '../translations'

const HeroEngine = lazy(() => import('./HeroEngine'))

export default function Hero() {
  const { language } = useLanguage()
  const engineOk = useCanRunEngine()
  const ref = useRef(null)
  const title = t('hero.title', language)
  const words = splitWords(title, language)

  // Entrance: title words, then actions, subtitle and the stage. One timeline, once per language.
  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap
        .timeline({ defaults: { ease: 'power2.out' } })
        .from('.hero-title .word', { opacity: 0, y: 16, duration: 0.7, stagger: 0.04 })
        .from('.hero-actions', { opacity: 0, y: 12, duration: 0.5 }, '-=0.35')
        .from('.hero-subtitle', { opacity: 0, y: 12, duration: 0.5 }, '-=0.4')
        .from('.hero-stage', { opacity: 0, y: 24, duration: 0.8 }, '-=0.3')
    },
    { scope: ref, dependencies: [language], revertOnUpdate: true },
  )

  return (
    <section id="top" className="hero" ref={ref}>
      <div className="wrap">
        <div className="hero-copy">
          <div className="hero-lead">
            <h1 className="display hero-title">
              <span className="sr-only">{title}</span>
              <span aria-hidden="true">
                {words.map((w, i) => (
                  <span key={`${language}-${i}`} className="word">
                    {w}
                    {language === 'en' && i < words.length - 1 ? ' ' : ''}
                  </span>
                ))}
              </span>
            </h1>
            <div className="hero-actions">
              <a className="btn-primary" href="#products">
                {t('hero.cta', language)}
              </a>
              <a className="btn-secondary" href="#contact">
                {t('hero.secondary', language)}
              </a>
            </div>
          </div>
          <p className="hero-subtitle muted">{t('hero.subtitle', language)}</p>
        </div>
        <div className="hero-stage surface">
          <img className="hero-still" src="/hero-still.webp" alt="" width="1200" height="560" fetchPriority="high" />
          {engineOk ? (
            <Suspense fallback={<div className="hero-engine" aria-hidden="true" />}>
              <HeroEngine />
            </Suspense>
          ) : (
            <div className="hero-engine" aria-hidden="true" />
          )}
          <p className="mono hero-tag faint">{t('hero.tag', language)}</p>
        </div>
      </div>
    </section>
  )
}
