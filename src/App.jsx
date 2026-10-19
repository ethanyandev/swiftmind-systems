import React from 'react'
import { LanguageProvider } from './contexts/LanguageContext'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Manifesto from './components/Manifesto'
import Products from './components/Products'

function App() {
  return (
    <LanguageProvider>
      <Nav />
      <main id="main">
        <Hero />
        <Manifesto />
        <Products />
      </main>
      <div id="app" />
    </LanguageProvider>
  )
}

export default App
