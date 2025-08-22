import axios from 'axios'

const baseURL = import.meta.env.VITE_COINGECKO_BASE_URL ?? '/api'

const demoKey = import.meta.env.VITE_COINGECKO_DEMO_API_KEY
const proKey = import.meta.env.VITE_COINGECKO_PRO_API_KEY

export const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Accept': 'application/json',
    ...(demoKey ? { 'x-cg-demo-api-key': demoKey } : {}),
    ...(proKey ? { 'x-cg-pro-api-key': proKey } : {}),
  },
  withCredentials: false,
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status
    const message = error?.response?.data?.error || error.message || 'Request failed'
    if (status === 429) {
      return Promise.reject(new Error('Rate limit exceeded. Please try again in a moment.'))
    }
    return Promise.reject(new Error(message))
  }
)