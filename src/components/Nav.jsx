import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { t } from '../translations'

const ITEMS = [
  { id: 'products', key: 'nav.products' },
  { id: 'about', key: 'nav.about' },
  { id: 'contact', key: 'nav.contact' },
]

function LangToggle({ language, setLanguage, onPick }) {
  const pick = lang => {
    setLanguage(lang)
    onPick?.()
  }
  return (
    <div className="lang-toggle mono" data-lang-toggle role="group" aria-label={t('nav.lang', language)}>
      <button type="button" aria-label="Chinese" aria-pressed={language === 'zh'} onClick={() => pick('zh')}>
        中
      </button>
      <span aria-hidden="true">/</span>
      <button type="button" aria-label="English" aria-pressed={language === 'en'} onClick={() => pick('en')}>
        EN
      </button>
    </div>
  )
}

export default function Nav() {
  const { language, setLanguage } = useLanguage()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const buttonRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const close = useCallback(() => {
    setOpen(false)
    buttonRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!open) {
      document.body.style.overflow = ''
      return undefined
    }
    document.body.style.overflow = 'hidden'
    const onKey = e => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, close])

  return (
    <header className={`site-nav${scrolled ? ' is-scrolled' : ''}${open ? ' is-open' : ''}`}>
      <div className="wrap site-nav-row">
        <a className="wordmark display" href="#top" aria-label="SwiftMind">
          SwiftMind
        </a>
        <nav className="site-nav-links" aria-label={t('nav.menu', language)}>
          {ITEMS.map(item => (
            <a key={item.id} className="mono" href={`#${item.id}`}>
              {t(item.key, language)}
            </a>
          ))}
          <LangToggle language={language} setLanguage={setLanguage} />
        </nav>
        <button
          ref={buttonRef}
          type="button"
          className="menu-button mono"
          aria-expanded={open}
          aria-controls="nav-menu"
          onClick={() => (open ? close() : setOpen(true))}
        >
          {open ? t('nav.close', language) : t('nav.menu', language)}
        </button>
      </div>
      <div id="nav-menu" className="nav-menu" hidden={!open}>
        <div className="wrap nav-menu-inner">
          {ITEMS.map(item => (
            <a key={item.id} className="display nav-menu-link" href={`#${item.id}`} onClick={close}>
              {t(item.key, language)}
            </a>
          ))}
          <LangToggle language={language} setLanguage={setLanguage} onPick={close} />
        </div>
      </div>
    </header>
  )
}
