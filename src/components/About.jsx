import React from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { useReveal } from '../lib/useReveal'
import { t, translations } from '../translations'
import SectionHead from './SectionHead'
import Surface from './Surface'

export default function About() {
  const { language } = useLanguage()
  const ref = useReveal()
  const principles = Object.keys(translations.about.principles)
  return (
    <section id="about" className="section about" ref={ref}>
      <div className="wrap">
        <div className="reveal">
          <SectionHead title={t('about.heading', language)} body={t('about.body', language)} />
        </div>
        <ul className="principles">
          {principles.map(k => (
            <Surface as="li" small key={k} className="principle reveal">
              <span className="mono muted">{t(`about.labels.${k}`, language)}</span>
              <span className="display principle-text">{t(`about.principles.${k}`, language)}</span>
            </Surface>
          ))}
        </ul>
        <p className="mono about-line faint reveal">{t('about.line', language)}</p>
      </div>
    </section>
  )
}
