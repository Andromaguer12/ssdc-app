import { createUser, updateUser } from '@/redux/reducers/user/actions';
import { useAppDispatch } from '@/redux/store';
import { Button, TextField } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useState } from 'react'
import CustomizedAlert from '../CustomizedAlert/CustomizedAlert';

type Events = "Update" | "Create";

const UserForm = ({ data, eventSubmit }: { data: UserInitialState | null, eventSubmit: Events }) => {
    //const users = useAppSelector(state => state.user);
    const dispatch = useAppDispatch();
    const router = useRouter();

    // Estado para los datos del formulario
    const [formData, setFormData] = useState<UserInitialState>(data || {
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
            if (eventSubmit === "Create") {
                dispatch(createUser(formData));
            } else {
                dispatch(updateUser(formData));
            }
            router.push('/admin/dashboard');
        }
    };
    return (
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
            <Button disableElevation variant="contained" color="primary" type="submit">
                Enviar
            </Button>
            {error && <CustomizedAlert noElevation type='error' message={error} />}
        </form>
    )
}

export default UserForm