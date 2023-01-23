import React from "react";
import { CoinModel } from "../../../../util/api/fetchCryptoList";
import { CoinModelDetails } from "../../../../util/api/fetchCoinDetails";
import { Checkbox, TableRow } from "@mui/material";
import { EmptyTableRow } from "../../../../component/EmptyTableRow";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { useFavoriteCoinsStore } from "../../../../util/store/useFavoriteCoinsStore";
import { Simple24hMarketChart } from "./Simple24hMarketChart";
import { TableCellWrapper } from "../../../../component/TableCellWrapper";

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
            <TableCellWrapper>
                <Checkbox
                    checked={ isFavoriteCoin(coinBasic) }
                    icon={ <FavoriteBorder/> }
                    checkedIcon={ <Favorite/> }
                    onChange={ handleSetFavoriteCoin }
                />
                { coinDetails.name }
            </TableCellWrapper>
            <TableCellWrapper>{ coinDetails.current_price }</TableCellWrapper>
            <TableCellWrapper>{ coinDetails.price_change_percentage_24h }</TableCellWrapper>
            <TableCellWrapper>{ coinDetails.low_24h }</TableCellWrapper>
            <TableCellWrapper>{ coinDetails.high_24h }</TableCellWrapper>
            <TableCellWrapper>
                <Simple24hMarketChart coin={ coinDetails }/>
            </TableCellWrapper>
        </TableRow>
    )
}