import CustomizedAlert from '@/components/CustomizedAlert/CustomizedAlert';
import { addTournament } from '@/redux/reducers/tournament/actions';
import { useAppDispatch, useAppSelector } from '@/redux/store'
import { Button, TextField } from '@mui/material';
import Link from 'next/link'
import React, { useState } from 'react'

const TournamentForm = () => {
    const adminUser = useAppSelector(state => state.user);
    const tournaments = useAppSelector(state => state.tournament);
    const dispatch = useAppDispatch();

    // Estado para los datos del formulario
    const [formData, setFormData] = useState<TournamentInitialState>({
        name: '',
        rules: ''
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
        if (!formData.name || !formData.rules) {
            setError("Por favor, rellena todos los campos");
        } else {
            setError("");
            dispatch(addTournament(formData));
        }
    };


    return (
        <main>
            <h1>{`Panel Administrativo: (${adminUser[0].email || "usuario no identificado"})`}</h1>
            <ul>
                <li>
                    <div>
                        <h3>Registrar Torneo</h3>
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
                                label="Reglas"
                                name="rules"
                                type="text"
                                fullWidth
                                color='secondary'
                                value={formData.rules}
                                onChange={handleChange}
                            />


                            <Button fullWidth disableElevation variant="contained" color="primary" type="submit">
                                Enviar
                            </Button>
                            {error && <CustomizedAlert noElevation type='error' message={error} />}
                        </form>
                    </div>
                </li>
                <li>{tournaments.map(item => (
                    <div key={item.name}>
                    <h2>{item.name}</h2>
                </div>
                ))}</li>
                <li><Link href={''}>Editar Torneo</Link></li>
                <li><Link href={''}>Administrar Usuarios</Link></li>
            </ul>
        </main>
    )
}

export default TournamentForm