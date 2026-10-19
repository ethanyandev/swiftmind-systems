import { screen } from '@testing-library/react'
import { renderWithProviders } from './renderWithProviders'
import { splitWords } from '../lib/text'
import Manifesto from '../components/Manifesto'
import { translations } from '../translations'

beforeEach(() => localStorage.clear())

test('splitWords splits chinese per character and round-trips', () => {
  const parts = splitWords('能上线的，才算数。', 'zh')
  expect(parts.length).toBe('能上线的，才算数。'.length)
  expect(parts.join('')).toBe('能上线的，才算数。')
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
