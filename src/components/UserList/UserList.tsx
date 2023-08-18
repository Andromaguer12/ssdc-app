import React, { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';



import style from './UserList.module.scss';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { Button, TextField } from '@mui/material';
import { createUser, deleteUser } from '@/redux/reducers/user/actions';
import CustomizedAlert from '../CustomizedAlert/CustomizedAlert';


export default function UserList() {

    const users = useAppSelector(state => state.user);
    const dispatch = useAppDispatch();

    // Estado para los datos del formulario
    const [formData, setFormData] = useState<UserInitialState>({
        name: '',
        email: '',
        rank: 'C',
        phone: ''
    });

    const [error, setError] = useState<string>("");

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Validar los datos del formulario
        if (!formData.name || !formData.email || !formData.phone || !formData.rank) {
            setError("Por favor, rellena todos los campos");
        } else {
            setError("");
            dispatch(createUser(formData));
        }
    };

    return (
        <div className={style.UserList}>
            <div>
                <h3>Registrar Usuario</h3>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Nombre"
                        name="name"
                        type="text"
                        fullWidth
                        color='secondary'
                        value={formData.name}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Correo electronico"
                        name="email"
                        type="email"
                        fullWidth
                        color='secondary'
                        value={formData.email}
                        onChange={handleChange}
                    /> <TextField
                        label="Telefono"
                        name="phone"
                        type="text"
                        fullWidth
                        color='secondary'
                        value={formData.phone}
                        onChange={handleChange}
                    />
                    {/*Pendiente el ranking */}
                    <Button fullWidth disableElevation variant="contained" color="primary" type="submit">
                        Enviar
                    </Button>
                    {error && <CustomizedAlert noElevation type='error' message={error} />}
                </form>
            </div>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
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
