import axios from "axios";
import { CoinModel } from "./fetchCryptoList";

export interface CoinModelDetails extends CoinModel {
    price_change_percentage_24h: number,
    sparkline_in_7d: number[],
    low_24h: number,
    high_24h: number,
    current_price: number,
}

export const fetchCoinDetails = async (coins: CoinModel[]): Promise<CoinModelDetails[]> => {
    const cryptoIdList = coins.map((coin) => coin.id)
    const ids = cryptoIdList.join("%2C")
    const cryptoDetailsResponse = await axios.get<CoinModelDetails[]>(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=24h`)
    return cryptoDetailsResponse.data;
}