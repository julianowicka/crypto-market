import { api } from "./client";

export type CoinModel = {
    id: string,
    symbol: string,
    name: string,
}

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms))

export const fetchCryptoList = async (): Promise<CoinModel[]> => {
    const MAX_RETRIES = 4
    let attempt = 1
    for (;;) {
        try {
            const res = await api.get<CoinModel[]>('coins/list')
            return res.data
        } catch (err: any) {
            const status = err?.response?.status
            if ((status === 429 || status >= 500) && attempt <= MAX_RETRIES) {
                const base = 500 * 2 ** (attempt - 1)
                const jitter = Math.random() * 300
                await sleep(Math.min(base + jitter, 5000))
                attempt++
                continue
            }
            throw err
        }
    }
}