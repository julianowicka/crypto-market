import React, { ChangeEventHandler, useState } from "react";
import { useQuery } from "react-query";
import { QueryKeys } from "../../util/api/QueryKeys";
import { CoinModel, fetchCryptoList } from "../../util/api/fetchCryptoList";
import { TextField, Typography } from "@mui/material";


export const CryptoCoinsListEntry: React.FC = () => {

    const { data: allCoins } = useQuery(QueryKeys.GET_ALL_CRYPTO, fetchCryptoList)

    const [ filteredCoins, setFilteredCoins ] = useState<Array<CoinModel>>([])


    const handleSearchCoins: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (event) => {
        const searchValue = event.target.value.toLowerCase()

        const matchingCoins = allCoins?.filter((coin) => {
            const coinName = coin.name.toLowerCase()
            const coinSymbol = coin.symbol.toLowerCase()
            return coinName.includes(searchValue) || coinSymbol.includes(searchValue)
        }) ?? []
        setFilteredCoins(matchingCoins.slice(0, 15))
    }


    return (
        <>
            <Typography
                component="h1"
                variant="h3"
            >
                Coin List
            </Typography>
            <br/>
            <TextField
                id="searchCryptoInput"
                label="Search Crypto"
                variant="outlined"
                onChange={ handleSearchCoins }
            />
            <ul>
                { filteredCoins.map((coin) => (<li>{ coin.name }</li>)) }
            </ul>
        </>
    )
}