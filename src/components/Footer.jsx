import React from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { t } from '../translations'

export default function Footer() {
  const { language } = useLanguage()
  return (
    <footer className="site-footer hairline mono">
      <div className="wrap site-footer-row">
        <span className="muted">{t('footer.copyright', language)}</span>
        <nav className="site-footer-links" aria-label="Footer">
          <a href="https://savevia.app" target="_blank" rel="noopener noreferrer">
            {t('footer.savevia', language)}
          </a>
          <a href="/privacy.html">{t('footer.privacy', language)}</a>
          <a href="/terms.html">{t('footer.terms', language)}</a>
        </nav>
      </div>
    </footer>
  )
}
