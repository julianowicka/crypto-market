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
                        size="medium"
                        aria-label="Cryptocurrency list"
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
                    rowsPerPageOptions={ [ 5 ] }
                    component="div"
                    count={ filteredCoins.length }
                    rowsPerPage={ rowsPerPage }
                    page={ page }
                    onPageChange={ handleChangePage }
                    onRowsPerPageChange={ handleChangeRowsPerPage }
                    labelRowsPerPage="Rows per page"
                    getItemAriaLabel={(type) => {
                        switch (type) {
                            case 'first':
                                return 'Go to first page';
                            case 'last':
                                return 'Go to last page';
                            case 'next':
                                return 'Go to next page';
                            case 'previous':
                                return 'Go to previous page';
                            default:
                                return 'Pagination control';
                        }
                    }}
                />
            </Paper>
        </Box>
    );
}