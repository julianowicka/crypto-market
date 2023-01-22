import TableBody from "@mui/material/TableBody";
import { getComparator, Order } from "./CoinTableSorting";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import React from "react";
import { CoinModel } from "../../../../util/api/fetchCryptoList";

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

    return (
        <TableBody>
            { coins.sort(getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((coin) => {
                    return (
                        <TableRow
                            hover
                            tabIndex={ -1 }
                            key={ coin.id }
                        >
                            <TableCell
                                component="th"
                                scope="row"
                                padding="none"
                            >
                                { coin.name }
                            </TableCell>
                            <TableCell align="right">34,5$</TableCell>
                            <TableCell align="right">3,2%</TableCell>
                            <TableCell align="right">1,332,321 $</TableCell>
                            <TableCell align="right">Chart</TableCell>
                        </TableRow>
                    );
                }) }
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