import React from "react";
import { CoinModel } from "../../../../util/api/fetchCryptoList";
import { Order } from "./CoinTableSorting";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableSortLabel from "@mui/material/TableSortLabel";
import { useWindowSize } from "../../../../util/style/useWindowSize";

interface Props {
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof CoinModel) => void;
    order: Order;
    orderBy: string;
}

export const CoinTableHeader = (props: Props) => {
    const { isDesktop, isMobile } = useWindowSize();

    const { order, orderBy, onRequestSort } =
        props;

    const createSortHandler =
        (property: keyof CoinModel) => (event: React.MouseEvent<unknown>) => {
            onRequestSort(event, property);
        };

    if (isMobile) {
        return (
            <TableHead>
                <TableRow>
                    <TableCell
                        align="left"
                        padding="normal"
                        sortDirection={ orderBy === "name" ? order : false }
                    >
                        <TableSortLabel
                            active={ orderBy === "name" }
                            direction={ orderBy === "name" ? order : 'asc' }
                            onClick={ createSortHandler("name") }
                        >
                            Name
                        </TableSortLabel>
                    </TableCell>
                </TableRow>
            </TableHead>
        );
    }

    return (
        <TableHead>
            <TableRow>
                <TableCell
                    align="left"
                    padding="normal"
                    sortDirection={ orderBy === "name" ? order : false }
                >
                    <TableSortLabel
                        active={ orderBy === "name" }
                        direction={ orderBy === "name" ? order : 'asc' }
                        onClick={ createSortHandler("name") }
                    >
                        Name
                    </TableSortLabel>
                </TableCell>
                <TableCell>
                    Price
                </TableCell>
                { isDesktop && <>
                    <TableCell>
                        24h Change
                    </TableCell>
                    <TableCell>
                        24h Low
                    </TableCell>
                    <TableCell>
                        24h High
                    </TableCell>
                </> }
                <TableCell>
                    Chart
                </TableCell>
                <TableCell />
            </TableRow>
        </TableHead>
    );
}