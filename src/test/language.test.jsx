import { act } from '@testing-library/react'
import { renderWithProviders } from './renderWithProviders'
import { useLanguage } from '../contexts/LanguageContext'

let api
function Probe() {
  api = useLanguage()
  return <span>{api.language}</span>
}

beforeEach(() => localStorage.clear())

test('initial language sets html lang', () => {
  renderWithProviders(<Probe />, { language: 'en' })
  expect(document.documentElement.lang).toBe('en')
})

test('toggle switches to zh-CN and persists', () => {
  renderWithProviders(<Probe />, { language: 'en' })
  act(() => api.toggleLanguage())
  expect(document.documentElement.lang).toBe('zh-CN')
  expect(localStorage.getItem('lang')).toBe('zh')
})

test('stored language wins over initialLanguage', () => {
  localStorage.setItem('lang', 'en')
  renderWithProviders(<Probe />, { language: 'zh' })
  expect(api.language).toBe('en')
})
