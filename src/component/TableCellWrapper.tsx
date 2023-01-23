import React from "react";
import TableCell from "@mui/material/TableCell";
import Box from "@mui/material/Box";

interface Props {
    children: React.ReactNode,
}

export const TableCellWrapper: React.FC<Props> = (props) => {
    const { children } = props
    return (
        <TableCell
            className="rowCells"
            sx={ {
                padding: "15px 0 15px 0",
                backgroundColor: "#161730",
                "&:first-child .rowCellBody": {
                    borderRadius: "10px 0 0 10px",
                },
                "&:last-child .rowCellBody": {
                    borderRadius: "0 10px 10px 0",
                }
            } }
        >
            <Box
                className="rowCellBody"
                sx={ {
                    backgroundColor: "#212246",
                    height: "100px",
                    padding: "5px 0 5px 0",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",

                } }
            >
                <Box sx={ { backgroundColor: "#212246" } }>
                    { children }
                </Box>
            </Box>
        </TableCell>
    )
}