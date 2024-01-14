'use client';
import styles from './Dashboard.module.scss';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import useFirebaseContext from '@/contexts/firebaseConnection/hook';
import { Button, Typography } from '@mui/material';
import { EmojiEvents, Group } from '@mui/icons-material';
import Link from 'next/link';
import useFetchingContext from '@/contexts/backendConection/hook';
import { userLogoutFunction } from '@/redux/reducers/user/actions';
import logo2 from '../../../assets/pages/home/logo2.png';
import Image from 'next/image';

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const fContext = useFetchingContext();

  const handleLogout = () => {
    dispatch(userLogoutFunction({ context: fContext }));
  };

  return (
    <section className={styles.Dashboard}>
      <div className={styles.container}>
        <div className={styles.title}>
          <Typography color="secondary" variant="h2">
            Bienvenido a DominoElite
          </Typography>

          <Typography color="secondary" className={styles.subtitle}>
            {'(Sistema Suizo de Domino Competitivo)'}
          </Typography>
        </div>
        <div className={styles.cards}>
          <div className={styles.card}>
            <div className={styles.header}>
              <Typography
                style={{ marginBottom: '10px' }}
                className={styles.subtitle}
              >
                Administracion
              </Typography>
              <Typography className={styles.title1} variant="h5">
                Administrar Usuarios Jugadores
              </Typography>

              <Typography className={styles.subtitle}>
                Ver / Crear / Editar / Eliminar, En este apartado podras
                gestionar todo lo relacionado a los usuarios jugadores, que
                podras utilizar para crear tus torneos
              </Typography>
            </div>
            <Group color="primary" style={{ fontSize: '200px' }} />
            <Link
              style={{ width: '100%', fontWeight: 'bold' }}
              href={'/admin/users'}
            >
              <Button
                style={{ fontWeight: 'bold' }}
                fullWidth
                variant="contained"
                color="primary"
              >
                Entrar
              </Button>
            </Link>
          </div>
          <div className={styles.logo}>
            <Image src={logo2} className={styles.image} alt="logo" />
          </div>
          <div className={styles.card}>
            <div className={styles.header}>
              <Typography
                style={{ marginBottom: '10px' }}
                className={styles.subtitle}
              >
                Administracion
              </Typography>
              <Typography className={styles.title1} variant="h5">
                Administrar Torneos
              </Typography>

              <Typography className={styles.subtitle}>
                Jugar / Crear / Eliminar, En este apartado podras manejar todo
                lo relacionado a los torneos, agregar los jugadores que tu
                desees, y visualizar en tiempo real todas sus estadisticas
              </Typography>
            </div>
            <EmojiEvents color="primary" style={{ fontSize: '200px' }} />
            <Link
              style={{ width: '100%', fontWeight: 'bold' }}
              href={'/admin/tournaments'}
            >
              <Button
                style={{ fontWeight: 'bold' }}
                fullWidth
                variant="contained"
                color="primary"
              >
                Entrar
              </Button>
            </Link>
          </div>
        </div>
        <div className={styles.title}>
          <Button
            onClick={handleLogout}
            className={styles.button}
            color="secondary"
            variant="contained"
          >
            Cerrar sesion
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
