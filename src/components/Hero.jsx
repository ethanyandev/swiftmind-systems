import React, { Suspense, lazy } from 'react'
import { useCanRunEngine } from '../lib/motion'
import { useLanguage } from '../contexts/LanguageContext'
import { t } from '../translations'

const HeroEngine = lazy(() => import('./HeroEngine'))

export default function Hero() {
  const { language } = useLanguage()
  const engineOk = useCanRunEngine()
  return (
    <section id="top" className="hero">
      <div className="wrap">
        <div className="hero-copy">
          <div className="hero-lead">
            <h1 className="display hero-title">{t('hero.title', language)}</h1>
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
