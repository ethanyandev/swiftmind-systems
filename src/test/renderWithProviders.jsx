import { render } from '@testing-library/react'
import { LanguageProvider } from '../contexts/LanguageContext'

export function renderWithProviders(ui, { language = 'zh' } = {}) {
  return render(<LanguageProvider initialLanguage={language}>{ui}</LanguageProvider>)
}
