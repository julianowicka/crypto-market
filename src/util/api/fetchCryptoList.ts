import axios from "axios";

export type CoinModel = {
    id: string,
    symbol: string,
    name: string,
}

export const fetchCryptoList = async (): Promise<CoinModel[]> => {
    const coinsListResponse = await axios.get('https://api.coingecko.com/api/v3/coins/list')
    return coinsListResponse.data
}