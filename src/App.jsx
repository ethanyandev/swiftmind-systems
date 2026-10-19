import React from 'react'
import { LanguageProvider } from './contexts/LanguageContext'
import Nav from './components/Nav'

function App() {
  return (
    <LanguageProvider>
      <Nav />
      <div id="app" />
    </LanguageProvider>
  )
}

export default App
