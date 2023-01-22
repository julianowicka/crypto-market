import { CoinModel } from "../../../../util/api/fetchCryptoList";
import React from "react";
import { useQuery } from "react-query";
import { QueryKeys } from "../../../../util/api/QueryKeys";
import { fetchCoinDetails } from "../../../../util/api/fetchCoinDetails";
import { DisplayCoinDetails } from "./DisplayCoinDetails";

interface Props {
    coins: CoinModel[];
}

export const CoinRows: React.FC<Props> = (props) => {

    const { coins } = props;

    const coinIds = coins.map((coin) => coin.id).join(",")
    const { data: coinDetailsList } = useQuery([ QueryKeys.GET_CRYPTO_DETAILS, coinIds ], () => fetchCoinDetails(coins))

    return (
        <>
            {
                coins.map((coin) => (
                        <DisplayCoinDetails
                            key={ coin.id }
                            coinBasic={ coin }
                            coinDetailsList={ coinDetailsList }
                        />
                    )
                )
            }
        </>
    )
}