import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const LanguageContext = createContext(null)
const STORAGE_KEY = 'lang'
const HTML_LANG = { zh: 'zh-CN', en: 'en' }

function readStored() {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    return v === 'zh' || v === 'en' ? v : null
  } catch {
    return null
  }
}

export const useLanguage = () => {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider')
  return ctx
}

export const LanguageProvider = ({ initialLanguage = 'zh', children }) => {
  const [language, setLanguageState] = useState(() => readStored() ?? initialLanguage)

  useEffect(() => {
    document.documentElement.lang = HTML_LANG[language]
    try {
      localStorage.setItem(STORAGE_KEY, language)
    } catch {
      /* storage unavailable: language still works for this session */
    }
  }, [language])

  const setLanguage = useCallback(lang => {
    if (lang === 'zh' || lang === 'en') setLanguageState(lang)
  }, [])
  const toggleLanguage = useCallback(() => setLanguageState(prev => (prev === 'zh' ? 'en' : 'zh')), [])

  const value = useMemo(() => ({ language, setLanguage, toggleLanguage }), [language, setLanguage, toggleLanguage])
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
