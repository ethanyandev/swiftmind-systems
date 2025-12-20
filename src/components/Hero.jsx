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
        {/* Left column */}
        <div style={{ marginBottom: '40px' }}>
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
          <div ref={buttonsRef} style={{ display: 'flex', gap: '12px', marginBottom: '48px', flexWrap: 'wrap' }}>
            <a href="#products" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', backgroundColor: primaryColor, color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', fontSize: '14px', cursor: 'pointer', transition: 'all 0.3s' }} onMouseEnter={(e) => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)'; }} onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = 'none'; }}>
              <span>{t('hero.exploreProducts', language)}</span>
              <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </a>
            <a href="#about" style={{ display: 'inline-flex', alignItems: 'center', padding: '12px 24px', backgroundColor: 'white', color: '#666', borderRadius: '8px', border: '1px solid #ddd', textDecoration: 'none', fontWeight: '600', fontSize: '14px', cursor: 'pointer', transition: 'all 0.3s' }} onMouseEnter={(e) => { e.target.style.borderColor = primaryColor; e.target.style.color = primaryColor; e.target.style.transform = 'translateY(-2px)'; }} onMouseLeave={(e) => { e.target.style.borderColor = '#ddd'; e.target.style.color = '#666'; e.target.style.transform = 'translateY(0)'; }}>
              {t('hero.learnMore', language)}
            </a>
          </div>
        </div>

        {/* Right column - Visual */}
        <div style={{ marginTop: '40px' }}>
          <div ref={visualRef} style={{ position: 'relative', backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e5e5e5', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', padding: '0', overflow: 'hidden' }}>
            <img src="/VA/1.png" alt="Hero" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', aspectRatio: '16/9' }} />
          </div>

          {/* Floating cards */}
          <div ref={floatingCard1Ref} style={{ position: 'absolute', bottom: '80px', left: '20px', padding: '12px 16px', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e5e5e5', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: `${accentColor}10` }}>
              <svg style={{ width: '16px', height: '16px', color: accentColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#1a1a1a' }}>
              {language === 'zh' ? '高效可靠' : 'Reliable'}
            </span>
          </div>

          <div ref={floatingCard2Ref} style={{ position: 'absolute', top: '20px', right: '20px', padding: '12px 16px', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e5e5e5', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: `${primaryColor}10` }}>
              <svg style={{ width: '16px', height: '16px', color: primaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
            </div>
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#1a1a1a' }}>
              {language === 'zh' ? '创新科技' : 'Innovative'}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
