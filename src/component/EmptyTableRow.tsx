import { TableCell, TableRow } from "@mui/material";
import React from "react";

interface Props {
    height: number,
}

export const EmptyTableRow: React.FC<Props> = (props) => {
    const { height } = props
    return (
        <TableRow
            style={ {
                height,
            } }
        >
            <TableCell colSpan={ 6 }/>
        </TableRow>
    )
}