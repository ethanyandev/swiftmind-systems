import React, { useState, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { useTheme } from '../contexts/ThemeContext'
import { t } from '../translations'

const Products = () => {
  const { language } = useLanguage()
  const { getThemeColor, isMonochrome } = useTheme()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [bookingIndex, setBookingIndex] = useState(0)
  const [lightboxImage, setLightboxImage] = useState(null)

  const primaryColor = getThemeColor('#6366F1')
  const accentColor = getThemeColor('#10B981')

  // System Overview 所有图片
  const overviewImages = [
    '/VA/1.png', '/VA/2.png', '/VA/3.png', '/VA/4.png',
    '/VA/5.png', '/VA/6.png', '/VA/7.png', '/VA/10.png',
    '/VA/11.png', '/VA/13.png', '/VA/14.png'
  ]

  // Online Booking 图片
  const bookingImages = ['/VA/8.png', '/VA/9.png', '/VA/12.png']

  // 自动轮播 - System Overview
  useEffect(() => {
    if (!isAutoPlaying) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % overviewImages.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [isAutoPlaying, overviewImages.length])

  // 自动轮播 - Online Booking (滑动)
  useEffect(() => {
    const timer = setInterval(() => {
      setBookingIndex((prev) => (prev + 1) % bookingImages.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [bookingImages.length])

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + overviewImages.length) % overviewImages.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 8000)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % overviewImages.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 8000)
  }

  return (
    <section id="products" className="py-20 bg-[#fafafa] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
            style={{ backgroundColor: `${primaryColor}10` }}
          >
            <span
              className="text-xs font-semibold tracking-wide"
              style={{ color: primaryColor }}
            >
              {t('products.badge', language)}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
            <span className="text-[#1a1a1a]">{t('products.title1', language)}</span>
            <span style={{ color: primaryColor }}>{t('products.title2', language)}</span>
          </h2>
          <p className="text-lg text-[#666] max-w-2xl mx-auto">
            {t('products.subtitle', language)}
          </p>
        </div>

        {/* Product Header Card */}
        <div
          className="bg-white rounded-2xl overflow-hidden mb-8"
          style={{
            border: '1px solid rgba(128,128,128,0.1)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
          }}
        >
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src="/vamerchant-logo.png"
                  alt="VAMerchant Logo"
                  className="w-14 h-14 object-contain rounded-xl"
                />
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-bold text-[#1a1a1a]">
                      {t('products.vamerchant.name', language)}
                    </h3>
                    <span
                      className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {t('products.vamerchant.status', language)}
                    </span>
                  </div>
                  <p className="text-[#666] mt-1">
                    {t('products.vamerchant.description', language)}
                  </p>
                </div>
              </div>
              <a
                href="https://vamerchant.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-white rounded-lg font-medium text-sm transition-colors flex-shrink-0"
                style={{ backgroundColor: primaryColor }}
              >
                {language === 'zh' ? '访问网站' : 'Visit Website'}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
          {/* App Download Section */}
          <div className="px-6 sm:px-8 py-4 bg-[#fafafa] border-t border-[rgba(128,128,128,0.1)]">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-2 text-sm text-[#666]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span>{language === 'zh' ? '下载移动端应用' : 'Download Mobile App'}</span>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href="https://apps.apple.com/app/vamerchant"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-4 py-2.5 bg-[#1a1a1a] text-white rounded-xl transition-all hover:bg-black hover:scale-[1.02]"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <div className="flex flex-col items-start">
                    <span className="text-[10px] font-medium opacity-70 leading-none">{language === 'zh' ? '下载于' : 'Download on the'}</span>
                    <span className="text-sm font-semibold leading-tight">App Store</span>
                  </div>
                </a>
                <a
                  href="https://play.google.com/store/apps/details?id=com.vamerchant"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-4 py-2.5 bg-[#1a1a1a] text-white rounded-xl transition-all hover:bg-black hover:scale-[1.02]"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92z"/>
                    <path fill="#FBBC05" d="M14.499 12.707l2.302 2.302-10.937 6.333 8.635-8.635z"/>
                    <path fill="#4285F4" d="M17.698 9.509l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491z"/>
                    <path fill="#34A853" d="M5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z"/>
                  </svg>
                  <div className="flex flex-col items-start">
                    <span className="text-[10px] font-medium opacity-70 leading-none">{language === 'zh' ? '下载于' : 'Get it on'}</span>
                    <span className="text-sm font-semibold leading-tight">Google Play</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Core Features */}
        <div
          className="bg-white rounded-xl p-6 mb-8"
          style={{ border: '1px solid rgba(128,128,128,0.1)' }}
        >
          <h4 className="text-sm font-semibold text-[#888] uppercase tracking-wider mb-4">
            {t('products.coreFeatures', language)}
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-[#fafafa]"
                style={{ border: '1px solid rgba(128,128,128,0.08)' }}
              >
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{ color: primaryColor }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm font-medium text-[#1a1a1a]">
                  {t(`products.vamerchant.features.feature${i}`, language)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 2 Feature Modules - Each Full Width */}
        <div className="space-y-6">
          {/* System Overview Module */}
          <div
            className="bg-white rounded-xl overflow-hidden group"
            style={{ border: '1px solid rgba(128,128,128,0.1)' }}
          >
            <div className="p-5 border-b border-[rgba(128,128,128,0.1)]">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${primaryColor}10`, color: primaryColor }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-base font-semibold text-[#1a1a1a]">
                    {language === 'zh' ? '系统介绍' : 'System Overview'}
                  </h4>
                  <p className="text-sm text-[#888]">
                    {language === 'zh' ? '一站式商户管理解决方案' : 'All-in-one merchant management'}
                  </p>
                </div>
              </div>
            </div>
            {/* Smooth Image Carousel */}
            <div>
              <div className="relative aspect-[2/1] bg-[#f8f9fa]">
                {overviewImages.map((src, index) => (
                  <img
                    key={index}
                    src={src}
                    alt={`System ${index + 1}`}
                    onClick={() => setLightboxImage(src)}
                    className={`absolute inset-0 w-full h-full object-contain transition-all duration-500 cursor-pointer ${
                      index === currentIndex
                        ? 'opacity-100 scale-100'
                        : 'opacity-0 scale-[1.02]'
                    }`}
                  />
                ))}
                {/* Navigation Arrows */}
                <button
                  onClick={goToPrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-[#666] transition-all shadow-md"
                  style={{ '--hover-color': primaryColor }}
                  onMouseEnter={(e) => e.target.style.color = primaryColor}
                  onMouseLeave={(e) => e.target.style.color = '#666'}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-[#666] transition-all shadow-md"
                  onMouseEnter={(e) => e.target.style.color = primaryColor}
                  onMouseLeave={(e) => e.target.style.color = '#666'}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                {/* Counter */}
                <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/50 rounded-full text-white text-sm font-medium">
                  {currentIndex + 1} / {overviewImages.length}
                </div>
              </div>
              {/* Thumbnail Navigation */}
              <div className="p-3 border-t border-[rgba(128,128,128,0.1)] bg-white">
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {overviewImages.map((src, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentIndex(index)
                        setIsAutoPlaying(false)
                        setTimeout(() => setIsAutoPlaying(true), 8000)
                      }}
                      className={`flex-shrink-0 w-16 h-10 rounded-md overflow-hidden transition-all ${
                        index === currentIndex
                          ? 'ring-2 ring-offset-1'
                          : 'opacity-50 hover:opacity-100'
                      }`}
                      style={index === currentIndex ? { '--tw-ring-color': primaryColor } : {}}
                    >
                      <img
                        src={src}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Online Booking Module */}
          <div
            className="bg-white rounded-xl overflow-hidden group"
            style={{ border: '1px solid rgba(128,128,128,0.1)' }}
          >
            <div className="p-5 border-b border-[rgba(128,128,128,0.1)]">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${accentColor}10`, color: accentColor }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-base font-semibold text-[#1a1a1a]">
                    {language === 'zh' ? '线上预约流程' : 'Online Booking Flow'}
                  </h4>
                  <p className="text-sm text-[#888]">
                    {language === 'zh' ? '便捷的客户预约体验' : 'Seamless customer booking'}
                  </p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden">
              {/* Sliding Container */}
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${bookingIndex * 100}%)` }}
              >
                {bookingImages.map((src, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-full p-6"
                  >
                    <div className="rounded-2xl overflow-hidden bg-[#f8f9fa] shadow-lg mx-auto" style={{ border: '1px solid rgba(128,128,128,0.1)', maxWidth: '90%' }}>
                      <img
                        src={src}
                        alt={`Booking ${index + 1}`}
                        onClick={() => setLightboxImage(src)}
                        className="w-full h-auto cursor-pointer"
                      />
                    </div>
                  </div>
                ))}
              </div>
              {/* Dots Indicator */}
              <div className="flex justify-center gap-2 py-4">
                {bookingImages.map((_, index) => (
                  <div
                    key={index}
                    className="w-2.5 h-2.5 rounded-full transition-colors"
                    style={{
                      backgroundColor: index === bookingIndex ? accentColor : '#e5e5e5'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Coming Soon Hint */}
        <div className="text-center mt-12">
          <p className="text-sm text-[#888]">
            {language === 'zh' ? '更多产品即将推出...' : 'More products coming soon...'}
          </p>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            className="absolute top-6 right-6 z-10 w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
            onClick={(e) => { e.stopPropagation(); setLightboxImage(null); }}
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img
            src={lightboxImage}
            alt="Enlarged view"
            className="max-w-[90vw] max-h-[85vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  )
}

export default Products
