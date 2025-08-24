import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useFavoriteCoinsStore } from './useFavoriteCoinsStore'
import { ErrorModal } from '../../component/ErrorModal'

function TestHarness() {
  const { favoriteCoins, addFavoriteCoin } = useFavoriteCoinsStore()
  return (
    <div>
      <div data-testid="count">{favoriteCoins.length}</div>
      <button onClick={() => addFavoriteCoin({ id: 'cardano', symbol: 'ada', name: 'Cardano' })}>add-ada</button>
      <button onClick={() => addFavoriteCoin({ id: 'litecoin', symbol: 'ltc', name: 'Litecoin' })}>add-ltc</button>
      <button onClick={() => addFavoriteCoin({ id: 'dogecoin', symbol: 'doge', name: 'Dogecoin' })}>add-doge</button>
      <ErrorModal />
    </div>
  )
}

function renderWithClient(ui: React.ReactElement) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>)
}

beforeEach(() => {
  localStorage.clear()
})

it('prevents adding more than five favorites and shows an error', async () => {
  renderWithClient(<TestHarness />)

  // defaults = 3
  expect(screen.getByTestId('count').textContent).toBe('3')

  fireEvent.click(screen.getByText('add-ada'))
  await waitFor(() => expect(screen.getByTestId('count').textContent).toBe('4'))

  fireEvent.click(screen.getByText('add-ltc'))
  await waitFor(() => expect(screen.getByTestId('count').textContent).toBe('5'))

  // Sixth should not increase count and should open error modal
  fireEvent.click(screen.getByText('add-doge'))
  await waitFor(() => expect(screen.getByTestId('count').textContent).toBe('5'))
  expect(await screen.findByText(/you cannot add more than five favorite coins/i)).toBeInTheDocument()
})
