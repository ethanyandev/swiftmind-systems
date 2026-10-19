import React from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { useReveal } from '../lib/useReveal'
import { t, translations } from '../translations'

export default function About() {
  const { language } = useLanguage()
  const ref = useReveal()
  const principles = Object.keys(translations.about.principles)
  return (
    <section id="about" className="section about" ref={ref}>
      <div className="wrap">
        <h2 className="display section-title reveal">{t('about.heading', language)}</h2>
        <div className="about-grid">
          <p className="about-body reveal">{t('about.body', language)}</p>
          <ul className="principles">
            {principles.map(k => (
              <li key={k} className="display hairline reveal">
                {t(`about.principles.${k}`, language)}
              </li>
            ))}
          </ul>
        </div>
        <p className="mono about-line muted reveal">{t('about.line', language)}</p>
      </div>
    </section>
  )
}
