import { http, HttpResponse } from 'msw'

const list = [
  { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin' },
  { id: 'ethereum', symbol: 'eth', name: 'Ethereum' },
  { id: 'ripple', symbol: 'xrp', name: 'XRP' },
  { id: 'cardano', symbol: 'ada', name: 'Cardano' },
]

const detailsBase = {
  price_change_percentage_24h: 1.23,
  sparkline_in_7d: { price: Array.from({ length: 168 }, (_, i) => 100 + i) },
  low_24h: 98,
  high_24h: 130,
  current_price: 120,
  image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
}

export const handlers = [
  http.get('https://api.coingecko.com/api/v3/coins/list', () => {
    return HttpResponse.json(list)
  }),
  http.get('https://api.coingecko.com/api/v3/coins/markets', ({ request }) => {
    const url = new URL(request.url)
    const ids = url.searchParams.get('ids')?.split(',') ?? []
    const data = ids.map((id) => ({ id, symbol: id.slice(0, 3), name: id, ...detailsBase }))
    return HttpResponse.json(data)
  }),
]