import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useAppDispatch, useAppSelector } from '@/redux/store';
//import { deleteUser, updateUser } from '@/redux/reducers/user/actions';

import style from './UserList.module.scss';

import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { DeleteForever } from '@mui/icons-material';
import { UserReducerInitialState } from '@/redux/reducers/user/actions';
import { getUsersList } from '@/redux/reducers/usersList/actions';
import useFirebaseContext from '@/contexts/firebaseConnection/hook';
import Modal from '../Modal/Modal';


export default function UserList() {

    const fbContext = useFirebaseContext();
    const users = useAppSelector(state => state.usersList.usersListData);
    const dispatch = useAppDispatch();

    const [form, setForm] = useState(false);
    const [dataForm, setDataForm] = useState<UserReducerInitialState>(users[0]);

    useEffect(() => {
        dispatch(getUsersList({
            context: fbContext,
        }));
    }, [users])

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
                                    {row.uid}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {row.name}
                                </TableCell>
                                <TableCell align="left">{row.phone}</TableCell>
                                <TableCell align="center" >
                                    {row.rank}
                                </TableCell>
                                <TableCell align="left">
                                    <ModeEditIcon onClick={() => {
                                        setDataForm(row);
                                        setForm(!form);
                                    }} />
                                </TableCell>
                                <TableCell align="left">
                                    <DeleteForever onClick={() => /*dispatch(deleteUser(row))*/ { }} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {form && <Modal setModal={() => setForm(false)} data={dataForm} />}
        </div>
    );
}
