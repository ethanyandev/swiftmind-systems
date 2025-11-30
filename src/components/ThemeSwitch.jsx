import React from 'react'
import { useTheme } from '../contexts/ThemeContext'

const ThemeSwitch = () => {
  const { themeMode, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center w-9 h-9 rounded-lg text-[#666] hover:text-[#6366F1] hover:bg-[#6366F1]/5 transition-colors duration-200"
      aria-label="Toggle theme"
      title={themeMode === 'colorful' ? 'Switch to Monochrome' : 'Switch to Colorful'}
    >
      {themeMode === 'colorful' ? (
        // 彩色模式图标 - 调色板
        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ) : (
        // 极简模式图标 - 圆形
        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" strokeWidth={1.5} />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v18M3 12h18" />
        </svg>
      )}
    </button>
  )
}

export default ThemeSwitch
