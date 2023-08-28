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
import { Skeleton, Stack } from '@mui/material';



export default function UserList() {

    const fbContext = useFirebaseContext();
    const userList = useAppSelector(state => state.usersList);
    const dispatch = useAppDispatch();

    const [modal, setModal] = useState(false);
    const [dataForm, setDataForm] = useState<UserReducerInitialState>(userList.data[userList.data.length - 1]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        dispatch(getUsersList({
            context: fbContext,
        })).then(() => setLoading(false));
    }, [userList.data])
    if (!loading || !userList.loading) {
        return (
            <div className={style.UserList}>
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
                            {userList.data.map((user) => (
                                <TableRow
                                    key={user.uid}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    className={style.UserListRow}
                                >
                                    <TableCell component="th" scope="row">
                                        {user.uid}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {user.name}
                                    </TableCell>
                                    <TableCell align="left">{user.phone}</TableCell>
                                    <TableCell align="center" >
                                        {user.rank}
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
                                            id: "yai05szLzAMGgHUvO3uj"
                                        }))} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                {modal && <Modal setModal={() => setModal(false)} data={dataForm} />}
            </div>
        );
    } else {
        return (
            <div className={style.UserList}>
                <Stack spacing={1}>
                    <Skeleton variant="rectangular" width={650} height={68} animation="wave" />
                    <Skeleton variant="rounded" width={650} height={130} animation="wave" />
                </Stack>
            </div>
        )
    }
};


