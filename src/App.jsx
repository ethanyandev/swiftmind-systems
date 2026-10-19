import React from 'react'
import { LanguageProvider } from './contexts/LanguageContext'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Manifesto from './components/Manifesto'
import Products from './components/Products'
import About from './components/About'
import Contact from './components/Contact'
import Footer from './components/Footer'

function App() {
  return (
    <LanguageProvider>
      <Nav />
      <main id="main">
        <Hero />
        <Manifesto />
        <Products />
        <About />
        <Contact />
      </main>
      <Footer />
    </LanguageProvider>
  )
}

export default App
