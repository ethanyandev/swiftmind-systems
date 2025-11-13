import React from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { t } from '../translations'

const Hero = () => {
  const { language } = useLanguage()
  // 在这里设置YouTube视频ID，例如: 'dQw4w9WgXcQ'
  // 如果为null，则显示默认的装饰内容
  const youtubeVideoId = null // 替换为您的YouTube视频ID

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-white via-blue-50 to-green-50">
      {/* Soft animated background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Subtle gradient orbs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-[#60A5FA]/20 to-[#3B82F6]/10 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-[#10B981]/20 to-[#34D399]/10 rounded-full filter blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-gradient-to-br from-[#FBBF24]/10 to-[#FCD34D]/5 rounded-full filter blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>

        {/* Geometric shapes */}
        <div className="absolute top-20 right-40 w-32 h-32 border-2 border-[#60A5FA]/20 rounded-xl animate-spin-slow"></div>
        <div className="absolute bottom-40 left-20 w-24 h-24 border-2 border-[#10B981]/20 rotate-45 animate-bounce-slow"></div>
        <div className="absolute top-1/3 left-1/4 w-16 h-16 bg-gradient-to-br from-[#60A5FA]/10 to-transparent rounded-full"></div>
        <div className="absolute bottom-1/3 right-1/4 w-20 h-20 bg-gradient-to-br from-[#34D399]/10 to-transparent rounded-lg"></div>

        {/* Dots pattern */}
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: 'radial-gradient(circle, #60A5FA 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0) rotate(45deg); }
          50% { transform: translateY(-20px) rotate(45deg); }
        }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        .animate-bounce-slow { animation: bounce-slow 6s ease-in-out infinite; }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Text Content */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full mb-6 shadow-sm">
              <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">{t('hero.badge', language)}</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="text-[#1E3A8A]">{t('hero.title1', language)}</span><br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#60A5FA] via-[#10B981] to-[#34D399]">{t('hero.title2', language)}</span>
            </h1>

            {/* Description */}
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              {t('hero.description', language)}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#products"
                className="inline-flex items-center justify-center px-8 py-4 bg-[#10B981] text-white rounded-lg font-semibold hover:bg-[#059669] transform hover:scale-105 transition-all duration-200 shadow-lg shadow-[#10B981]/50"
              >
                <span>{t('hero.exploreProducts', language)}</span>
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <a
                href="#about"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-700 rounded-lg font-semibold border-2 border-gray-200 hover:bg-gray-50 transition-all duration-200"
              >
                {t('hero.learnMore', language)}
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-gray-200">
              <div>
                <div className="text-3xl font-bold text-[#1E3A8A] mb-1">3+</div>
                <div className="text-sm text-gray-600">{t('hero.stats.products', language)}</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#1E3A8A] mb-1">100%</div>
                <div className="text-sm text-gray-600">{t('hero.stats.satisfaction', language)}</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#1E3A8A] mb-1">24/7</div>
                <div className="text-sm text-gray-600">{t('hero.stats.support', language)}</div>
              </div>
            </div>
          </div>

          {/* Right Column - Visual Content */}
          <div className="relative">
            <div className="relative bg-white/70 backdrop-blur-md rounded-3xl border-2 border-gray-200 shadow-xl overflow-hidden">
              <div className="aspect-video relative">
                {youtubeVideoId ? (
                  // YouTube视频嵌入
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${youtubeVideoId}?rel=0&modestbranding=1`}
                    title="SwiftMind Systems 宣传视频"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : (
                  // 默认装饰内容
                  <div className="absolute inset-0 flex items-center justify-center p-12">
                    {/* Decorative elements */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute top-8 left-8 w-16 h-16 border-2 border-[#60A5FA] rounded-lg animate-pulse"></div>
                      <div className="absolute bottom-8 right-8 w-12 h-12 border-2 border-[#10B981] rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                      <div className="absolute top-1/2 right-12 w-10 h-10 bg-gradient-to-br from-[#FBBF24]/30 to-transparent rounded-lg" style={{transform: 'rotate(45deg)'}}></div>
                    </div>

                    <div className="text-center relative z-10">
                      <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-[#60A5FA]/10 to-[#10B981]/10 rounded-full flex items-center justify-center border-2 border-[#60A5FA]/30 relative shadow-lg">
                        <svg className="w-16 h-16 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <p className="text-[#1E3A8A] font-bold text-2xl mb-2">{t('hero.visualTitle', language)}</p>
                      <p className="text-gray-600 text-sm">{t('hero.visualSubtitle', language)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
