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

export const fetchCoinDetails = async (coins: CoinModel[]): Promise<CoinModelDetails[]> => {
    const ids = coins.map((coin) => coin.id).join(',')
    const cryptoDetailsResponse = await api.get<CoinModelDetails[]>(
        '/coins/markets',
        {
            params: {
                vs_currency: 'usd',
                ids,
                order: 'market_cap_desc',
                per_page: 100,
                page: 1,
                sparkline: true,
                price_change_percentage: '24h',
            },
        }
    )
    return cryptoDetailsResponse.data;
}