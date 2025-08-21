import { CoinModel } from "../../../../util/api/fetchCryptoList";
import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../../../../util/api/QueryKeys";
import { fetchCoinDetails } from "../../../../util/api/fetchCoinDetails";
import { DisplayCoinDetails } from "./DisplayCoinDetails";
import { SkeletonCoinRow } from "./SkeletonCoinRow";
import { useNotificationStore } from "../../../../util/store/useNotificationStore";

interface Props {
    coins: CoinModel[];
}

export const CoinRows: React.FC<Props> = (props) => {

    const { coins } = props;
    const { openErrorMessage } = useNotificationStore()

    const coinIds = coins.map((coin) => coin.id).sort().join(",")
    const { data: coinDetailsList, isLoading, isError, error } = useQuery({
        queryKey: [ QueryKeys.GET_CRYPTO_DETAILS, coinIds ],
        queryFn: () => fetchCoinDetails(coins),
        refetchInterval: 30_000,
        enabled: coins.length > 0,
    })

    useEffect(() => {
        if (isError && error) {
            openErrorMessage(error.message ?? 'Failed to load coin details')
        }
    }, [ isError, error, openErrorMessage ])

    if (!coinDetailsList && coins.length > 0) {
        return <>
            { coins.map((c) => (<SkeletonCoinRow key={c.id}/>)) }
        </>
    }

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