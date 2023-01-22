import React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import { Order } from "./CoinTableSorting";
import { CoinModel } from "../../../../util/api/fetchCryptoList";
import { CoinTableBody } from "./CoinTableBody";
import { CoinTableHeader } from "./CoinTableHeader";


interface CoinTableProps {
    filteredCoins: Array<CoinModel>,
    page: number,
    setPage: (page: number)=>void,
}

export const CoinTable: React.FC<CoinTableProps> = (props) => {
    const { filteredCoins, page, setPage } = props
    const [ order, setOrder ] = React.useState<Order>('asc');
    const [ orderBy, setOrderBy ] = React.useState<keyof CoinModel>('name');
    const [ rowsPerPage, setRowsPerPage ] = React.useState(5);

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof CoinModel,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };


    return (
        <Box sx={ { width: '100%' } }>
            <Paper sx={ { width: '100%', mb: 2 } }>
                <TableContainer>
                    <Table
                        sx={ { minWidth: 750 } }
                        aria-labelledby="tableTitle"
                        size="medium"
                    >
                        <CoinTableHeader
                            order={ order }
                            orderBy={ orderBy }
                            onRequestSort={ handleRequestSort }
                        />
                        <CoinTableBody
                            coins={ filteredCoins }
                            order={ order }
                            orderBy={ orderBy }
                            page={ page }
                            rowsPerPage={ rowsPerPage }
                        />
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={ [ 5, 10, 25 ] }
                    component="div"
                    count={ filteredCoins.length }
                    rowsPerPage={ rowsPerPage }
                    page={ page }
                    onPageChange={ handleChangePage }
                    onRowsPerPageChange={ handleChangeRowsPerPage }
                />
            </Paper>
        </Box>
    );
}