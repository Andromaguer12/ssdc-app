"use client"
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
import { UserReducerInitialState, userDeleteFunction } from '@/redux/reducers/user/actions';
import { getUsersList } from '@/redux/reducers/usersList/actions';
import useFirebaseContext from '@/contexts/firebaseConnection/hook';
import Modal from '../Modal/Modal';
import { Chip, Skeleton, Stack } from '@mui/material';



export default function UserList() {

    const fbContext = useFirebaseContext();
    const userList = useAppSelector(state => state.usersList.data);
    const dispatch = useAppDispatch();

    const [modal, setModal] = useState(false);
    const [dataForm, setDataForm] = useState<UserReducerInitialState>(userList[userList.length - 1]);


    const { loading } = useAppSelector(({ usersList }) => usersList)

    useEffect(() => {
        dispatch(getUsersList({
            context: fbContext,
        }))
    }, [])

    return (
        <div className={style.UserList}>
            {!loading && (
                <div className={style.loader}>

                </div>
            )}
            {/* {!loading && (
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 150 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Nombre</TableCell>
                                <TableCell align="left">Telefono</TableCell>
                                <TableCell align="center">Ranking</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {userList.map((user) => (
                                <TableRow
                                    key={user.uid}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    className={style.UserListRow}
                                >
                                    <TableCell component="th" scope="row">
                                        {user.id}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {user.name}
                                    </TableCell>
                                    <TableCell align="left">{user.phone}</TableCell>
                                    <TableCell align="center" >
                                        <Chip label={user.rank} color="default" variant="outlined" />
                                    </TableCell>
                                    <TableCell align="left">
                                        <ModeEditIcon onClick={() => {
                                            setDataForm(user);
                                            setModal(!modal);
                                        }} />
                                    </TableCell>
                                    <TableCell align="left">
                                        <DeleteForever onClick={() => dispatch(userDeleteFunction({
                                            context: fbContext,
                                            user: user
                                        }))} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )} */}
            {modal && <Modal setModal={() => setModal(false)} userData={dataForm} format="user" />}
        </div>
    );
};


