import TableBody from "@mui/material/TableBody";
import { getComparator, Order } from "./CoinTableSorting";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import React from "react";
import { Data } from "./Data";

interface Props {
    rows: Data[],
    order: Order,
    orderBy: keyof Data,
    page: number,
    rowsPerPage: number,
}


export const CoinTableBody: React.FC<Props> = (props) => {
    const { rows, order, orderBy, rowsPerPage, page } = props

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    return (
        <TableBody>
            { rows.sort(getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                    return (
                        <TableRow
                            hover
                            tabIndex={ -1 }
                            key={ row.name }
                        >
                            <TableCell
                                component="th"
                                scope="row"
                                padding="none"
                            >
                                { row.name }
                            </TableCell>
                            <TableCell align="right">{ row.calories }</TableCell>
                            <TableCell align="right">{ row.fat }</TableCell>
                            <TableCell align="right">{ row.carbs }</TableCell>
                            <TableCell align="right">{ row.protein }</TableCell>
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