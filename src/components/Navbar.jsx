import React, { useState, useEffect } from 'react'
import Logo from './Logo'
import LanguageSwitch from './LanguageSwitch'
import ThemeSwitch from './ThemeSwitch'
import { useLanguage } from '../contexts/LanguageContext'
import { useTheme } from '../contexts/ThemeContext'
import { t } from '../translations'

const Navbar = () => {
  const { language } = useLanguage()
  const { getThemeColor } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const primaryColor = getThemeColor('#6366F1')

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    element?.scrollIntoView({ behavior: 'smooth' })
    setIsMenuOpen(false)
  }

  const navItems = [
    { id: 'home', key: 'navbar.home' },
    { id: 'products', key: 'navbar.products' },
    { id: 'about', key: 'navbar.about' },
  ]

  return (
    <nav
      className={`sticky top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-sm shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
          : 'bg-white'
      }`}
      style={{ borderBottom: '1px solid rgba(128,128,128,0.1)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <button
              onClick={() => scrollToSection('home')}
              className="group flex items-center space-x-3 focus:outline-none"
            >
              <Logo className="h-9 w-9" />
              <div className="flex flex-col">
                <div className="text-lg font-semibold tracking-tight">
                  <span className="text-[#1a1a1a]">SwiftMind</span>
                  <span style={{ color: primaryColor }}> Systems</span>
                </div>
                <span className="text-[10px] text-[#888] font-medium tracking-wide">
                  {t('footer.tagline', language)}
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="px-4 py-2 text-[#666] font-medium text-sm transition-colors duration-200 rounded-lg"
                style={{ '--hover-color': primaryColor }}
                onMouseEnter={(e) => {
                  e.target.style.color = primaryColor
                  e.target.style.backgroundColor = `${primaryColor}08`
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = '#666'
                  e.target.style.backgroundColor = 'transparent'
                }}
              >
                {t(item.key, language)}
              </button>
            ))}
            <div className="ml-2 pl-2 border-l border-[rgba(128,128,128,0.15)] flex items-center gap-1">
              <ThemeSwitch />
              <LanguageSwitch />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-1">
            <ThemeSwitch />
            <LanguageSwitch />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-[#666] rounded-lg transition-colors"
              style={{ '--hover-color': primaryColor }}
              onMouseEnter={(e) => {
                e.target.style.color = primaryColor
                e.target.style.backgroundColor = `${primaryColor}08`
              }}
              onMouseLeave={(e) => {
                e.target.style.color = '#666'
                e.target.style.backgroundColor = 'transparent'
              }}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 py-3 bg-[#fafafa] border-t border-[rgba(128,128,128,0.1)]">
          <div className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="block w-full text-left px-4 py-2.5 text-[#666] font-medium text-sm transition-colors duration-200 rounded-lg"
                onMouseEnter={(e) => {
                  e.target.style.color = primaryColor
                  e.target.style.backgroundColor = 'white'
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = '#666'
                  e.target.style.backgroundColor = 'transparent'
                }}
              >
                {t(item.key, language)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
