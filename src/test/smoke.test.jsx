import { render } from '@testing-library/react'
import App from '../App'

test('app mounts', () => {
  render(<App />)
  expect(document.getElementById('app')).toBeInTheDocument()
})
