import React from 'react'
import { useLanguage } from './contexts/LanguageContext'
import { t } from './translations'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Manifesto from './components/Manifesto'
import Products from './components/Products'
import About from './components/About'
import Contact from './components/Contact'
import Footer from './components/Footer'

// The page shell without the provider, so tests can control the language from outside.
export default function AppInner() {
  const { language } = useLanguage()
  return (
    <>
      <a className="skip-link" href="#main">
        {t('nav.skip', language)}
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <Manifesto />
        <Products />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
