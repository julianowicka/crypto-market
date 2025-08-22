import { render, screen } from '@testing-library/react'
import React from 'react'
import { ErrorBoundary } from '../../component/ErrorBoundary'

const Boom: React.FC = () => {
  throw new Error('boom')
}

it('renders fallback when a child throws', () => {
  render(
    <ErrorBoundary>
      <Boom />
    </ErrorBoundary>
  )
  expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
  expect(screen.getByText(/try refreshing the page/i)).toBeInTheDocument()
})
