import { render, screen } from '@testing-library/react'
import { App } from '../App'

test('renders app header', () => {
  render(<App />)
  expect(screen.getByRole('heading', { name: /crypto market/i })).toBeInTheDocument()
})
