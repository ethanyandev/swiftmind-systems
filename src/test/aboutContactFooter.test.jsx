import { screen, within } from '@testing-library/react'
import { renderWithProviders } from './renderWithProviders'
import About from '../components/About'
import Contact from '../components/Contact'
import Footer from '../components/Footer'

beforeEach(() => localStorage.clear())

test('about opens with a section head and shows three labelled principle cards', () => {
  renderWithProviders(<About />)
  const head = document.querySelector('#about .section-head')
  expect(within(head).getByRole('heading', { name: '关于' })).toBeInTheDocument()
  expect(head.querySelector('.section-body')).toHaveTextContent('SwiftMind Systems 是一家在加拿大注册的软件公司')
  const items = within(document.querySelector('ul.principles')).getAllByRole('listitem')
  expect(items).toHaveLength(3)
  for (const li of items) expect(li).toHaveClass('surface-sm')
  expect(items[0].querySelector('.mono')).toHaveTextContent('发布')
  expect(items[1].querySelector('.mono')).toHaveTextContent('数据')
  expect(items[2].querySelector('.mono')).toHaveTextContent('工程')
  expect(items[0]).toHaveTextContent('先上线，再打磨。')
  expect(screen.getByText('SwiftMind Systems Ltd. · Canada · info@swiftmindsystems.com')).toBeInTheDocument()
})

test('contact offers a mailto button and the address as copyable text', () => {
  renderWithProviders(<Contact />)
  expect(screen.getByRole('heading', { name: '有想法？聊聊。' })).toBeInTheDocument()
  const cta = screen.getByRole('link', { name: '发邮件' })
  expect(cta).toHaveAttribute('href', 'mailto:info@swiftmindsystems.com')
  expect(cta).toHaveClass('btn-primary')
  expect(document.querySelector('#contact .contact-inner')).not.toBeNull()
  const code = document.querySelector('#contact code')
  expect(code).toHaveTextContent('info@swiftmindsystems.com')
})

test('footer carries copyright and the three links', () => {
  renderWithProviders(<Footer />)
  expect(screen.getByText('© 2026 SwiftMind Systems Ltd.')).toHaveClass('faint')
  expect(screen.getByRole('link', { name: '隐私政策' })).toHaveAttribute('href', '/privacy.html')
  expect(screen.getByRole('link', { name: '服务条款' })).toHaveAttribute('href', '/terms.html')
  expect(screen.getByRole('link', { name: 'savevia.app' })).toHaveAttribute('href', 'https://savevia.app')
})
