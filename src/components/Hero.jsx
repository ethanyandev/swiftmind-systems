import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useLanguage } from '../contexts/LanguageContext'
import { useTheme } from '../contexts/ThemeContext'
import { t } from '../translations'

const Hero = () => {
  console.log('Hero component is being rendered')

  const { language } = useLanguage()
  const { getThemeColor, isMonochrome } = useTheme()

  const badgeRef = useRef(null)
  const title1Ref = useRef(null)
  const title2Ref = useRef(null)
  const descriptionRef = useRef(null)
  const buttonsRef = useRef(null)
  const visualRef = useRef(null)
  const floatingCard1Ref = useRef(null)
  const floatingCard2Ref = useRef(null)
  const bgBlob1Ref = useRef(null)
  const bgBlob2Ref = useRef(null)

  const primaryColor = getThemeColor('#6366F1')
  const accentColor = getThemeColor('#10B981')

  useEffect(() => {
    console.log('useEffect running, checking refs...')
    console.log('badgeRef:', badgeRef.current)
    console.log('title1Ref:', title1Ref.current)
    console.log('title2Ref:', title2Ref.current)
    console.log('descriptionRef:', descriptionRef.current)
    console.log('buttonsRef:', buttonsRef.current)
    console.log('visualRef:', visualRef.current)

    if (!badgeRef.current || !title1Ref.current || !title2Ref.current || !descriptionRef.current ||
        !buttonsRef.current || !visualRef.current) {
      console.log('Some refs not ready, returning')
      return
    }

    let tl = null
    try {
      console.log('Creating GSAP timeline...')

      // Set initial states for animations
      gsap.set(badgeRef.current, {
        opacity: 0,
        y: 20,
        scale: 0.8
      })

      gsap.set(title1Ref.current, {
        opacity: 0,
        x: -40
      })

      gsap.set(title2Ref.current, {
        opacity: 0,
        x: 40
      })

      gsap.set(descriptionRef.current, {
        opacity: 0,
        y: 20
      })

      gsap.set(buttonsRef.current.querySelectorAll('a'), {
        opacity: 0,
        y: 30,
        scale: 0.9
      })

      gsap.set(visualRef.current, {
        opacity: 0,
        scale: 0.95
      })

      if (floatingCard1Ref.current) {
        gsap.set(floatingCard1Ref.current, {
          opacity: 0,
          x: -60,
          y: 60,
          scale: 0.8
        })
      }

      if (floatingCard2Ref.current) {
        gsap.set(floatingCard2Ref.current, {
          opacity: 0,
          x: 60,
          y: -60,
          scale: 0.8
        })
      }

      tl = gsap.timeline()

      if (bgBlob1Ref.current) {
        gsap.to(bgBlob1Ref.current, {
          duration: 20,
          y: 40,
          x: 30,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        })
      }

      if (bgBlob2Ref.current) {
        gsap.to(bgBlob2Ref.current, {
          duration: 25,
          y: -40,
          x: -30,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        })
      }

      tl.to(badgeRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: 'back.out'
      }, 0)

      tl.to(title1Ref.current, {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: 'power2.out'
      }, 0.2)

      tl.to(title2Ref.current, {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: 'power2.out'
      }, 0.3)

      tl.to(descriptionRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out'
      }, 0.5)

      const buttons = buttonsRef.current.querySelectorAll('a')
      if (buttons.length > 0) {
        tl.to(buttons, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          ease: 'back.out',
          stagger: 0.1
        }, 0.7)
      }

      tl.to(visualRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: 'power2.out'
      }, 0.3)

      if (floatingCard1Ref.current) {
        tl.to(floatingCard1Ref.current, {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: 'back.out'
        }, 0.6)

        gsap.to(floatingCard1Ref.current, {
          duration: 4,
          y: -8,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        })
      }

      if (floatingCard2Ref.current) {
        tl.to(floatingCard2Ref.current, {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: 'back.out'
        }, 0.5)

        gsap.to(floatingCard2Ref.current, {
          duration: 4.5,
          y: 8,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        })
      }

      console.log('GSAP animations created successfully')
    } catch (error) {
      console.error('Animation error:', error)
    }

    return () => {
      if (tl) tl.kill()
    }
  }, [])

  return (
    <section id="home" style={{ position: 'relative', minHeight: '70vh', display: 'flex', alignItems: 'center', backgroundColor: 'white', overflow: 'hidden', paddingTop: '60px' }}>
      {/* Background gradient */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to bottom, #fafafa, white)', zIndex: 0 }} />

      {/* Blob 1 */}
      <div ref={bgBlob1Ref} style={{ position: 'absolute', top: '80px', right: 0, width: '500px', height: '500px', borderRadius: '50%', filter: 'blur(48px)', backgroundColor: `${primaryColor}08`, zIndex: 1, pointerEvents: 'none' }} />

      {/* Blob 2 */}
      <div ref={bgBlob2Ref} style={{ position: 'absolute', bottom: 0, left: 0, width: '400px', height: '400px', borderRadius: '50%', filter: 'blur(48px)', backgroundColor: `${accentColor}08`, zIndex: 1, pointerEvents: 'none' }} />

      {/* Main content container */}
      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '1280px', margin: '0 auto', padding: '20px 20px 40px 20px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '40px' }}>
          {/* Left column */}
          <div style={{ flex: '1 1 500px', minWidth: '300px' }}>
            {/* Badge */}
            <div ref={badgeRef} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '9999px', marginBottom: '24px', backgroundColor: `${primaryColor}10` }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: primaryColor }} />
              <span style={{ fontSize: '12px', fontWeight: '600', color: primaryColor }}>
                {t('hero.badge', language)}
              </span>
            </div>

            {/* Title */}
            <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '24px', lineHeight: '1.2' }}>
              <span ref={title1Ref} style={{ color: '#1a1a1a' }}>{t('hero.title1', language)}</span>
              <br />
              <span ref={title2Ref} style={{ color: primaryColor }}>{t('hero.title2', language)}</span>
            </h1>

            {/* Description */}
            <p ref={descriptionRef} style={{ fontSize: '18px', color: '#666', marginBottom: '32px', lineHeight: '1.6', maxWidth: '500px' }}>
              {t('hero.description', language)}
            </p>

            {/* Buttons */}
            <div ref={buttonsRef} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <a href="#products" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', backgroundColor: primaryColor, color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', fontSize: '14px', cursor: 'pointer', transition: 'all 0.3s' }} onMouseEnter={(e) => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)'; }} onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = 'none'; }}>
                <span>{t('hero.exploreProducts', language)}</span>
                <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </a>
              <a href="#about" style={{ display: 'inline-flex', alignItems: 'center', padding: '12px 24px', backgroundColor: 'white', color: '#666', borderRadius: '8px', border: '1px solid #ddd', textDecoration: 'none', fontWeight: '600', fontSize: '14px', cursor: 'pointer', transition: 'all 0.3s' }} onMouseEnter={(e) => { e.target.style.borderColor = primaryColor; e.target.style.color = primaryColor; e.target.style.transform = 'translateY(-2px)'; }} onMouseLeave={(e) => { e.target.style.borderColor = '#ddd'; e.target.style.color = '#666'; e.target.style.transform = 'translateY(0)'; }}>
                {t('hero.learnMore', language)}
              </a>
            </div>
          </div>

          {/* Right column - Products showcase */}
          <div ref={visualRef} style={{ flex: '1 1 400px', minWidth: '280px', display: 'flex', justifyContent: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', maxWidth: '380px' }}>
              {/* VAMerchant */}
              <a
                href="#products"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '20px 24px',
                  backgroundColor: 'white',
                  borderRadius: '16px',
                  border: '1px solid #e5e5e5',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                  textDecoration: 'none',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)'; }}
              >
                <img src="/vamerchant-logo.png" alt="VAMerchant" style={{ width: '56px', height: '56px', objectFit: 'contain', borderRadius: '12px' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '18px', fontWeight: '600', color: '#1a1a1a', marginBottom: '4px' }}>VAMerchant</div>
                  <div style={{ fontSize: '13px', color: '#888' }}>{language === 'zh' ? '服务商预约管理系统' : 'Appointment Management'}</div>
                </div>
                <div style={{ padding: '4px 10px', backgroundColor: `${primaryColor}10`, borderRadius: '20px', fontSize: '11px', fontWeight: '600', color: primaryColor }}>
                  {language === 'zh' ? '已上线' : 'Live'}
                </div>
              </a>

              {/* SaveVia */}
              <a
                href="#savevia"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '20px 24px',
                  backgroundColor: 'white',
                  borderRadius: '16px',
                  border: '1px solid #e5e5e5',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                  textDecoration: 'none',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)'; }}
              >
                <img src="/savevia-logo.png" alt="SaveVia" style={{ width: '56px', height: '56px', objectFit: 'contain', borderRadius: '12px' }} />
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px', background: 'linear-gradient(90deg, #2563eb 0%, #0d9488 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' }}>SaveVia</span>
                  <div style={{ fontSize: '13px', color: '#888' }}>{language === 'zh' ? 'AI信用卡返现优化' : 'AI Cashback Optimizer'}</div>
                </div>
                <div style={{ padding: '4px 10px', backgroundColor: `${accentColor}10`, borderRadius: '20px', fontSize: '11px', fontWeight: '600', color: accentColor }}>
                  {language === 'zh' ? '已上线' : 'Live'}
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
