import React, { useState } from 'react'
import { createUser } from '@/redux/reducers/user/actions';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { Button, TextField, Typography } from '@mui/material';
import CustomizedAlert from '@/components/CustomizedAlert/CustomizedAlert';

import styles from './UserForm.module.scss';
import { useRouter } from 'next/router';

const UserForm = () => {

    //const users = useAppSelector(state => state.user);
    const dispatch = useAppDispatch();
    const router = useRouter();

    // Estado para los datos del formulario
    const [formData, setFormData] = useState<UserInitialState>({
        name: '',
        email: '',
        rank: 'C',
        phone: '',
        id: ''
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
            router.push('/admin/dashboard');
        }
    };

    return (
        <div className={styles.UserForm}>
            <Typography variant='h3' gutterBottom>Registrar Usuario</Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Nombre"
                    name="name"
                    type="text"
                    fullWidth
                    margin="normal"
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
                    margin="normal"
                    value={formData.email}
                    onChange={handleChange}
                /> <TextField
                    label="Telefono"
                    name="phone"
                    type="text"
                    fullWidth
                    margin="normal"
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
    )
}

export default UserForm