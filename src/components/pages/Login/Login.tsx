"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { Button, CircularProgress, Grid, TextField, Typography } from '@mui/material';
import CustomizedAlert from '@/components/CustomizedAlert/CustomizedAlert';
import styles from './styles/Login.module.scss';
import { clearStateUser, userLoginFunction } from '@/redux/reducers/user/actions';
import useFetchingContext from '@/contexts/backendConection/hook';

type FormData = {
  email: string;
  password: string;
};

export default function Login() {
  const dispatch = useAppDispatch();
  const fbContext = useFetchingContext();
  const router = useRouter();

  const { requestState: { loadingUser, success, error: errorLogin }, isAdmin } = useAppSelector(({ user }) => user)

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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.email || !formData.password) {
      setError('Por favor, rellena todos los campos');
    } else {
      setError('');

      // login real
      dispatch(
        userLoginFunction({
          context: fbContext,
          email: formData.email,
          password: formData.password
        })
      )
    }
  };

  useEffect(() => {
    if(errorLogin) {
      setError(errorLogin?.message)
    }
  }, [errorLogin])
  

  useEffect(() => {
    if(success && isAdmin){
      router.push("/admin/dashboard")
    }
    if(success && !isAdmin) {
      setError('El usuario no tiene permisos')
      dispatch(clearStateUser())
    }
  }, [success, isAdmin])
  

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
          <Typography variant="h4" align="center">
            DominoElite
          </Typography>
          <form className={styles.form} onSubmit={handleSubmit}>
            <Typography className={styles.title}>Sistema suizo de domino competitivo</Typography>
            <TextField
              className={styles.input}
              label="Email"
              name="email"
              type="email"
              fullWidth
              color="primary"
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              className={styles.input}
              label="Contraseña"
              name="password"
              type="password"
              fullWidth
              color="primary"
              value={formData.password}
              onChange={handleChange}
              style={{ marginBottom: "10px" }}
            />
            {error && (
              <CustomizedAlert noElevation type="error" message={error} />
            )}
            <Button
              fullWidth
              disableElevation
              className={styles.button}
              variant="contained"
              color="primary"
              type="submit"
            >
              {loadingUser ? (
                <CircularProgress size={'15px'} sx={{ color: "#fff", margin: '8px 0'}} />
              ) : (
                "Iniciar sesion"
              )}
            </Button>
          </form>
        </Grid>
        <div className={styles.texts}>
          <Typography color="secondary" variant='h3'>
            Juega y administra tus partidas de domino
          </Typography>
          <Typography color="secondary" variant='h5'>
            basandose en el sistema suizo de domino
          </Typography>
        </div>
      </Grid>
    </section>
    
  );
}
