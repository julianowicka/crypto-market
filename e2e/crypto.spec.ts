import { test, expect } from '@playwright/test'

const list = [
  { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin' },
  { id: 'ethereum', symbol: 'eth', name: 'Ethereum' },
  { id: 'ripple', symbol: 'xrp', name: 'XRP' },
  { id: 'cardano', symbol: 'ada', name: 'Cardano' },
  { id: 'litecoin', symbol: 'ltc', name: 'Litecoin' },
  { id: 'dogecoin', symbol: 'doge', name: 'Dogecoin' },
]

const detailsBase = {
  price_change_percentage_24h: 1.23,
  sparkline_in_7d: { price: Array.from({ length: 168 }, (_, i) => 100 + i) },
  low_24h: 98,
  high_24h: 130,
  current_price: 120,
  image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
}

test.beforeEach(async ({ page }) => {
  await page.route('**/api.coingecko.com/api/v3/coins/list**', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify(list),
    })
  })
  await page.route('**/api.coingecko.com/api/v3/coins/markets**', async (route) => {
    const url = new URL(route.request().url())
    const ids = (url.searchParams.get('ids') || '').split(',').filter(Boolean)
    const nameMap = new Map(list.map((c) => [c.id, c.name]))
    const data = ids.map((id) => ({ id, symbol: id.slice(0, 3), name: nameMap.get(id) ?? id, ...detailsBase }))
    await route.fulfill({ contentType: 'application/json', body: JSON.stringify(data) })
  })
})

test('loads app and shows header', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: /crypto market/i })).toBeVisible()
})

test('switch between Search and Favorite tabs', async ({ page }) => {
  await page.goto('/')
  const searchTab = page.getByRole('button', { name: 'Search' })
  const favoriteTab = page.getByRole('button', { name: 'Favorite' })
  await expect(favoriteTab).toHaveAttribute('aria-pressed', 'true')
  await searchTab.click()
  await expect(searchTab).toHaveAttribute('aria-pressed', 'true')
})

test('search coin, add and remove favorite', async ({ page }) => {
  await page.goto('/')

  // go to Search via typing
  const searchInput = page.getByLabel('Search cryptocurrencies')
  await searchInput.fill('cardano')

  // wait for row and add to favorites
  const toggleFav = page.getByRole('checkbox', { name: 'Toggle favorite Cardano' })
  await expect(toggleFav).toBeVisible()
  await toggleFav.check()

  // switch to Favorite tab and assert presence
  await page.getByRole('button', { name: 'Favorite' }).click()
  await expect(page.getByText('Cardano')).toBeVisible()

  // remove from favorites
  await page.getByRole('checkbox', { name: 'Toggle favorite Cardano' }).uncheck()
  await expect(page.getByText('Cardano')).not.toBeVisible()
})

test('enforces max 5 favorites rule by disabling 6th', async ({ page }) => {
  await page.goto('/')
  const searchInput = page.getByLabel('Search cryptocurrencies')

  // We already start with 3 default favorites (btc, eth, xrp)
  // Add two more: Cardano and Litecoin
  await searchInput.fill('cardano')
  const cardanoFav = page.getByRole('checkbox', { name: 'Toggle favorite Cardano' })
  await expect(cardanoFav).toBeVisible()
  await cardanoFav.check()

  await searchInput.fill('litecoin')
  const litecoinFav = page.getByRole('checkbox', { name: 'Toggle favorite Litecoin' })
  await expect(litecoinFav).toBeVisible()
  await litecoinFav.check()

  // Now attempt to add Dogecoin as 6th should be disabled
  await searchInput.fill('dogecoin')
  const dogeFav = page.getByRole('checkbox', { name: 'Toggle favorite Dogecoin' })
  await expect(dogeFav).toBeVisible()
  await expect(dogeFav).toBeDisabled()
})