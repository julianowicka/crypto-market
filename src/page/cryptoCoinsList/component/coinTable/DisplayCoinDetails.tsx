import React from "react";
import { CoinModel } from "../../../../util/api/fetchCryptoList";
import { CoinModelDetails } from "../../../../util/api/fetchCoinDetails";
import { Checkbox, TableRow, Typography } from "@mui/material";
import { EmptyTableRow } from "../../../../component/EmptyTableRow";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { useFavoriteCoinsStore } from "../../../../util/store/useFavoriteCoinsStore";
import { Simple24hMarketChart } from "./Simple24hMarketChart";
import { TableCellWrapper } from "../../../../component/TableCellWrapper";
import { DisplayPrice } from "../../../../component/DisplayPrice";
import { DisplayPercent } from "../../../../component/DisplayPercent";
import { useWindowSize } from "../../../../util/style/useWindowSize";
import { DisplayPriceAndPercentChange } from "./DisplayPriceAndPercentChange";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";

interface Props {
    coinBasic: CoinModel,
    coinDetailsList: CoinModelDetails[] | undefined,
}

export const DisplayCoinDetails: React.FC<Props> = (props) => {
    const { coinBasic, coinDetailsList } = props

    const coinDetails = coinDetailsList?.find((coin) => coinBasic.id === coin.id)

    const { removeFavoriteCoin, addFavoriteCoin, isFavoriteCoin, favoriteCoins } = useFavoriteCoinsStore()

    const { isDesktop, isMobile, isSuperSmall } = useWindowSize()

    if (!coinDetails) {
        return <EmptyTableRow height={ 53 }/>
    }

    const isFavorite = isFavoriteCoin(coinBasic)
    const isAtLimit = favoriteCoins.length >= 5 && !isFavorite

    const handleSetFavoriteCoin = (event: React.ChangeEvent<HTMLInputElement>) => {
        const checked = event.target.checked
        if (checked) {
            addFavoriteCoin(coinBasic)
        } else {
            removeFavoriteCoin(coinBasic)
        }
    }

    if (isMobile) {
        return (
            <TableRow
                hover
                tabIndex={ -1 }
            >
                <TableCellWrapper>
                    <Box sx={{ "& div": { backgroundColor: "#212246" }, display: "flex", flexDirection: "column" }}>
                        <Box sx={{ display: "flex" }}>
                            <img
                                src={ coinDetails.image }
                                style={ { height: "30px" } }
                                alt={ `Logo of ${ coinDetails.name } cryptocurrency` }
                            />
                            <Typography sx={ { marginLeft: "5px" } }>
                                { coinDetails.name }
                            </Typography>
                        </Box>
                        {isSuperSmall &&  <Simple24hMarketChart coin={ coinDetails }/> }
                    </Box>
                    <DisplayPriceAndPercentChange
                        price={ coinDetails.current_price }
                        percentChange={ coinDetails.price_change_percentage_24h }
                    />
                    {!isSuperSmall && <Simple24hMarketChart coin={ coinDetails }/> }
                    <Tooltip title={ isAtLimit ? "You cannot add more than five favorite coins" : "" } disableHoverListener={ !isAtLimit }>
                        <span>
                            <Checkbox
                                sx={ { margin: "0 0 0 1px" } }
                                checked={ isFavorite }
                                icon={ <FavoriteBorder fontSize="medium"/> }
                                checkedIcon={ <Favorite fontSize="medium"/> }
                                onChange={ handleSetFavoriteCoin }
                                disabled={ isAtLimit }
                                inputProps={{ 'aria-label': `Toggle favorite ${ coinDetails.name }` }}
                            />
                        </span>
                    </Tooltip>
                </TableCellWrapper>
            </TableRow>
        )
    }

    return (
        <TableRow
            hover
            tabIndex={ -1 }
        >
            <TableCellWrapper shrink>
                <img
                    src={ coinDetails.image }
                    style={ { height: "30px" } }
                    alt={ `Logo of ${ coinDetails.name } cryptocurrency` }
                />
                <Typography sx={ { marginLeft: "10px" } }>
                    { coinDetails.name }
                </Typography>
            </TableCellWrapper>
            <TableCellWrapper>
                <DisplayPriceAndPercentChange
                    price={ coinDetails.current_price }
                    percentChange={ coinDetails.price_change_percentage_24h }
                />
            </TableCellWrapper>
            { isDesktop && <>
                <TableCellWrapper>
                    <DisplayPercent percent={ coinDetails.price_change_percentage_24h }/>
                </TableCellWrapper>
                <TableCellWrapper>
                    <DisplayPrice price={ coinDetails.low_24h }/>
                </TableCellWrapper>
                <TableCellWrapper>
                    <DisplayPrice price={ coinDetails.high_24h }/>
                </TableCellWrapper>
            </> }
            <TableCellWrapper>
                <Simple24hMarketChart coin={ coinDetails }/>
            </TableCellWrapper>
            <TableCellWrapper>
                <Tooltip title={ isAtLimit ? "You cannot add more than five favorite coins" : "" } disableHoverListener={ !isAtLimit }>
                    <span>
                        <Checkbox
                            sx={ { margin: "0 0 0 20px" } }
                            checked={ isFavorite }
                            icon={ <FavoriteBorder fontSize="large"/> }
                            checkedIcon={ <Favorite fontSize="large"/> }
                            onChange={ handleSetFavoriteCoin }
                            disabled={ isAtLimit }
                            inputProps={{ 'aria-label': `Toggle favorite ${ coinDetails.name }` }}
                        />
                    </span>
                </Tooltip>
            </TableCellWrapper>
        </TableRow>
    )
}