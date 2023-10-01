"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/redux/store';
import { Button, Grid, TextField, Typography } from '@mui/material';
import CustomizedAlert from '@/components/CustomizedAlert/CustomizedAlert';
import styles from './styles/Login.module.scss';
import useFirebaseContext from '@/contexts/firebaseConnection/hook';
import { userLoginFunction } from '@/redux/reducers/user/actions';

type FormData = {
  email: string;
  password: string;
};

export default function Login() {
  const dispatch = useAppDispatch();
  const fbContext = useFirebaseContext();
  const router = useRouter();

  // Estado para los datos del formulario
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  });


  const [error, setError] = useState<string>('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
  };

  // Función para manejar el envío del formulario
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validar los datos del formulario
    if (!formData.email || !formData.password) {
      setError('Por favor, rellena todos los campos');
    } else {
      setError('');

      // login real
      dispatch(
        userLoginFunction({
          context: fbContext,
          email: formData.email,
          password: formData.password //12345ja
        })
      ).then(() => router.push('/admin/dashboard'));
    }
  };




  return (
    <section className={styles.Login}>
      <Grid
      container
      className={styles.loginContainer}
      display={'flex'}
      flexDirection={'column'}
      alignItems={'center'}
      justifyContent={'center'}
    >
      <Grid
        item
        display={'flex'}
        flexDirection={'column'}
        alignItems={'center'}
        className={styles.loginForm}
      >
        <Typography variant="h5" align="center">
          Sistema Suizo Dominó Competitivo
        </Typography>
        <form className={styles.form} onSubmit={handleSubmit}>
          <Typography variant="h5">Iniciar sesión</Typography>
          <TextField
            className={styles.input}
            label="Email"
            name="email"
            type="email"
            fullWidth
            color="secondary"
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            className={styles.input}
            label="Contraseña"
            name="password"
            type="password"
            fullWidth
            color="secondary"
            value={formData.password}
            onChange={handleChange}
          />
          <Button
            fullWidth
            disableElevation
            className={styles.button}
            variant="contained"
            color="primary"
            type="submit"
          >
            Enviar
          </Button>
          {error && (
            <CustomizedAlert noElevation type="error" message={error} />
          )}
        </form>
      </Grid>
    </Grid>
    </section>
    
  );
}
