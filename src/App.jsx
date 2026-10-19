import React from 'react'
import { LanguageProvider } from './contexts/LanguageContext'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Manifesto from './components/Manifesto'

function App() {
  return (
    <LanguageProvider>
      <Nav />
      <main id="main">
        <Hero />
        <Manifesto />
      </main>
      <div id="app" />
    </LanguageProvider>
  )
}

export default App
