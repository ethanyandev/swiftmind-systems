import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { render } from '@testing-library/react'
import { renderWithProviders } from './renderWithProviders'
import AppInner from '../AppInner'
import Surface from '../components/Surface'
import SectionHead from '../components/SectionHead'

const css = readFileSync(resolve(process.cwd(), 'src/index.css'), 'utf8')

beforeEach(() => localStorage.clear())

// User 2026-10-19: drop the grey frame lines around the page.
test('the page has no decorative frame lines or section rules', () => {
  renderWithProviders(<AppInner />)
  expect(document.querySelector('.frame, .frame-line, .section-rule')).toBeNull()
  expect(css).not.toMatch(/\.frame|\.section-rule/)
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
