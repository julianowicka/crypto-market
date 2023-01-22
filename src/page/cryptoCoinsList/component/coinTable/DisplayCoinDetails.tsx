import React from "react";
import { CoinModel } from "../../../../util/api/fetchCryptoList";
import { CoinModelDetails } from "../../../../util/api/fetchCoinDetails";
import { Checkbox, TableCell, TableRow } from "@mui/material";
import { EmptyTableRow } from "../../../../component/EmptyTableRow";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { useFavoriteCoinsStore } from "../../../../util/store/useFavoriteCoinsStore";
import { Simple24hMarketChart } from "./Simple24hMarketChart";

interface Props {
    coinBasic: CoinModel,
    coinDetailsList: CoinModelDetails[] | undefined,
}

export const DisplayCoinDetails: React.FC<Props> = (props) => {
    const { coinBasic, coinDetailsList } = props

    const coinDetails = coinDetailsList?.find((coin) => coinBasic.id === coin.id)

    const { removeFavoriteCoin, addFavoriteCoin, isFavoriteCoin } = useFavoriteCoinsStore()

    if (!coinDetails) {
        return <EmptyTableRow height={ 53 }/>
    }

    const handleSetFavoriteCoin = (event: unknown, checked: boolean) => {
        if (checked) {
            addFavoriteCoin(coinBasic)
        } else {
            removeFavoriteCoin(coinBasic)
        }
    }

    return (
        <TableRow
            hover
            tabIndex={ -1 }
        >
            <TableCell
                scope="row"
            >
                <Checkbox
                    checked={isFavoriteCoin(coinBasic)}
                    icon={ <FavoriteBorder/> }
                    checkedIcon={ <Favorite/> }
                    onChange={ handleSetFavoriteCoin }
                />
                { coinDetails.name }
            </TableCell>
            <TableCell>{ coinDetails.current_price }</TableCell>
            <TableCell>{ coinDetails.price_change_percentage_24h }</TableCell>
            <TableCell>{ coinDetails.low_24h }</TableCell>
            <TableCell>{ coinDetails.high_24h }</TableCell>
            <TableCell>
                <Simple24hMarketChart coin={coinDetails} />
            </TableCell>
        </TableRow>
    )
}