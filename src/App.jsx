import React from 'react'
import { LanguageProvider } from './contexts/LanguageContext'

function App() {
  return (
    <LanguageProvider>
      <div id="app" />
    </LanguageProvider>
  )
}

export default App
