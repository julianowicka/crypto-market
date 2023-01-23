import React from "react";
import TableCell from "@mui/material/TableCell";
import Box from "@mui/material/Box";

interface Props {
    children: React.ReactNode,
    shrink?: boolean
}

export const TableCellWrapper: React.FC<Props> = (props) => {
    const { children, shrink } = props

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
                },
                border: 0,
            } }
        >
            <Box
                className="rowCellBody"
                sx={ {
                    backgroundColor: "#212246",
                    height: "100px",
                    padding: "5px 16px 5px 16px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                } }
            >
                <Box
                    sx={ {
                        backgroundColor: "#212246",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: shrink ? "start" : "space-between",
                    } }
                >
                    { children }
                </Box>
            </Box>
        </TableCell>
    )
}