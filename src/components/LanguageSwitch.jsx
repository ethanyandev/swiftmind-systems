import React from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { useTheme } from '../contexts/ThemeContext'

const LanguageSwitch = () => {
  const { language, toggleLanguage } = useLanguage()
  const { getThemeColor } = useTheme()

  const primaryColor = getThemeColor('#6366F1')

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[#666] transition-colors duration-200"
      aria-label="Switch Language"
      onMouseEnter={(e) => {
        e.currentTarget.style.color = primaryColor
        e.currentTarget.style.backgroundColor = `${primaryColor}08`
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = '#666'
        e.currentTarget.style.backgroundColor = 'transparent'
      }}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
      </svg>
      <span className="text-xs font-medium">
        {language === 'zh' ? 'EN' : '中文'}
      </span>
    </button>
  )
}

export default LanguageSwitch
