import React, { ChangeEventHandler, useCallback, useState } from "react";
import { useQuery } from "react-query";
import { QueryKeys } from "../../util/api/QueryKeys";
import { CoinModel, fetchCryptoList } from "../../util/api/fetchCryptoList";
import {
    FormControl,
    Input,
    InputAdornment,
    InputLabel,
    ToggleButton,
    ToggleButtonGroup,
    Typography
} from "@mui/material";
import { CoinTable } from "./component/coinTable/CoinTable";
import { filterCoins } from "./util/filterCoins";
import { debounce } from "debounce";
import { useFavoriteCoinsStore } from "../../util/store/useFavoriteCoinsStore";
import SearchIcon from '@mui/icons-material/Search';
import Box from "@mui/material/Box";

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

    // deps array is correct here
    // eslint-disable-next-line
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
                Crypto Market
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
            <FormControl variant="standard">
                {filterCoinInputValue === "" ? <InputLabel
                    variant="outlined"
                    htmlFor="searchCryptoCoinsInput"
                >
                    Search Crypto
                </InputLabel> : <Box sx={{ height: "16px" }} /> }
                <Input
                    id="searchCryptoCoinsInput"
                    size="medium"
                    value={ filterCoinInputValue }
                    onChange={ handleSearchCoinsEvent }
                    startAdornment={
                        <InputAdornment position="start">
                            <SearchIcon fontSize="large" />
                        </InputAdornment>
                    }
                />
            </FormControl>
            <br />
            <CoinTable
                filteredCoins={ filteredCoins }
                page={ page }
                setPage={ setPage }
            />
        </>
    )
}