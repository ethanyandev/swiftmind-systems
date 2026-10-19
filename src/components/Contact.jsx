import React from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { useReveal } from '../lib/useReveal'
import { t } from '../translations'

export default function Contact() {
  const { language } = useLanguage()
  const ref = useReveal()
  const email = t('contact.email', language)
  return (
    <section id="contact" className="section contact" ref={ref}>
      <div className="wrap contact-inner">
        <h2 className="display contact-heading reveal">{t('contact.heading', language)}</h2>
        <p className="contact-actions reveal">
          <a className="btn-primary" href={`mailto:${email}`}>
            {t('contact.cta', language)}
          </a>
          <code className="mono email">{email}</code>
        </p>
      </div>
    </section>
  )
}
