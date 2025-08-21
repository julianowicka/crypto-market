import axios from 'axios'

const baseURL = import.meta.env.VITE_COINGECKO_BASE_URL ?? 'https://api.coingecko.com/api/v3'

export const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Accept': 'application/json',
  },
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const message = error?.response?.data?.error || error.message || 'Request failed'
    return Promise.reject(new Error(message))
  }
)