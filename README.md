## Wprowadzenie

Nowoczesna aplikacja SPA do śledzenia cen ulubionych kryptowalut (live dane, szybkie filtrowanie, ulubione i wykresy 24h).

Atuty appki:
- React 18 + TypeScript + Vite 5 (szybkie buildy i HMR)
- Material UI 5 (responsywny UI) i Recharts (wykresy)
- TanStack React Query v5 (cache, refetch, anulowanie żądań, retry/backoff)
- PWA przez vite-plugin-pwa
- Playwright (E2E), Vitest + Testing Library (testy), MSW (mocki API w testach)
- Proxy `/api` (Vite/Express) eliminujące CORS i obsługa opcjonalnych kluczy CoinGecko

Uwaga na limity API: CoinGecko nakłada ograniczenia (możliwe HTTP 429 przy intensywnym odpytywaniu).
W aplikacji zaimplementowano anulowanie zapytań, retry z backoffem oraz chunkowanie.
Szczegóły znajdziesz w sekcji poniżej.



## Live demo

https://crypto-market-preview.herokuapp.com/

##  Scripts

In the project directory, you can run:

### `npm start`
### `npm run dev`
Runs the app in development mode.

### `npm run build`
Builds the app for production.

### `npm run preview`
Serves the production build locally.

### `npm run test`
Runs unit tests with Vitest.

### `npm run e2e`
Runs end-to-end tests with Playwright (Chromium and Firefox).

### `npm run e2e:webkit`
Runs end-to-end tests with WebKit (Safari engine) in addition to Chromium and Firefox.

### `npm run e2e:headed`
Runs end-to-end tests with visible browser windows.

### `npm run e2e:webkit:headed`
Runs end-to-end tests with WebKit in visible mode.

## WebKit Setup

To run tests with WebKit (Safari engine), you need to install system dependencies:

```bash
# Install WebKit browser
npx playwright install webkit

# Install system dependencies (requires sudo)
sudo env PATH="/./bin:$PATH" npx playwright install-deps webkit
```

Note: If you encounter issues with system dependencies, WebKit tests may still work without them, but some features might be limited.

# Task

Build a single-page application that shows the price of user-selected cryptocurrencies.

- Users can select up to 5 currencies.
- Users can remove the currencies.
- Show 24h price chart along with the current price.
- Show all selected currencies in one view.
- The selected currencies should be persistent. Refreshing the page should not reset
  them.
- Each of the selected currencies should be displayed with a distinct color.


The UX is up to you. It's one of the things that will be evaluated.
The currencies list and prices can be retrieved using
https://www.coingecko.com/en/api/documentation
Feel free to use any other API.

## Deliverables

Create Github/Gitlab repo with source code and documentation. You are free to choose any
modern framework. Please also host SPA in your preferred place.
Scoring
What is important in this task? And where do we give points?

1. if it works and covers all corner cases
2. code and mind clarity, the clearer the code, the clearer the thinking. Make sure your
   code can be read like a breeze.
3. extensive testing and E2E testing are welcomed
4. UX and aesthetics of the solution
5. responsiveness

## API usage and rate limits

- This app uses CoinGecko API v3. Rate limits apply and vary by plan. See the official docs for up-to-date limits.
- If you click pagination very fast, you can hit HTTP 429 (Too Many Requests). The app mitigates this by:
  - Request cancellation on pagination (in-flight requests are aborted).
  - Exponential backoff with jitter and small delays between chunked requests.
  - Sanitization of coin IDs to avoid invalid queries.
- CORS: The app calls the API through a local proxy at `/api` to avoid CORS issues.
  - Dev: Vite dev server proxies `/api` → `https://api.coingecko.com/api/v3`.
  - Prod: Express server (scripts/heroku-start.js) proxies `/api` to CoinGecko.
- Optional API keys:
  - Frontend env: `VITE_COINGECKO_DEMO_API_KEY` and/or `VITE_COINGECKO_PRO_API_KEY`.
  - Server env: `COINGECKO_DEMO_API_KEY` and/or `COINGECKO_PRO_API_KEY`.
  - If provided, the app will include them in request headers to increase limits per CoinGecko plan.

Note: This project was originally built as a recruitment assignment. I decided to improve and extend it further on my own.


