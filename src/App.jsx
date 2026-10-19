import React from 'react'
import { LanguageProvider } from './contexts/LanguageContext'
import Nav from './components/Nav'
import Hero from './components/Hero'

function App() {
  return (
    <LanguageProvider>
      <Nav />
      <main id="main">
        <Hero />
      </main>
      <div id="app" />
    </LanguageProvider>
  )
}

export default App
