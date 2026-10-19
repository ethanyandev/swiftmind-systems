import { screen } from '@testing-library/react'
import { renderWithProviders } from './renderWithProviders'
import { splitWords } from '../lib/text'
import Manifesto from '../components/Manifesto'
import { translations } from '../translations'

beforeEach(() => localStorage.clear())

test('splitWords round-trips chinese and never starts a unit with punctuation', () => {
  const parts = splitWords('能上线的，才算数。', 'zh')
  expect(parts.join('')).toBe('能上线的，才算数。')
  expect(parts.length).toBeGreaterThan(1)
  for (const unit of parts) expect(unit).not.toMatch(/^[，。、；：？！）」』]/)
})

test('splitWords splits english on whitespace', () => {
  expect(splitWords('If it ships, it counts.', 'en')).toEqual(['If', 'it', 'ships,', 'it', 'counts.'])
})

test('manifesto renders the only eyebrow and a screen-reader copy of the body', () => {
  renderWithProviders(<Manifesto />)
  expect(document.querySelectorAll('.eyebrow')).toHaveLength(1)
  expect(screen.getByText('我们怎么做事')).toHaveClass('eyebrow')
  const sr = document.querySelector('#manifesto .sr-only')
  expect(sr).toHaveTextContent(translations.manifesto.body.zh)
  expect(document.querySelector('#manifesto [aria-hidden="true"] .word')).not.toBeNull()
})
