import React from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { t } from '../translations'

export default function Hero() {
  const { language } = useLanguage()
  return (
    <section id="top" className="hero">
      <img className="hero-still" src="/hero-still.webp" alt="" width="1600" height="1000" fetchPriority="high" />
      <div className="hero-engine" aria-hidden="true" />
      <div className="vignette" />
      <div className="wrap hero-content">
        <h1 className="display hero-title">{t('hero.title', language)}</h1>
        <p className="hero-subtitle">{t('hero.subtitle', language)}</p>
        <div className="hero-actions">
          <a className="btn-primary" href="#products">
            {t('hero.cta', language)}
          </a>
          <a className="btn-link" href="#contact">
            {t('hero.secondary', language)}
          </a>
        </div>
        <p className="mono hero-tag muted">{t('hero.tag', language)}</p>
      </div>
    </section>
  )
}
