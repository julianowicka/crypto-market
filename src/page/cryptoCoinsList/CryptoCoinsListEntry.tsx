import React, { ChangeEventHandler, useCallback, useState } from "react";
import { useQuery } from "react-query";
import { QueryKeys } from "../../util/api/QueryKeys";
import { CoinModel, fetchCryptoList } from "../../util/api/fetchCryptoList";
import { TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { CoinTable } from "./component/coinTable/CoinTable";
import { filterCoins } from "./util/filterCoins";
import { debounce } from "debounce";
import { useFavoriteCoinsStore } from "../../util/store/useFavoriteCoinsStore";

enum DisplayState {
    SEARCH = 'SEARCH',
    FAVORITE = 'FAVORITE',
}

export const CryptoCoinsListEntry: React.FC = () => {

    const { data: allCoins } = useQuery(QueryKeys.GET_ALL_CRYPTO, fetchCryptoList)

    const { favoriteCoins } = useFavoriteCoinsStore()

    const [ filteredCoins, setFilteredCoins ] = useState<Array<CoinModel>>(favoriteCoins)
    const [ tableDisplayState, setTableDisplayState ] = useState<DisplayState>(DisplayState.FAVORITE)
    const [ filterCoinInputValue, setFilterCoinInputValue ] = useState<string>('')
    const [ page, setPage ] = useState(0);


    const handleSearchCoins = useCallback((searchString: string) => {
        const newFilteredCoins = filterCoins(allCoins ?? [], searchString.toLowerCase())
        setFilteredCoins(newFilteredCoins)
        setPage(0)
    }, [ allCoins, setFilteredCoins ])

    const handleSearchCoinsDebounced = useCallback(
        debounce(handleSearchCoins, 1000),
        [ handleSearchCoins ]
    )

    const handleSearchCoinsEvent: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = useCallback((event) => {
        const searchString = event.target.value
        handleSearchCoinsDebounced(searchString)
        setTableDisplayState(DisplayState.SEARCH)
        setFilterCoinInputValue(searchString)
    }, [ handleSearchCoinsDebounced, setTableDisplayState, setFilterCoinInputValue ])

    const handleDisplayStateChange = (event: unknown, newState: DisplayState) => {
        if (newState === null) {
            return;
        }
        setTableDisplayState(newState)
        if (newState === DisplayState.FAVORITE) {
            setFilteredCoins(favoriteCoins)
        } else {
            handleSearchCoins('');
        }
        setFilterCoinInputValue('')
        setPage(0)
    }

    return (
        <>
            <Typography
                component="h1"
                variant="h3"
                sx={{ marginTop: "30px" }}
            >
                Coin List
            </Typography>
            <br />
            <ToggleButtonGroup
                value={ tableDisplayState }
                exclusive
                onChange={ handleDisplayStateChange }
            >
                <ToggleButton value={ DisplayState.SEARCH }>Search</ToggleButton>
                <ToggleButton value={ DisplayState.FAVORITE }>Favorite</ToggleButton>
            </ToggleButtonGroup>
            <br />
            <TextField
                id="searchCryptoInput"
                value={ filterCoinInputValue }
                label="Search Crypto"
                variant="outlined"
                onChange={ handleSearchCoinsEvent }
            />
            <CoinTable
                filteredCoins={ filteredCoins }
                page={ page }
                setPage={ setPage }
            />
        </>
    )
}