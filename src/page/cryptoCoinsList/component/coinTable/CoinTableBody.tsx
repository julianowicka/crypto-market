import TableBody from "@mui/material/TableBody";
import { getComparator, Order } from "./CoinTableSorting";
import React from "react";
import { CoinModel } from "../../../../util/api/fetchCryptoList";
import { CoinRows } from "./CoinRows";
import { EmptyTableRow } from "../../../../component/EmptyTableRow";

interface Props {
    coins: CoinModel[],
    order: Order,
    orderBy: keyof CoinModel,
    page: number,
    rowsPerPage: number,
}


export const CoinTableBody: React.FC<Props> = (props) => {
    const { coins, order, orderBy, rowsPerPage, page } = props

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - coins.length) : 0;

    const coinsDisplayedOnPage = coins.sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <TableBody>
            <CoinRows coins={ coinsDisplayedOnPage }/>
            { emptyRows > 0 && (<EmptyTableRow height={ 53 * emptyRows }/>) }
        </TableBody>
    )
}