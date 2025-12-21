import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useLanguage } from '../contexts/LanguageContext'
import { useTheme } from '../contexts/ThemeContext'
import { t } from '../translations'

gsap.registerPlugin(ScrollTrigger)

const Products = () => {
  const { language } = useLanguage()
  const { getThemeColor } = useTheme()
  const [lightboxImage, setLightboxImage] = useState(null)
  const [showVAFeatures, setShowVAFeatures] = useState(false)
  const [showSVFeatures, setShowSVFeatures] = useState(false)

  // Refs
  const sectionRef = useRef(null)
  const headerRef = useRef(null)
  const vaGridRef = useRef(null)
  const saveviaGridRef = useRef(null)

  const primaryColor = getThemeColor('#6366F1')
  const accentColor = getThemeColor('#10B981')

  // VAMerchant 功能列表
  const vaFeatures = [
    { zh: '预约管理', en: 'Appointment Management' },
    { zh: '日程排班', en: 'Schedule Management' },
    { zh: '客户管理', en: 'Customer Management' },
    { zh: '订单收银', en: 'Orders & Payment' },
    { zh: '服务管理', en: 'Service Management' },
    { zh: '员工管理', en: 'Staff Management' },
    { zh: '通知中心', en: 'Notification Center' },
    { zh: '营销中心', en: 'Marketing Automation' },
  ]

  // SaveVia 功能列表
  const svFeatures = [
    { zh: '智能卡片推荐', en: 'Smart Card Recommendations' },
    { zh: '消费分析', en: 'Spending Analysis' },
    { zh: '返现优化', en: 'Cashback Optimization' },
    { zh: '多卡管理', en: 'Multi-Card Management' },
    { zh: '交易追踪', en: 'Transaction Tracking' },
    { zh: '银行连接', en: 'Bank Connection' },
    { zh: '节省报告', en: 'Savings Report' },
    { zh: 'AI优化建议', en: 'AI Optimization' },
  ]

  // 精选图片
  const vaImages = {
    hero: '/VA/1.png',
    feature1: '/VA/3.png',
    feature2: '/VA/7.png',
    feature3: '/VA/8.png',
  }

  const saveviaImages = {
    hero: '/SaveVia/1-1.png',
    feature1: '/SaveVia/3-3.png',
    feature2: '/SaveVia/6-6.png',
    mobile: '/SaveVia/1.png',
  }

  // 滚动视差动画
  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      // Header 动画
      gsap.from(headerRef.current, {
        scrollTrigger: {
          trigger: headerRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      })

      // VAMerchant Grid 视差
      const vaItems = vaGridRef.current?.querySelectorAll('[data-parallax]')
      vaItems?.forEach((item, i) => {
        const speed = item.dataset.speed || 1
        gsap.from(item, {
          scrollTrigger: {
            trigger: item,
            start: 'top 90%',
            toggleActions: 'play none none none'
          },
          y: 80 * speed,
          opacity: 0,
          duration: 0.8,
          delay: i * 0.1,
          ease: 'power3.out'
        })
      })

      // SaveVia Grid 视差
      const svItems = saveviaGridRef.current?.querySelectorAll('[data-parallax]')
      svItems?.forEach((item, i) => {
        const speed = item.dataset.speed || 1
        gsap.from(item, {
          scrollTrigger: {
            trigger: item,
            start: 'top 90%',
            toggleActions: 'play none none none'
          },
          y: 80 * speed,
          opacity: 0,
          duration: 0.8,
          delay: i * 0.1,
          ease: 'power3.out'
        })
      })

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="products" className="py-24 bg-[#fafafa]" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center mb-20" ref={headerRef}>
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{ backgroundColor: `${primaryColor}08`, border: `1px solid ${primaryColor}20` }}
          >
            <span className="text-sm font-medium" style={{ color: primaryColor }}>
              {t('products.badge', language)}
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 tracking-tight">
            <span className="text-[#1a1a1a]">{t('products.title1', language)}</span>
            <span style={{ color: primaryColor }}>{t('products.title2', language)}</span>
          </h2>
          <p className="text-lg text-[#666] max-w-2xl mx-auto">
            {t('products.subtitle', language)}
          </p>
        </div>

        {/* ==================== VAMerchant Bento Grid ==================== */}
        <div className="mb-24" ref={vaGridRef}>
          {/* Product Header */}
          <div className="flex items-center gap-4 mb-8" data-parallax data-speed="0.5">
            <img src="/vamerchant-logo.png" alt="VAMerchant" className="w-12 h-12 rounded-xl" />
            <div>
              <h3 className="text-2xl font-bold text-[#1a1a1a]">VAMerchant</h3>
              <p className="text-[#888]">{t('products.vamerchant.description', language)}</p>
            </div>
            <a
              href="https://vamerchant.app"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto px-5 py-2.5 text-white rounded-lg font-medium text-sm transition-all hover:scale-105"
              style={{ backgroundColor: primaryColor }}
            >
              {language === 'zh' ? '访问网站' : 'Visit Website'}
            </a>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-12 gap-4 auto-rows-[180px]">
            {/* Main Hero - Large */}
            <div
              className="col-span-12 md:col-span-8 row-span-2 rounded-2xl overflow-hidden bg-white group cursor-pointer"
              style={{ border: '1px solid rgba(0,0,0,0.06)' }}
              data-parallax
              data-speed="1.2"
              onClick={() => setLightboxImage(vaImages.hero)}
            >
              <div className="relative w-full h-full">
                <img
                  src={vaImages.hero}
                  alt="VAMerchant Dashboard"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <span className="text-white font-medium">{language === 'zh' ? '系统概览' : 'System Overview'}</span>
                </div>
              </div>
            </div>

            {/* Feature Card 1 */}
            <div
              className="col-span-6 md:col-span-4 row-span-1 rounded-2xl overflow-hidden bg-white group cursor-pointer"
              style={{ border: '1px solid rgba(0,0,0,0.06)' }}
              data-parallax
              data-speed="0.8"
              onClick={() => setLightboxImage(vaImages.feature1)}
            >
              <img
                src={vaImages.feature1}
                alt="Feature"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>

            {/* Info Card - Clickable */}
            <div
              className="col-span-6 md:col-span-4 row-span-1 rounded-2xl p-6 flex flex-col justify-between cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg"
              style={{ backgroundColor: primaryColor }}
              data-parallax
              data-speed="1"
              onClick={() => setShowVAFeatures(true)}
            >
              <div className="flex items-center justify-between">
                <div className="text-white/80 text-sm font-medium">{language === 'zh' ? '核心功能' : 'Core Features'}</div>
                <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-1">8+</div>
                <div className="text-white/70 text-sm">{language === 'zh' ? '点击查看详情' : 'Click to view'}</div>
              </div>
            </div>

            {/* Feature Card 2 */}
            <div
              className="col-span-6 md:col-span-4 row-span-1 rounded-2xl overflow-hidden bg-white group cursor-pointer"
              style={{ border: '1px solid rgba(0,0,0,0.06)' }}
              data-parallax
              data-speed="0.9"
              onClick={() => setLightboxImage(vaImages.feature2)}
            >
              <img
                src={vaImages.feature2}
                alt="Feature"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>

            {/* Feature Card 3 - Mobile */}
            <div
              className="col-span-6 md:col-span-4 row-span-1 rounded-2xl overflow-hidden bg-[#f5f5f7] group cursor-pointer flex items-center justify-center"
              style={{ border: '1px solid rgba(0,0,0,0.06)' }}
              data-parallax
              data-speed="1.1"
              onClick={() => setLightboxImage(vaImages.feature3)}
            >
              <img
                src={vaImages.feature3}
                alt="Mobile"
                className="h-full w-auto object-contain transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Download Card */}
            <div
              className="col-span-12 md:col-span-4 row-span-1 rounded-2xl bg-[#1a1a1a] p-6 flex items-center justify-between"
              data-parallax
              data-speed="0.7"
            >
              <div>
                <div className="text-white font-semibold mb-1">{language === 'zh' ? '下载应用' : 'Download App'}</div>
                <div className="text-white/60 text-sm">iOS & Android</div>
              </div>
              <div className="flex gap-2">
                <a href="https://apps.apple.com/app/vamerchant" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                </a>
                <a href="https://play.google.com/store/apps/details?id=com.vamerchant" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92z"/>
                    <path fill="#FBBC05" d="M14.499 12.707l2.302 2.302-10.937 6.333 8.635-8.635z"/>
                    <path fill="#4285F4" d="M17.698 9.509l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491z"/>
                    <path fill="#34A853" d="M5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ==================== SaveVia Bento Grid ==================== */}
        <div id="savevia" className="pt-16 border-t border-[rgba(0,0,0,0.06)]" ref={saveviaGridRef}>
          {/* Product Header */}
          <div className="flex items-center gap-4 mb-8" data-parallax data-speed="0.5">
            <img src="/savevia-logo.png" alt="SaveVia" className="w-12 h-12 rounded-xl" />
            <div>
              <h3 className="text-2xl font-bold" style={{ background: 'linear-gradient(90deg, #2563eb 0%, #0d9488 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' }}>SaveVia</h3>
              <p className="text-[#888]">{t('products.savevia.description', language)}</p>
            </div>
            <a
              href="https://savevia.app"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto px-5 py-2.5 text-white rounded-lg font-medium text-sm transition-all hover:scale-105"
              style={{ backgroundColor: accentColor }}
            >
              {language === 'zh' ? '访问网站' : 'Visit Website'}
            </a>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-12 gap-4 auto-rows-[180px]">
            {/* Main Hero */}
            <div
              className="col-span-12 md:col-span-7 row-span-2 rounded-2xl overflow-hidden bg-white group cursor-pointer"
              style={{ border: '1px solid rgba(0,0,0,0.06)' }}
              data-parallax
              data-speed="1.2"
              onClick={() => setLightboxImage(saveviaImages.hero)}
            >
              <div className="relative w-full h-full">
                <img
                  src={saveviaImages.hero}
                  alt="SaveVia Dashboard"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <span className="text-white font-medium">{language === 'zh' ? 'AI智能推荐' : 'AI Recommendations'}</span>
                </div>
              </div>
            </div>

            {/* Stats Card - Clickable */}
            <div
              className="col-span-6 md:col-span-5 row-span-1 rounded-2xl p-6 flex flex-col justify-between cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg"
              style={{ background: 'linear-gradient(135deg, #2563eb 0%, #0d9488 100%)' }}
              data-parallax
              data-speed="0.8"
              onClick={() => setShowSVFeatures(true)}
            >
              <div className="flex items-center justify-between">
                <div className="text-white/80 text-sm font-medium">{language === 'zh' ? '核心功能' : 'Core Features'}</div>
                <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-1">8+</div>
                <div className="text-white/70 text-sm">{language === 'zh' ? '点击查看详情' : 'Click to view'}</div>
              </div>
            </div>

            {/* Feature Card */}
            <div
              className="col-span-6 md:col-span-5 row-span-1 rounded-2xl overflow-hidden bg-white group cursor-pointer"
              style={{ border: '1px solid rgba(0,0,0,0.06)' }}
              data-parallax
              data-speed="1"
              onClick={() => setLightboxImage(saveviaImages.feature1)}
            >
              <img
                src={saveviaImages.feature1}
                alt="Cards"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>

            {/* Feature Card 2 */}
            <div
              className="col-span-6 md:col-span-4 row-span-1 rounded-2xl overflow-hidden bg-white group cursor-pointer"
              style={{ border: '1px solid rgba(0,0,0,0.06)' }}
              data-parallax
              data-speed="0.9"
              onClick={() => setLightboxImage(saveviaImages.feature2)}
            >
              <img
                src={saveviaImages.feature2}
                alt="Spending"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>

            {/* Mobile Preview */}
            <div
              className="col-span-6 md:col-span-4 row-span-2 rounded-2xl overflow-hidden bg-[#f5f5f7] group cursor-pointer flex items-center justify-center p-4"
              style={{ border: '1px solid rgba(0,0,0,0.06)' }}
              data-parallax
              data-speed="1.1"
              onClick={() => setLightboxImage(saveviaImages.mobile)}
            >
              <img
                src={saveviaImages.mobile}
                alt="Mobile App"
                className="h-full w-auto object-contain rounded-xl shadow-2xl transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Download Card */}
            <div
              className="col-span-12 md:col-span-4 row-span-1 rounded-2xl bg-[#1a1a1a] p-6 flex items-center justify-between"
              data-parallax
              data-speed="0.7"
            >
              <div>
                <div className="text-white font-semibold mb-1">{language === 'zh' ? '下载应用' : 'Download App'}</div>
                <div className="text-white/60 text-sm">iOS & Android</div>
              </div>
              <div className="flex gap-2">
                <a href="https://apps.apple.com/app/savevia" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                </a>
                <a href="https://play.google.com/store/apps/details?id=com.savevia" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92z"/>
                    <path fill="#FBBC05" d="M14.499 12.707l2.302 2.302-10.937 6.333 8.635-8.635z"/>
                    <path fill="#4285F4" d="M17.698 9.509l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491z"/>
                    <path fill="#34A853" d="M5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Coming Soon */}
        <div className="text-center mt-20">
          <p className="text-sm text-[#888]">
            {language === 'zh' ? '更多产品即将推出...' : 'More products coming soon...'}
          </p>
        </div>
      </div>

      {/* VAMerchant Features Modal */}
      {showVAFeatures && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={() => setShowVAFeatures(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <img src="/vamerchant-logo.png" alt="VAMerchant" className="w-10 h-10 rounded-xl" />
                <div>
                  <h3 className="font-bold text-[#1a1a1a]">VAMerchant</h3>
                  <p className="text-sm text-[#888]">{language === 'zh' ? '核心功能' : 'Core Features'}</p>
                </div>
              </div>
              <button
                onClick={() => setShowVAFeatures(false)}
                className="w-8 h-8 rounded-full bg-[#f5f5f5] flex items-center justify-center hover:bg-[#eee] transition-colors"
              >
                <svg className="w-4 h-4 text-[#666]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {vaFeatures.map((feature, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 p-3 rounded-xl bg-[#fafafa]"
                  style={{ border: '1px solid rgba(0,0,0,0.06)' }}
                >
                  <svg className="w-4 h-4 flex-shrink-0" style={{ color: primaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm font-medium text-[#1a1a1a]">{language === 'zh' ? feature.zh : feature.en}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SaveVia Features Modal */}
      {showSVFeatures && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={() => setShowSVFeatures(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <img src="/savevia-logo.png" alt="SaveVia" className="w-10 h-10 rounded-xl" />
                <div>
                  <h3 className="font-bold" style={{ background: 'linear-gradient(90deg, #2563eb 0%, #0d9488 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' }}>SaveVia</h3>
                  <p className="text-sm text-[#888]">{language === 'zh' ? '核心功能' : 'Core Features'}</p>
                </div>
              </div>
              <button
                onClick={() => setShowSVFeatures(false)}
                className="w-8 h-8 rounded-full bg-[#f5f5f5] flex items-center justify-center hover:bg-[#eee] transition-colors"
              >
                <svg className="w-4 h-4 text-[#666]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {svFeatures.map((feature, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 p-3 rounded-xl bg-[#fafafa]"
                  style={{ border: '1px solid rgba(0,0,0,0.06)' }}
                >
                  <svg className="w-4 h-4 flex-shrink-0" style={{ color: accentColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm font-medium text-[#1a1a1a]">{language === 'zh' ? feature.zh : feature.en}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setLightboxImage(null)}
        >
          <button
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            onClick={() => setLightboxImage(null)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img
            src={lightboxImage}
            alt="Preview"
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  )
}

export default Products
