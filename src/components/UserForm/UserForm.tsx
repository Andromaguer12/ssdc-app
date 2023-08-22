import React, { useState } from 'react'
import { useAppDispatch } from '@/redux/store';
import CustomizedAlert from '../CustomizedAlert/CustomizedAlert';
import useFirebaseContext from '@/contexts/firebaseConnection/hook';

import { UserReducerInitialState, userRegisterFunction } from '@/redux/reducers/user/actions';
import { Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField } from '@mui/material';

import style from './UserForm.module.scss';

type Events = "Update" | "Create";

const UserForm = ({ data, eventSubmit }: { data: UserReducerInitialState | null, eventSubmit: Events }) => {
    const dispatch = useAppDispatch();
    const fbContext = useFirebaseContext();
    const [error, setError] = useState<string>("");

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

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
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

    };
    return (
        <form onSubmit={handleSubmit} className={style.UserForm}>
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
            <FormControl fullWidth={true} >
                <FormLabel>Ranking</FormLabel>
                <RadioGroup
                    defaultValue="C"
                    name="rank"
                    row
                    value={formData.rank}
                    onChange={handleChange}
                >
                    <FormControlLabel value="A" control={<Radio />} label="A" />
                    <FormControlLabel value="B" control={<Radio />} label="B" />
                    <FormControlLabel value="C" control={<Radio />} label="C" />
                </RadioGroup>
            </FormControl>
            {/* Validacion de datos del formulario*/}
            {(!formData.name || !formData.email || !formData.phone || !formData.rank)
                ? <Button fullWidth disableElevation variant="contained" color="primary" type="button"
                    onClick={() => setError("Por favor, rellena todos los campos")}
                    className={style.UserFormButton}>
                    Enviar
                </Button>
                : <Button fullWidth disableElevation variant="contained" color="primary" type="submit"
                    className={style.UserFormButton}>
                    Enviar
                </Button>
            }
            {error && <CustomizedAlert noElevation type='error' message={error} />}
        </form>
    )
}

export default UserForm