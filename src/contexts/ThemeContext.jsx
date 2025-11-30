import React, { createContext, useState, useContext, useEffect } from 'react'

const ThemeContext = createContext()

const THEME_MODE_KEY = 'themeMode'
const MONOCHROME_COLOR = '#1a1a1a'

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeModeState] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(THEME_MODE_KEY) || 'colorful'
    }
    return 'colorful'
  })

  useEffect(() => {
    localStorage.setItem(THEME_MODE_KEY, themeMode)
  }, [themeMode])

  const setThemeMode = (mode) => {
    setThemeModeState(mode)
  }

  const toggleTheme = () => {
    setThemeModeState(prev => prev === 'colorful' ? 'monochrome' : 'colorful')
  }

  // 获取主题颜色 - monochrome 模式下所有颜色变为黑色
  const getThemeColor = (originalColor) => {
    if (themeMode === 'monochrome') {
      return MONOCHROME_COLOR
    }
    return originalColor || '#6366F1'
  }

  const isMonochrome = themeMode === 'monochrome'

  return (
    <ThemeContext.Provider value={{
      themeMode,
      setThemeMode,
      toggleTheme,
      getThemeColor,
      isMonochrome
    }}>
      {children}
    </ThemeContext.Provider>
  )
}
