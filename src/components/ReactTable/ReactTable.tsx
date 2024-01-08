import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import styles from "./styles/ReactTable.module.scss";

interface ReactTableProps { 
  columns: any[];
  data: any[];
  customPageSize?: number;
  tableClass?: string;
  isShowingPageLength?: boolean;
  isPagination?: boolean;
  paginationDiv?: any;
  pagination?: any;
  renderCustomHeader?: () => React.FC<any>;
  filters?: any[];
  RowCollapseComponent?: () => React.FC<any>;
  unCollapsedRows?: any[];
}

const ReactTable: React.FC<ReactTableProps> = ({
  columns,
  data,
  customPageSize,
  tableClass,
  isShowingPageLength,
  isPagination,
  paginationDiv,
  pagination,
  renderCustomHeader,
  filters,
  RowCollapseComponent,
  unCollapsedRows,
}) => {
  

  return (
    <TableContainer component={Paper}>
      <Table sx={{ width: "100%" }} style={{ boxSizing: "border-box"}} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow style={{ background: "#003994"}}>
            {
              columns.map((column, index) => {
                return (
                  <TableCell 
                    sx={{ width: column?.width ?? "fit-content" }}
                    align={column.align ?? "left"}  
                    className={styles.headerCell}
                    style={{ textAlign: column.textAlign, padding: column?.padding ?? "20px" }}
                    >
                    {column?.header}
                  </TableCell>
                )
              })
            }
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row: any, index) => (
            <TableRow
              key={"row-"+index}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              {
                columns.map(({ accessor, textAlign }, index) => {
                  return (
                    <TableCell 
                      key={"row-cell-"+index}
                      className={styles.commonCell}
                      style={{ textAlign }}
                    >
                      {row?.[accessor] ?? ""}
                    </TableCell>
                  )
                })
              }
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ReactTable;
