import { Line, LineChart, YAxis } from "recharts";
import { CoinModelDetails } from "../../../../util/api/fetchCoinDetails";
import React from "react";

const CustomizedDot = () => {
    return <></>
}

interface Props {
    coin: CoinModelDetails
}

export const Simple24hMarketChart: React.FC<Props> = (props) => {
    const { coin } = props

    if (coin.sparkline_in_7d.price.length !== 168) {
        return null
    }

    const last24hPrice = coin.sparkline_in_7d.price.slice(-24)
    const marketChart24hPrice = last24hPrice.map((price)=> ({ price: price }))

    return (
        <>
            <LineChart
                width={ 300 }
                height={ 100 }
                data={ marketChart24hPrice }
            >
                <YAxis domain={[coin.low_24h, coin.high_24h]} hide />
                <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#8884d8"
                    strokeWidth={ 2 }
                    dot={ <CustomizedDot/> }
                />
            </LineChart>
        </>
    )
}