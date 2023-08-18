import React, { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { deleteUser, updateUser } from '@/redux/reducers/user/actions';

import UserForm from "@/components/UserForm/UserForm";

import style from './UserList.module.scss';
import ClearIcon from '@mui/icons-material/Clear';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { DeleteForever } from '@mui/icons-material';


export default function UserList() {

    const users = useAppSelector(state => state.user);
    const dispatch = useAppDispatch();
    const [form, setForm] = useState(false);
    const [dataForm, setDataForm] = useState<UserInitialState>(users[0]);

    const rankStyle = [
        {id: 'A', style: '#faffb5'},
        {id: 'B', style: '#badcf5'},
        {id: 'C', style: '#f5bfba'}
    ]

    return (
        <div className={style.UserList}>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Nombre</TableCell>
                            <TableCell align="left">Telefono</TableCell>
                            <TableCell align="center">Ranking</TableCell>
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
                                <TableCell align="left">{row.email}</TableCell>
                                <TableCell align="center"><span style={{ backgroundColor: `${rankStyle.filter(item => item.id == row.rank)[0].style}` }}>{row.rank}</span></TableCell>
                                <TableCell align="left">
                                    <ModeEditIcon onClick={() => {
                                        setDataForm(row);
                                        setForm(!form);
                                    }} />
                                </TableCell>
                                <TableCell align="left">
                                    <DeleteForever onClick={() => dispatch(deleteUser(row))} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {form && <div className={style.UserListModal}>
                <section onSubmit={() => setForm(false)}>
                    <ClearIcon onClick={() => setForm(false)} />
                    <UserForm data={dataForm} eventSubmit='Update' />
                </section>
            </div>}
        </div>
    );
}
