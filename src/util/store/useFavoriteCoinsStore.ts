import { CoinModel } from "../api/fetchCryptoList";
import store from "store";
import { useQuery, useQueryClient } from "react-query";
import { QueryKeys } from "../api/QueryKeys";
import { useNotificationStore } from "./useNotificationStore";

const FAVORITE_COINS_KEY = 'favoriteCoinsListKey'

const DEFAULT_COINS: CoinModel[] = [
    { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin' },
    { id: 'ethereum', symbol: 'eth', name: 'Ethereum' },
    { id: 'ripple', symbol: 'xrp', name: 'XRP' },
]

const getFavoriteCoinsFromLocalStorage = (): CoinModel[] => {
    return store.get(FAVORITE_COINS_KEY);
}

if (!getFavoriteCoinsFromLocalStorage()) {
    store.set(FAVORITE_COINS_KEY, DEFAULT_COINS)
}

export const useFavoriteCoinsStore = () => {
    const { data } = useQuery(QueryKeys.GET_FAVORITE_COINS, getFavoriteCoinsFromLocalStorage);
    const favoriteCoins = data ?? getFavoriteCoinsFromLocalStorage()
    const { openErrorMessage } = useNotificationStore()

    const queryClient = useQueryClient()

    const setFavoriteCoins = (coinList: CoinModel[]): void => {
        const newCoinList = [ ...coinList ];
        store.set(FAVORITE_COINS_KEY, newCoinList)
        queryClient.setQueryData(QueryKeys.GET_FAVORITE_COINS, newCoinList)
    }

    const addFavoriteCoin = (coin: CoinModel): void => {
        if (favoriteCoins.length === 5) {
            openErrorMessage("You cannot add more then five favorite coins, please unlike one of your coins")
            return
        }
        favoriteCoins.push(coin)
        setFavoriteCoins(favoriteCoins)
    }

    const removeFavoriteCoin = (coin: CoinModel): void => {
        const newFavoriteCoins = favoriteCoins.filter((favoriteCoin) => favoriteCoin.id !== coin.id)
        setFavoriteCoins(newFavoriteCoins)
    }

    const isFavoriteCoin = (coin: CoinModel): boolean => {
        return favoriteCoins.some((favoriteCoin) => favoriteCoin.id === coin.id)
    }

    return {
        favoriteCoins,
        addFavoriteCoin,
        removeFavoriteCoin,
        isFavoriteCoin,
    }
}
