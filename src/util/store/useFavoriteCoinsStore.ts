import { CoinModel } from "../api/fetchCryptoList";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "../api/QueryKeys";
import { useNotificationStore } from "./useNotificationStore";
import { getJSON, setJSON } from "../storage";

const FAVORITE_COINS_KEY = 'favoriteCoinsListKey'

const DEFAULT_COINS: CoinModel[] = [
    { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin' },
    { id: 'ethereum', symbol: 'eth', name: 'Ethereum' },
    { id: 'ripple', symbol: 'xrp', name: 'XRP' },
]

const getFavoriteCoinsFromLocalStorage = (): CoinModel[] => {
    return getJSON<CoinModel[]>(FAVORITE_COINS_KEY, DEFAULT_COINS);
}

export const useFavoriteCoinsStore = () => {
    const { data } = useQuery({
        queryKey: [QueryKeys.GET_FAVORITE_COINS],
        queryFn: getFavoriteCoinsFromLocalStorage,
        initialData: getFavoriteCoinsFromLocalStorage(),
        staleTime: Infinity,
        gcTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });

    const queryClient = useQueryClient()
    const { openErrorMessage } = useNotificationStore()

    const favoriteCoins = data ?? getFavoriteCoinsFromLocalStorage()

    const setFavoriteCoins = (updater: (prev: CoinModel[]) => CoinModel[]) => {
        const prev = (queryClient.getQueryData([QueryKeys.GET_FAVORITE_COINS]) as CoinModel[] | undefined) ?? getFavoriteCoinsFromLocalStorage()
        const next = updater(prev)
        if (next !== prev) {
            setJSON(FAVORITE_COINS_KEY, next)
            queryClient.setQueryData([QueryKeys.GET_FAVORITE_COINS], next)
        }
    }

    const addFavoriteCoin = (coin: CoinModel): void => {
        setFavoriteCoins((prev) => {
            if (prev.some((c) => c.id === coin.id)) return prev
            if (prev.length >= 5) {
                openErrorMessage("You cannot add more than five favorite coins, please unlike one of your coins")
                return prev
            }
            return [...prev, coin]
        })
    }

    const removeFavoriteCoin = (coin: CoinModel): void => {
        setFavoriteCoins((prev) => prev.filter((favoriteCoin) => favoriteCoin.id !== coin.id))
    }

    const isFavoriteCoin = (coin: CoinModel): boolean => {
        return favoriteCoins.some((favoriteCoin: CoinModel) => favoriteCoin.id === coin.id)
    }

    return {
        favoriteCoins,
        addFavoriteCoin,
        removeFavoriteCoin,
        isFavoriteCoin,
    }
}
