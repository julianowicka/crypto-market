import TableBody from "@mui/material/TableBody";
import { getComparator, Order } from "./CoinTableSorting";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import React from "react";
import { CoinModel } from "../../../../util/api/fetchCryptoList";
import { CoinRowsDisplay } from "./CoinRowsDisplay";

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
            <CoinRowsDisplay coins={coinsDisplayedOnPage} />
            { emptyRows > 0 && (
                <TableRow
                    style={ {
                        height: (53) * emptyRows,
                    } }
                >
                    <TableCell colSpan={ 6 }/>
                </TableRow>
            ) }
        </TableBody>
    )
}