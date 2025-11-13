import React, { useState, useEffect } from 'react'
import Logo from './Logo'
import LanguageSwitch from './LanguageSwitch'
import { useLanguage } from '../contexts/LanguageContext'
import { t } from '../translations'

const Navbar = () => {
  const { language } = useLanguage()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    element?.scrollIntoView({ behavior: 'smooth' })
    setIsMenuOpen(false)
  }

  return (
    <nav className="sticky top-0 w-full z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <button
              onClick={() => scrollToSection('home')}
              className="group flex items-center space-x-3"
            >
              <Logo className="h-10" />
              <div className="flex flex-col">
                <div className="text-xl font-bold">
                  <span className="text-[#1E3A8A]">SwiftMind</span>
                  <span className="text-[#10B981]"> Systems Ltd.</span>
                </div>
                <span className="text-xs text-gray-500">{t('footer.tagline', language)}</span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {[
              { id: 'home', key: 'navbar.home' },
              // { id: 'values', key: 'navbar.values' },
              { id: 'products', key: 'navbar.products' },
              { id: 'about', key: 'navbar.about' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium text-sm transition-colors duration-200"
              >
                {t(item.key, language)}
              </button>
            ))}
            <LanguageSwitch />
          </div>

          {/* Mobile menu button and language switch */}
          <div className="md:hidden flex items-center gap-2">
            <LanguageSwitch />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="px-3 py-2 text-gray-700 font-medium text-sm"
            >
              {isMenuOpen ? t('navbar.close', language) : t('navbar.menu', language)}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen
            ? 'max-h-96 opacity-100'
            : 'max-h-0 opacity-0 pointer-events-none'
        } overflow-hidden`}
      >
        <div className="px-4 pt-2 pb-4 bg-white border-t border-gray-200">
          <div className="space-y-1">
            {[
              { id: 'home', key: 'navbar.home' },
              // { id: 'values', key: 'navbar.values' },
              { id: 'products', key: 'navbar.products' },
              { id: 'about', key: 'navbar.about' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:text-gray-900 font-medium text-sm transition-colors duration-200"
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
