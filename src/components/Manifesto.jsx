import React, { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '../lib/gsap'
import { useLanguage } from '../contexts/LanguageContext'
import { prefersReducedMotion } from '../lib/motion'
import { splitWords } from '../lib/text'
import { t } from '../translations'

export default function Manifesto() {
  const { language } = useLanguage()
  const ref = useRef(null)
  const body = t('manifesto.body', language)
  const words = splitWords(body, language)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.fromTo(
        '.word',
        { opacity: 0, y: 6 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.018,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: ref.current, start: 'top 75%', once: true },
        },
      )
    },
    { scope: ref, dependencies: [language], revertOnUpdate: true },
  )

  return (
    <section id="manifesto" className="section manifesto" ref={ref}>
      <div className="wrap manifesto-grid">
        <p className="eyebrow">{t('manifesto.eyebrow', language)}</p>
        <p className="display manifesto-body">
          <span className="sr-only">{body}</span>
          <span aria-hidden="true">
            {words.map((w, i) => (
              <span key={`${language}-${i}`} className="word">
                {w}
                {language === 'en' && i < words.length - 1 ? ' ' : ''}
              </span>
            ))}
          </span>
        </p>
      </div>
    </section>
  )
}
