import { test, expect } from '@playwright/test'

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