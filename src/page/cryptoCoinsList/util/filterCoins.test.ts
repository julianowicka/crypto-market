import { describe, expect, it } from 'vitest'
import { filterCoins } from './filterCoins'
import type { CoinModel } from '../../../util/api/fetchCryptoList'

const coins: CoinModel[] = [
  { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin' },
  { id: 'ethereum', symbol: 'eth', name: 'Ethereum' },
  { id: 'ripple', symbol: 'xrp', name: 'XRP' },
  { id: 'cardano', symbol: 'ada', name: 'Cardano' },
]

describe('filterCoins', () => {
  it('returns all coins when search is empty', () => {
    const res = filterCoins(coins, '')
    expect(res).toHaveLength(coins.length)
  })

  it('filters by name, id, or symbol case-insensitively', () => {
    expect(filterCoins(coins, 'bit')).toEqual([coins[0]])
    expect(filterCoins(coins, 'ETH')).toEqual([coins[1]])
    expect(filterCoins(coins, 'xRp')).toEqual([coins[2]])
    expect(filterCoins(coins, 'ada')).toEqual([coins[3]])
  })

  it('returns empty array if no matches', () => {
    expect(filterCoins(coins, 'unknown')).toEqual([])
  })
})