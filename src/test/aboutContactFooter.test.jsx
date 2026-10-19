import { screen, within } from '@testing-library/react'
import { renderWithProviders } from './renderWithProviders'
import About from '../components/About'
import Contact from '../components/Contact'
import Footer from '../components/Footer'

beforeEach(() => localStorage.clear())

test('about shows heading, body and three principles', () => {
  renderWithProviders(<About />)
  expect(screen.getByRole('heading', { name: '关于' })).toBeInTheDocument()
  const items = within(document.querySelector('ul.principles')).getAllByRole('listitem')
  expect(items).toHaveLength(3)
  expect(items[0]).toHaveTextContent('先上线,再打磨。')
  expect(screen.getByText('SwiftMind Systems Ltd. · Canada · info@swiftmindsystems.com')).toBeInTheDocument()
})

test('contact offers a mailto button and the address as copyable text', () => {
  renderWithProviders(<Contact />)
  expect(screen.getByRole('heading', { name: '有想法?聊聊。' })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: '发邮件' })).toHaveAttribute('href', 'mailto:info@swiftmindsystems.com')
  const code = document.querySelector('#contact code')
  expect(code).toHaveTextContent('info@swiftmindsystems.com')
})

test('footer carries copyright and the three links', () => {
  renderWithProviders(<Footer />)
  expect(screen.getByText('© 2026 SwiftMind Systems Ltd.')).toBeInTheDocument()
  expect(screen.getByRole('link', { name: '隐私政策' })).toHaveAttribute('href', '/privacy.html')
  expect(screen.getByRole('link', { name: '服务条款' })).toHaveAttribute('href', '/terms.html')
  expect(screen.getByRole('link', { name: 'savevia.app' })).toHaveAttribute('href', 'https://savevia.app')
})
