//import { createUser, updateUser } from '@/redux/reducers/user/actions';
import { useAppDispatch } from '@/redux/store';
import { Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useState } from 'react'
import CustomizedAlert from '../CustomizedAlert/CustomizedAlert';
import { UserReducerInitialState, userRegisterFunction } from '@/redux/reducers/user/actions';
import useFirebaseContext from '@/contexts/firebaseConnection/hook';

type Events = "Update" | "Create";

const UserForm = ({ data, eventSubmit }: { data: UserReducerInitialState | null, eventSubmit: Events }) => {
    //const users = useAppSelector(state => state.user);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const fbContext = useFirebaseContext();

    // Estado para los datos del formulario
    const [formData, setFormData] = useState<UserReducerInitialState>(data || {
        name: '',
        email: '',
        rank: 'C',
        phone: '',
        uid: '',
        loadingUser: false,
        error: '',
        accessToken: '',
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
                console.log("CREANDO")
                dispatch(userRegisterFunction({
                    context: fbContext,
                    data: formData,
                    id: "3243423"
                }));
            } else {
                // dispatch(updateUser(formData));
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
            <FormControl>
                <FormLabel id="demo-radio-buttons-group-label">Ranking</FormLabel>
                <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue="C"
                    name="rank"
                    value={formData.phone}
                    onChange={handleChange}
                >
                    <FormControlLabel value="A" control={<Radio />} label="A" />
                    <FormControlLabel value="B" control={<Radio />} label="B" />
                    <FormControlLabel value="C" control={<Radio />} label="C" />
                </RadioGroup>
            </FormControl>
            <Button disableElevation variant="contained" color="primary" type="submit">
                Enviar
            </Button>
            {error && <CustomizedAlert noElevation type='error' message={error} />}
        </form>
    )
}

export default UserForm