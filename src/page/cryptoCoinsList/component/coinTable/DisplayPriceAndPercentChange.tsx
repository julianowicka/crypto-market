import React from "react";
import { DisplayPrice } from "../../../../component/DisplayPrice";
import { useWindowSize } from "../../../../util/style/useWindowSize";
import { DisplayPercent } from "../../../../component/DisplayPercent";
import Box from "@mui/material/Box";

interface Props {
    price: number,
    percentChange: number,
}

export const DisplayPriceAndPercentChange: React.FC<Props> = (props) => {
    const { price, percentChange } = props
    const { isDesktop } = useWindowSize()

    if (isDesktop) {
        return (
            <DisplayPrice price={ price }/>
        )
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "column", background: "#212246" }} >
            <DisplayPrice price={ price }/>
            <DisplayPercent percent={ percentChange }/>
        </Box>
    )
}