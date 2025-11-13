import React from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { t } from '../translations'

const About = () => {
  const { language } = useLanguage()
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            {t('about.title1', language)}
            <span className="text-[#10B981]">{t('about.title2', language)}</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('about.description', language)}
          </p>
        </div>

        {/* Core Values - Simplified Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="text-center p-6">
            <div className="w-12 h-12 rounded-lg bg-[#10B981]/10 flex items-center justify-center mb-4 mx-auto">
              <svg className="w-6 h-6 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('about.mission.title', language)}</h3>
            <p className="text-sm text-gray-600">
              {t('about.mission.description', language)}
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-12 h-12 rounded-lg bg-[#10B981]/10 flex items-center justify-center mb-4 mx-auto">
              <svg className="w-6 h-6 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('about.vision.title', language)}</h3>
            <p className="text-sm text-gray-600">
              {t('about.vision.description', language)}
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-12 h-12 rounded-lg bg-[#10B981]/10 flex items-center justify-center mb-4 mx-auto">
              <svg className="w-6 h-6 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('about.team.title', language)}</h3>
            <p className="text-sm text-gray-600">
              {t('about.team.description', language)}
            </p>
          </div>
        </div>

        {/* Stats - Minimalist Design */}
        <div className="border-t border-gray-200 pt-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-1">3+</div>
              <div className="text-sm text-gray-600">{t('about.stats.projects', language)}</div>
            </div>

            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-1">100%</div>
              <div className="text-sm text-gray-600">{t('about.stats.satisfaction', language)}</div>
            </div>

            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-1">24/7</div>
              <div className="text-sm text-gray-600">{t('about.stats.support', language)}</div>
            </div>

            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-1">∞</div>
              <div className="text-sm text-gray-600">{t('about.stats.innovation', language)}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
