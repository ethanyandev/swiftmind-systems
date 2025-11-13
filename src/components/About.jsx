import React from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { t } from '../translations'

const About = () => {
  const { language } = useLanguage()
  return (
    <section id="about" className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#06B6D4] rounded-full filter blur-3xl opacity-5"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#F59E0B] rounded-full filter blur-3xl opacity-5"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#2563EB]/10 to-[#10B981]/10 rounded-full mb-6">
            <span className="text-sm font-semibold text-[#2563EB]">{t('about.badge', language)}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-[#1E3A8A]">{t('about.title1', language)}</span>
            <span className="text-[#10B981]">{t('about.title2', language)}</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('about.description', language)}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="group bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-[#10B981]">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#1E3A8A] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{t('about.mission.title', language)}</h3>
            <p className="text-gray-600 leading-relaxed">
              {t('about.mission.description', language)}
            </p>
          </div>

          <div className="group bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-[#06B6D4]">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{t('about.vision.title', language)}</h3>
            <p className="text-gray-600 leading-relaxed">
              {t('about.vision.description', language)}
            </p>
          </div>

          <div className="group bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-[#F59E0B]">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#06B6D4] to-[#0891B2] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{t('about.team.title', language)}</h3>
            <p className="text-gray-600 leading-relaxed">
              {t('about.team.description', language)}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-r from-[#60A5FA] to-[#10B981] rounded-3xl p-12 shadow-2xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-bold text-white mb-2">3+</div>
              <div className="text-blue-100 font-medium">{t('about.stats.projects', language)}</div>
            </div>

            <div className="text-center">
              <div className="text-5xl md:text-6xl font-bold text-white mb-2">100%</div>
              <div className="text-blue-100 font-medium">{t('about.stats.satisfaction', language)}</div>
            </div>

            <div className="text-center">
              <div className="text-5xl md:text-6xl font-bold text-white mb-2">24/7</div>
              <div className="text-blue-100 font-medium">{t('about.stats.support', language)}</div>
            </div>

            <div className="text-center">
              <div className="text-5xl md:text-6xl font-bold text-white mb-2">∞</div>
              <div className="text-blue-100 font-medium">{t('about.stats.innovation', language)}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
