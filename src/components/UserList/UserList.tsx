import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { deleteUser } from '@/redux/reducers/user/actions';

import style from './UserList.module.scss';


export default function UserList() {

    const users = useAppSelector(state => state.user);
    const dispatch = useAppDispatch();

    return (
        <div className={style.UserList}>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Nombre</TableCell>
                            <TableCell align="right">Telefono</TableCell>
                            <TableCell align="right">Ranking</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((row) => (
                            <TableRow
                                key={row.name}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {row.id}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {row.name}
                                </TableCell>
                                <TableCell align="right">{row.email}</TableCell>
                                <TableCell align="right">{row.rank}</TableCell>
                                <TableCell align="right"><button>Editar</button></TableCell>
                                <TableCell align="right"><button type='button' onClick={() => dispatch(deleteUser(row))}>Eliminar</button></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}
