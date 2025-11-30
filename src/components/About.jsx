import React from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { useTheme } from '../contexts/ThemeContext'
import { t } from '../translations'

const About = () => {
  const { language } = useLanguage()
  const { getThemeColor, isMonochrome } = useTheme()

  const primaryColor = getThemeColor('#6366F1')
  const accentColor = getThemeColor('#10B981')
  const warningColor = getThemeColor('#F59E0B')

  const values = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      titleKey: 'about.mission.title',
      descKey: 'about.mission.description',
      color: primaryColor,
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      titleKey: 'about.vision.title',
      descKey: 'about.vision.description',
      color: accentColor,
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      titleKey: 'about.team.title',
      descKey: 'about.team.description',
      color: warningColor,
    },
  ]

  const stats = [
    { value: '3+', key: 'about.stats.projects' },
    { value: '100%', key: 'about.stats.satisfaction' },
    { value: '24/7', key: 'about.stats.support' },
    { value: '∞', key: 'about.stats.innovation' },
  ]

  return (
    <section id="about" className="py-20 bg-white transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
            style={{ backgroundColor: `${primaryColor}10` }}
          >
            <span
              className="text-xs font-semibold tracking-wide"
              style={{ color: primaryColor }}
            >
              {language === 'zh' ? '关于我们' : 'About Us'}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
            <span className="text-[#1a1a1a]">{t('about.title1', language)}</span>
            <span style={{ color: primaryColor }}>{t('about.title2', language)}</span>
          </h2>
          <p className="text-lg text-[#666] max-w-2xl mx-auto">
            {t('about.description', language)}
          </p>
        </div>

        {/* Core Values Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
          {values.map((item, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-xl bg-[#fafafa] hover:bg-white transition-colors duration-200"
              style={{ border: '1px solid rgba(128,128,128,0.1)' }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 mx-auto"
                style={{
                  backgroundColor: `${item.color}10`,
                  color: item.color
                }}
              >
                {item.icon}
              </div>
              <h3 className="text-base font-semibold text-[#1a1a1a] mb-2">
                {t(item.titleKey, language)}
              </h3>
              <p className="text-sm text-[#666] leading-relaxed">
                {t(item.descKey, language)}
              </p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div
          className="rounded-xl p-8"
          style={{
            border: '1px solid rgba(128,128,128,0.1)',
            background: isMonochrome
              ? 'linear-gradient(135deg, rgba(26,26,26,0.03) 0%, rgba(26,26,26,0.02) 100%)'
              : 'linear-gradient(135deg, rgba(99,102,241,0.03) 0%, rgba(16,185,129,0.03) 100%)'
          }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-[#1a1a1a] mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-[#888]">
                  {t(stat.key, language)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
