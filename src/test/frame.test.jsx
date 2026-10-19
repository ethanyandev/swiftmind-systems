import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { render } from '@testing-library/react'
import { renderWithProviders } from './renderWithProviders'
import AppInner from '../AppInner'
import Surface from '../components/Surface'
import SectionHead from '../components/SectionHead'

const css = readFileSync(resolve(process.cwd(), 'src/index.css'), 'utf8')

beforeEach(() => localStorage.clear())

test('the page wrapper carries a decorative frame with two vertical lines', () => {
  renderWithProviders(<AppInner />)
  const frame = document.querySelector('.page > .frame')
  expect(frame).not.toBeNull()
  expect(frame).toHaveAttribute('aria-hidden', 'true')
  expect(frame.querySelectorAll('.frame-line')).toHaveLength(2)
  expect(document.querySelectorAll('main .section-rule')).toHaveLength(4)
})

test('frame lines never intercept the pointer and sit under the content', () => {
  expect(css).toMatch(/\.frame\s*\{[^}]*pointer-events:\s*none/)
  expect(css).toMatch(/\.frame\s*\{[^}]*z-index:\s*0/)
  expect(css).toMatch(/\.frame-line\s*\{[^}]*position:\s*absolute/)
  expect(css).toMatch(/\.section-rule::before[\s\S]*?\.section-rule::after/)
})

test('Surface renders the requested element with the surface class', () => {
  render(
    <Surface as="article" className="extra" data-x="1">
      hi
    </Surface>,
  )
  const el = document.querySelector('article.surface.extra')
  expect(el).toHaveAttribute('data-x', '1')
  expect(el).toHaveTextContent('hi')
})

test('SectionHead renders a level-2 heading and a muted paragraph', () => {
  render(<SectionHead title="产品" body="一段话" />)
  expect(document.querySelector('.section-head h2.display.section-title')).toHaveTextContent('产品')
  expect(document.querySelector('.section-head p.section-body')).toHaveTextContent('一段话')
})
