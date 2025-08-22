import { CoinModel } from "../../../util/api/fetchCryptoList";

export const filterCoins = (allCoins: Array<CoinModel>, searchString: string): Array<CoinModel> => {
    const q = searchString.trim().toLowerCase();
    if (!q) return allCoins;

    return allCoins.filter((coin) => {
        const name = coin.name.toLowerCase();
        const symbol = coin.symbol.toLowerCase();
        const id = coin.id.toLowerCase();
        return name.includes(q) || symbol.includes(q) || id.includes(q);
    })
}