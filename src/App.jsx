import React from 'react'
import { LanguageProvider } from './contexts/LanguageContext'
import AppInner from './AppInner'

export default function App() {
  return (
    <LanguageProvider>
      <AppInner />
    </LanguageProvider>
  )
}
