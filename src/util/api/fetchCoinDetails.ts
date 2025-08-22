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

const sanitizeIds = (coins: CoinModel[]): string[] => {
    // IDs must start with a lowercase letter and can contain lowercase letters, digits, and hyphens.
    const idRegex = /^[a-z][a-z0-9-]*$/
    const set = new Set<string>()
    coins.forEach((c) => {
        const id = String(c?.id ?? '').trim().toLowerCase()
        if (id && idRegex.test(id)) set.add(id)
    })
    return Array.from(set)
}

const requestWithBackoff = async (
    idsCsv: string,
    perPage: number,
    attempt = 1,
    signal?: AbortSignal,
): Promise<CoinModelDetails[]> => {
    try {
        const res = await api.get<CoinModelDetails[]>(
            'coins/markets',
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
                signal,
            }
        )
        return res.data
    } catch (err: any) {
        // If aborted, just propagate
        if (err?.name === 'AbortError') throw err
        const status = err?.response?.status
        if ((status === 429 || status >= 500) && attempt <= MAX_RETRIES) {
            const base = 500 * 2 ** (attempt - 1)
            const jitter = Math.random() * 300
            await sleep(Math.min(base + jitter, 5000))
            return requestWithBackoff(idsCsv, perPage, attempt + 1, signal)
        }
        throw err
    }
}

export const fetchCoinDetails = async (coins: CoinModel[], signal?: AbortSignal): Promise<CoinModelDetails[]> => {
    const validIds = sanitizeIds(coins)
    if (!validIds.length) return []

    // Build chunks from sanitized ids only
    const chunks: string[][] = []
    for (let i = 0; i < validIds.length; i += CHUNK_SIZE) {
        chunks.push(validIds.slice(i, i + CHUNK_SIZE))
    }

    const results: CoinModelDetails[] = []
    for (const chunk of chunks) {
        const idsCsv = chunk.join(',')
        const perPage = Math.min(250, chunk.length)
        const data = await requestWithBackoff(idsCsv, perPage, 1, signal)
        results.push(...data)
        await sleep(100)
    }

    return results
}