import React from "react";
import { Typography } from "@mui/material";
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

interface Props {
    percent: number | undefined
}

export const DisplayPercent:React.FC<Props>= (props) => {

    const { percent } = props

    if (!percent) {
        return <Typography />
    }

    const isPositive = percent > 0
    return (
        <Typography sx={{ color: isPositive ? "#7BFFB2" : "#e65555", display: "flex" }}>
            { percent }%
            { isPositive ? <ArrowDropUpIcon /> : <ArrowDropDownIcon /> }
        </Typography>
    )
}