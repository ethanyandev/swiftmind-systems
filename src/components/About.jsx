import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useLanguage } from '../contexts/LanguageContext'
import { useTheme } from '../contexts/ThemeContext'
import { t } from '../translations'

gsap.registerPlugin(ScrollTrigger)

const About = () => {
  const { language } = useLanguage()
  const { getThemeColor, isMonochrome } = useTheme()

  // Refs for animations
  const sectionRef = useRef(null)
  const badgeRef = useRef(null)
  const titleRef = useRef(null)
  const descRef = useRef(null)
  const valuesRef = useRef(null)

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

  // GSAP Animations
  useEffect(() => {
    if (!sectionRef.current) return

    // Set initial states
    gsap.set([badgeRef.current, titleRef.current, descRef.current], {
      opacity: 0,
      y: 20
    })

    gsap.set(valuesRef.current.querySelectorAll('[data-value]'), {
      opacity: 0,
      y: 20
    })

    // Create animations triggered by scroll
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        toggleActions: 'play none none none',
        once: true
      }
    })

    // Animate header
    tl.to(badgeRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out'
    }, 0)

    tl.to(titleRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out'
    }, 0.2)

    tl.to(descRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out'
    }, 0.35)

    // Animate value cards
    const valueCards = valuesRef.current.querySelectorAll('[data-value]')
    tl.to(valueCards, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out',
      stagger: 0.1
    }, 0.5)

    return () => {
      tl.kill()
    }
  }, [])

  return (
    <section id="about" className="py-20 bg-white transition-colors duration-300" ref={sectionRef}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
            style={{ backgroundColor: `${primaryColor}10` }}
            ref={badgeRef}
          >
            <span
              className="text-xs font-semibold tracking-wide"
              style={{ color: primaryColor }}
            >
              {language === 'zh' ? '关于我们' : 'About Us'}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight" ref={titleRef}>
            <span className="text-[#1a1a1a]">{t('about.title1', language)}</span>
            <span style={{ color: primaryColor }}>{t('about.title2', language)}</span>
          </h2>
          <p className="text-lg text-[#666] max-w-2xl mx-auto" ref={descRef}>
            {t('about.description', language)}
          </p>
        </div>

        {/* Core Values Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14" ref={valuesRef}>
          {values.map((item, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-xl bg-[#fafafa] hover:bg-white transition-colors duration-200"
              style={{ border: '1px solid rgba(128,128,128,0.1)' }}
              data-value
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
      </div>
    </section>
  )
}

export default About
