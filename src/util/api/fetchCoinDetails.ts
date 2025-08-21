import { api } from "./client";
import { CoinModel } from "./fetchCryptoList";

export interface CoinModelDetails extends CoinModel {
    price_change_percentage_24h: number,
    sparkline_in_7d: {
        price: number[],
    },
    low_24h: number,
    high_24h: number,
    current_price: number,
    image: string,
}

const CHUNK_SIZE = 50
const MAX_RETRIES = 4

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms))

const requestWithBackoff = async (idsCsv: string, perPage: number, attempt = 1): Promise<CoinModelDetails[]> => {
    try {
        const res = await api.get<CoinModelDetails[]>(
            '/coins/markets',
            {
                params: {
                    vs_currency: 'usd',
                    ids: idsCsv,
                    order: 'market_cap_desc',
                    per_page: perPage,
                    page: 1,
                    sparkline: true,
                    price_change_percentage: '24h',
                },
            }
        )
        return res.data
    } catch (err: any) {
        const status = err?.response?.status
        if ((status === 429 || status >= 500) && attempt <= MAX_RETRIES) {
            const base = 500 * 2 ** (attempt - 1)
            const jitter = Math.random() * 300
            await sleep(Math.min(base + jitter, 5000))
            return requestWithBackoff(idsCsv, perPage, attempt + 1)
        }
        throw err
    }
}

export const fetchCoinDetails = async (coins: CoinModel[]): Promise<CoinModelDetails[]> => {
    if (!coins.length) return []

    const chunks: CoinModel[][] = []
    for (let i = 0; i < coins.length; i += CHUNK_SIZE) {
        chunks.push(coins.slice(i, i + CHUNK_SIZE))
    }

    const results: CoinModelDetails[] = []
    for (const chunk of chunks) {
        const idsCsv = chunk.map((c) => c.id).join(',')
        const perPage = Math.min(250, chunk.length)
        const data = await requestWithBackoff(idsCsv, perPage)
        results.push(...data)
        await sleep(100)
    }

    return results
}