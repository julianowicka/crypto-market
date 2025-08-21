import { CoinModel } from "../../../../util/api/fetchCryptoList";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../../../../util/api/QueryKeys";
import { fetchCoinDetails } from "../../../../util/api/fetchCoinDetails";
import { DisplayCoinDetails } from "./DisplayCoinDetails";

interface Props {
    coins: CoinModel[];
}

export const CoinRows: React.FC<Props> = (props) => {

    const { coins } = props;

    const coinIds = coins.map((coin) => coin.id).sort().join(",")
    const { data: coinDetailsList } = useQuery({
        queryKey: [ QueryKeys.GET_CRYPTO_DETAILS, coinIds ],
        queryFn: () => fetchCoinDetails(coins),
        refetchInterval: 30_000,
        enabled: coins.length > 0,
    })

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