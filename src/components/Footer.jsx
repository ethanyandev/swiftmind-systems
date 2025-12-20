import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useLanguage } from '../contexts/LanguageContext'
import { useTheme } from '../contexts/ThemeContext'
import { t } from '../translations'

gsap.registerPlugin(ScrollTrigger)

const Footer = () => {
  const { language } = useLanguage()
  const { getThemeColor } = useTheme()
  const currentYear = new Date().getFullYear()

  // Refs for animations
  const footerRef = useRef(null)
  const companyInfoRef = useRef(null)
  const columnsRef = useRef(null)
  const bottomBarRef = useRef(null)

  const primaryColor = getThemeColor('#6366F1')

  const quickLinks = [
    { href: '#home', key: 'navbar.home' },
    { href: '#products', key: 'navbar.products' },
    { href: '#about', key: 'navbar.about' },
  ]

  const socialLinks = [
    {
      name: 'Facebook',
      href: '#',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
    },
    {
      name: 'Twitter',
      href: '#',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      ),
    },
    {
      name: 'LinkedIn',
      href: '#',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
    },
  ]

  // GSAP Animations
  useEffect(() => {
    if (!footerRef.current) return

    // Set initial states
    gsap.set(companyInfoRef.current, {
      opacity: 0,
      y: 20
    })

    gsap.set(columnsRef.current.querySelectorAll('[data-footer-column]'), {
      opacity: 0,
      y: 20
    })

    gsap.set(columnsRef.current.querySelectorAll('[data-footer-link]'), {
      opacity: 0,
      y: 10
    })

    gsap.set(bottomBarRef.current, {
      opacity: 0,
      y: 15
    })

    // Create animations triggered by scroll
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: footerRef.current,
        start: 'top 80%',
        toggleActions: 'play none none none',
        once: true
      }
    })

    // Animate company info
    tl.to(companyInfoRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out'
    }, 0)

    // Animate column headings
    const columns = columnsRef.current.querySelectorAll('[data-footer-column]')
    tl.to(columns, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out',
      stagger: 0.1
    }, 0.2)

    // Animate links
    const links = columnsRef.current.querySelectorAll('[data-footer-link]')
    tl.to(links, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: 'power2.out',
      stagger: 0.05
    }, 0.5)

    // Animate bottom bar
    tl.to(bottomBarRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out'
    }, 0.8)

    return () => {
      tl.kill()
    }
  }, [])

  return (
    <footer className="bg-[#fafafa] border-t border-[rgba(128,128,128,0.1)] transition-colors duration-300" ref={footerRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10" ref={columnsRef}>
          {/* Company Info */}
          <div className="md:col-span-2" ref={companyInfoRef}>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 flex items-center justify-center">
                <img src="/logo-transparent.png" alt="SwiftMind Systems" className="h-full w-full object-contain" />
              </div>
              <div>
                <div className="text-base font-semibold">
                  <span className="text-[#1a1a1a]">SwiftMind</span>
                  <span style={{ color: primaryColor }}> Systems Ltd.</span>
                </div>
                <p className="text-xs text-[#888]">{t('footer.tagline', language)}</p>
              </div>
            </div>
            <p className="text-sm text-[#666] leading-relaxed mb-5 max-w-md">
              {t('footer.description', language)}
            </p>
            <div className="flex gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-[#888] transition-colors duration-200"
                  style={{ border: '1px solid rgba(128,128,128,0.15)' }}
                  aria-label={social.name}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = primaryColor
                    e.currentTarget.style.backgroundColor = `${primaryColor}08`
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#888'
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div data-footer-column>
            <h4 className="text-sm font-semibold text-[#1a1a1a] mb-4">{t('footer.quickLinks', language)}</h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href} data-footer-link>
                  <a
                    href={link.href}
                    className="text-sm text-[#666] transition-colors flex items-center group"
                    onMouseEnter={(e) => e.currentTarget.style.color = primaryColor}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#666'}
                  >
                    <svg className="w-3 h-3 mr-2 text-[#ccc] group-hover:text-current transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    {t(link.key, language)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div data-footer-column>
            <h4 className="text-sm font-semibold text-[#1a1a1a] mb-4">{t('footer.contact', language)}</h4>
            <ul className="space-y-3">
              <li className="flex items-start" data-footer-link>
                <svg className="w-4 h-4 mr-2.5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: primaryColor }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a
                  href="mailto:info@swiftmindsystems.com"
                  className="text-sm text-[#666] transition-colors"
                  onMouseEnter={(e) => e.currentTarget.style.color = primaryColor}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#666'}
                >
                  info@swiftmindsystems.com
                </a>
              </li>
              <li className="flex items-start" data-footer-link>
                <svg className="w-4 h-4 mr-2.5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: primaryColor }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-sm text-[#666]">+1 (250) 686-9867</span>
              </li>
              <li className="flex items-start" data-footer-link>
                <svg className="w-4 h-4 mr-2.5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: primaryColor }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm text-[#666]">{t('footer.location', language)}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[rgba(128,128,128,0.1)]" ref={bottomBarRef}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-[#888]">
              &copy; {currentYear} {t('footer.companyName', language)}. {t('footer.copyright', language)}.
            </p>
            <div className="flex gap-5 text-xs">
              <a
                href="#"
                className="text-[#888] transition-colors"
                onMouseEnter={(e) => e.currentTarget.style.color = primaryColor}
                onMouseLeave={(e) => e.currentTarget.style.color = '#888'}
              >
                {t('footer.privacy', language)}
              </a>
              <a
                href="#"
                className="text-[#888] transition-colors"
                onMouseEnter={(e) => e.currentTarget.style.color = primaryColor}
                onMouseLeave={(e) => e.currentTarget.style.color = '#888'}
              >
                {t('footer.terms', language)}
              </a>
              <a
                href="#"
                className="text-[#888] transition-colors"
                onMouseEnter={(e) => e.currentTarget.style.color = primaryColor}
                onMouseLeave={(e) => e.currentTarget.style.color = '#888'}
              >
                {t('footer.cookies', language)}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
