import { Line, LineChart, YAxis } from "recharts";
import { CoinModelDetails } from "../../../../util/api/fetchCoinDetails";
import React from "react";
import Box from "@mui/material/Box";
import { useWindowSize } from "../../../../util/style/useWindowSize";
import { useFavoriteCoinsStore } from "../../../../util/store/useFavoriteCoinsStore";
import { getFavoriteColor } from "../../../../util/style/favoriteColors";

const CustomizedDot = () => {
    return <></>
}

interface Props {
    coin: CoinModelDetails
}

export const Simple24hMarketChart: React.FC<Props> = (props) => {
    const { coin } = props
    const { isDesktop } = useWindowSize()
    const { favoriteCoins } = useFavoriteCoinsStore()

    if (coin.sparkline_in_7d.price.length !== 168) {
        return <Box />
    }

    const last24hPrice = coin.sparkline_in_7d.price.slice(-24)
    const marketChart24hPrice = last24hPrice.map((price)=> ({ price: price }))

    const stroke = getFavoriteColor(coin.id, favoriteCoins)

    return (
        <Box sx={{ "& div": { background: "#212246" } }}>
            <LineChart
                width={ isDesktop ? 300 : 100 }
                height={ isDesktop ? 100 : 50 }
                data={ marketChart24hPrice }
            >
                <YAxis domain={[coin.low_24h, coin.high_24h]} hide />
                <Line
                    type="monotone"
                    dataKey="price"
                    stroke={stroke}
                    strokeWidth={ 2 }
                    dot={ <CustomizedDot/> }
                />
            </LineChart>
        </Box>
    )
}