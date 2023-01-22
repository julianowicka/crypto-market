import React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import { visuallyHidden } from '@mui/utils';
import { Order } from "./CoinTableSorting";
import { CoinModel } from "../../../../util/api/fetchCryptoList";
import { CoinTableBody } from "./CoinTableBody";

interface HeadCell {
    disablePadding: boolean;
    id: keyof CoinModel;
    label: string;
    numeric: boolean;
    sortable: boolean;
}

const headCells: readonly HeadCell[] = [
    {
        id: 'name',
        numeric: false,
        disablePadding: true,
        label: 'Name',
        sortable: true,
    },
    {
        id: 'symbol',
        numeric: true,
        disablePadding: false,
        label: 'Price',
        sortable: false,
    },
    {
        id: 'symbol',
        numeric: true,
        disablePadding: false,
        label: '24h Change',
        sortable: false,
    },
    {
        id: 'symbol',
        numeric: true,
        disablePadding: false,
        label: '24h Volume (USD)',
        sortable: false,
    },
    {
        id: 'symbol',
        numeric: true,
        disablePadding: false,
        label: 'Chart',
        sortable: false,
    },
];

interface EnhancedTableProps {
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof CoinModel) => void;
    order: Order;
    orderBy: string;
}

function EnhancedTableHead(props: EnhancedTableProps) {
    const { order, orderBy, onRequestSort } =
        props;
    const createSortHandler =
        (property: keyof CoinModel) => (event: React.MouseEvent<unknown>) => {
            onRequestSort(event, property);
        };

    return (
        <TableHead>
            <TableRow>
                { headCells.map((headCell) => (
                    <TableCell
                        key={ headCell.id }
                        align={ headCell.numeric ? 'right' : 'left' }
                        padding={ headCell.disablePadding ? 'none' : 'normal' }
                        sortDirection={ orderBy === headCell.id ? order : false }
                    >
                        { headCell.sortable && <TableSortLabel
                            active={ orderBy === headCell.id }
                            direction={ orderBy === headCell.id ? order : 'asc' }
                            onClick={ createSortHandler(headCell.id) }
                        >
                            { headCell.label }
                            { orderBy === headCell.id ? (
                                <Box
                                    component="span"
                                    sx={ visuallyHidden }
                                >
                                    { order === 'desc' ? 'sorted descending' : 'sorted ascending' }
                                </Box>
                            ) : null }
                        </TableSortLabel> }
                        { !headCell.sortable && headCell.label }
                    </TableCell>
                )) }
            </TableRow>
        </TableHead>
    );
}


interface CoinTableProps {
    filteredCoins: Array<CoinModel>
}


export const CoinTable: React.FC<CoinTableProps> = (props) => {
    const { filteredCoins } = props
    const [ order, setOrder ] = React.useState<Order>('asc');
    const [ orderBy, setOrderBy ] = React.useState<keyof CoinModel>('name');
    const [ page, setPage ] = React.useState(0);
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
                        <EnhancedTableHead
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