import React from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { useTheme } from '../contexts/ThemeContext'
import { t } from '../translations'

const Hero = () => {
  const { language } = useLanguage()
  const { getThemeColor, isMonochrome } = useTheme()

  const primaryColor = getThemeColor('#6366F1')
  const accentColor = getThemeColor('#10B981')

  return (
    <section id="home" className="relative min-h-[90vh] flex items-center bg-white transition-colors duration-300">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#fafafa] to-white"></div>

      {/* Subtle decorative element */}
      <div
        className="absolute top-20 right-0 w-[500px] h-[500px] rounded-full blur-3xl"
        style={{ backgroundColor: `${primaryColor}08` }}
      ></div>
      <div
        className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-3xl"
        style={{ backgroundColor: `${accentColor}08` }}
      ></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Text Content */}
          <div>
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6"
              style={{ backgroundColor: `${primaryColor}10` }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: primaryColor }}
              ></div>
              <span
                className="text-xs font-semibold tracking-wide"
                style={{ color: primaryColor }}
              >
                {t('hero.badge', language)}
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-[1.1] tracking-tight">
              <span className="text-[#1a1a1a]">{t('hero.title1', language)}</span>
              <br />
              <span style={{ color: primaryColor }}>{t('hero.title2', language)}</span>
            </h1>

            {/* Description */}
            <p className="text-lg text-[#666] mb-8 leading-relaxed max-w-lg">
              {t('hero.description', language)}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="#products"
                className="inline-flex items-center justify-center px-6 py-3 text-white rounded-lg font-semibold text-sm transition-colors duration-200"
                style={{
                  backgroundColor: primaryColor,
                  boxShadow: isMonochrome ? '0 2px 8px rgba(26,26,26,0.25)' : '0 2px 8px rgba(99,102,241,0.25)'
                }}
              >
                <span>{t('hero.exploreProducts', language)}</span>
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <a
                href="#about"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-[#666] rounded-lg font-semibold text-sm border border-[rgba(0,0,0,0.12)] hover:text-[#1a1a1a] transition-colors duration-200"
                style={{
                  '--hover-border-color': primaryColor,
                  '--hover-text-color': primaryColor
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = primaryColor
                  e.target.style.color = primaryColor
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = 'rgba(0,0,0,0.12)'
                  e.target.style.color = '#666'
                }}
              >
                {t('hero.learnMore', language)}
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-[rgba(0,0,0,0.06)]">
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] mb-1">3+</div>
                <div className="text-xs sm:text-sm text-[#888]">{t('hero.stats.products', language)}</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] mb-1">100%</div>
                <div className="text-xs sm:text-sm text-[#888]">{t('hero.stats.satisfaction', language)}</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] mb-1">24/7</div>
                <div className="text-xs sm:text-sm text-[#888]">{t('hero.stats.support', language)}</div>
              </div>
            </div>
          </div>

          {/* Right Column - Visual Content */}
          <div className="relative">
            <div
              className="relative bg-white rounded-2xl overflow-hidden"
              style={{
                border: '1px solid rgba(128,128,128,0.1)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.06)'
              }}
            >
              <div className="aspect-video relative">
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#fafafa] to-white p-8">
                  <div className="text-center">
                    <div
                      className="w-20 h-20 mx-auto mb-5 rounded-2xl flex items-center justify-center"
                      style={{
                        background: isMonochrome
                          ? 'linear-gradient(135deg, rgba(26,26,26,0.1) 0%, rgba(26,26,26,0.05) 100%)'
                          : 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(16,185,129,0.1) 100%)',
                        border: `1px solid ${primaryColor}25`
                      }}
                    >
                      <svg
                        className="w-10 h-10"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        style={{ color: primaryColor }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <p className="text-[#1a1a1a] font-semibold text-lg mb-1">
                      {t('hero.visualTitle', language)}
                    </p>
                    <p className="text-[#888] text-sm">
                      {t('hero.visualSubtitle', language)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating accent cards */}
            <div
              className="absolute -bottom-4 -left-4 px-4 py-2.5 bg-white rounded-xl hidden lg:block"
              style={{
                border: '1px solid rgba(128,128,128,0.1)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
              }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${accentColor}15` }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: accentColor }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-[#1a1a1a]">
                  {language === 'zh' ? '高效可靠' : 'Reliable'}
                </span>
              </div>
            </div>

            <div
              className="absolute -top-4 -right-4 px-4 py-2.5 bg-white rounded-xl hidden lg:block"
              style={{
                border: '1px solid rgba(128,128,128,0.1)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
              }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${primaryColor}15` }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: primaryColor }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-[#1a1a1a]">
                  {language === 'zh' ? '创新科技' : 'Innovative'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
