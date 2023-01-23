import React from "react";
import { Typography } from "@mui/material";
import currencyFormatter from "currency-formatter";

interface Props {
    price: number | null
}

export const DisplayPrice: React.FC<Props> = (props) => {
    const { price } = props

    if (!price) {
        return <Typography />
    }

    const isLowPrice = price < 1;

    const formattedPrice = currencyFormatter.format(
        price,
        {
            code: "USD",
            precision: isLowPrice ? 6 : 2
        })

    return (
        <Typography>{ formattedPrice }</Typography>
    )
}