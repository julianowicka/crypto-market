import React from "react";
import { TableRow, Skeleton } from "@mui/material";
import { TableCellWrapper } from "../../../../component/TableCellWrapper";

export const SkeletonCoinRow: React.FC = () => {
  return (
    <TableRow hover tabIndex={-1}>
      <TableCellWrapper shrink>
        <Skeleton variant="circular" width={30} height={30} />
        <Skeleton variant="text" width={120} sx={{ ml: 1 }} />
      </TableCellWrapper>
      <TableCellWrapper>
        <Skeleton variant="text" width={140} />
      </TableCellWrapper>
      <TableCellWrapper>
        <Skeleton variant="rectangular" width={100} height={50} />
      </TableCellWrapper>
      <TableCellWrapper>
        <Skeleton variant="circular" width={32} height={32} />
      </TableCellWrapper>
    </TableRow>
  )
}