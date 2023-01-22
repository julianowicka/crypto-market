import { CoinModel } from "../../../../util/api/fetchCryptoList";
import React from "react";
import { TableCell, TableRow } from "@mui/material";
import { useQuery } from "react-query";
import { QueryKeys } from "../../../../util/api/QueryKeys";
import { fetchCoinDetails } from "../../../../util/api/fetchCoinDetails";

interface Props {
    coins: CoinModel[];
}

export const CoinRowsDisplay: React.FC<Props> = (props) => {

    const { coins } = props;

    const coinIds = coins.map((coin) => coin.id).join(",")
    const { data: coinsDetails } = useQuery([QueryKeys.GET_CRYPTO_DETAILS, coinIds], () => fetchCoinDetails(coins))

    if (!coinsDetails) {
        return (
            <TableRow
                style={ {
                    height: (53) * 5,
                } }
            >
                <TableCell colSpan={ 6 }/>
            </TableRow>
        )
    }

    return (
        <>
            {
                coinsDetails.map((coin) => (
                        <TableRow
                            hover
                            tabIndex={ -1 }
                            key={ coin.id }
                        >
                            <TableCell
                                component="th"
                                scope="row"
                            >
                                { coin.name }
                            </TableCell>
                            <TableCell>{coin.current_price}</TableCell>
                            <TableCell>{coin.price_change_percentage_24h}</TableCell>
                            <TableCell>{coin.low_24h}</TableCell>
                            <TableCell>{coin.high_24h}</TableCell>
                            <TableCell>Chart</TableCell>
                        </TableRow>
                    )
                )
            }
        </>
    )
}