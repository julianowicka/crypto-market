import { CoinModel } from "../../../util/api/fetchCryptoList";

export const filterCoins = (allCoins: Array<CoinModel>, searchString: string): Array<CoinModel> => {

    return allCoins.filter((coin) => {
        const coinName = coin.name.toLowerCase()
        const coinSymbol = coin.symbol.toLowerCase()
        return coinName.includes(searchString) || coinSymbol.includes(searchString)
    })

}