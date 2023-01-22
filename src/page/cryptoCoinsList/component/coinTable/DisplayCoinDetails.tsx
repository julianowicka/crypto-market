import React from "react";
import { CoinModel } from "../../../../util/api/fetchCryptoList";
import { CoinModelDetails } from "../../../../util/api/fetchCoinDetails";
import { TableCell, TableRow } from "@mui/material";
import { EmptyTableRow } from "../../../../component/EmptyTableRow";

interface Props {
    coinBasic: CoinModel,
    coinDetailsList: CoinModelDetails[] | undefined,
}

export const DisplayCoinDetails: React.FC<Props> = (props) => {
    const { coinBasic, coinDetailsList } = props

    const coinDetails = coinDetailsList?.find((coin) => coinBasic.id === coin.id)

    if (!coinDetails) {
        return <EmptyTableRow height={53} />
    }

    return (
        <TableRow
            hover
            tabIndex={ -1 }
        >
            <TableCell
                component="th"
                scope="row"
            >
                { coinDetails.name }
            </TableCell>
            <TableCell>{ coinDetails.current_price }</TableCell>
            <TableCell>{ coinDetails.price_change_percentage_24h }</TableCell>
            <TableCell>{ coinDetails.low_24h }</TableCell>
            <TableCell>{ coinDetails.high_24h }</TableCell>
            <TableCell>Chart</TableCell>
        </TableRow>
    )
}