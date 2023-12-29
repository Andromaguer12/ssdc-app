"use client"
import styles from './styles/TournamentsPage.module.scss';
import { Button, Typography } from "@mui/material";
import { useAppDispatch } from "@/redux/store";
import useFirebaseContext from "@/contexts/firebaseConnection/hook";
import { Add } from '@mui/icons-material';


const TournamentsPage = () => {
  const dispatch = useAppDispatch()
  const fbContext = useFirebaseContext();

  return (
    <section className={styles.pageContainer}>
      <Typography sx={{ marginBottom: '20px', color: '#fff'}} variant="h3">Torneos</Typography>
      <div className={styles.tounamentsContainer}>
        <div className={styles.listHeader}>
          <Typography variant="h5">Lista de Torneos de Domino</Typography>
          <span className={styles.TournamentsPageRegisterUser}>
            <Button variant="contained" endIcon={<Add />}>Nuevo Torneo</Button>
          </span>
        </div>
        <div className={styles.listBody}>
        
        </div>
      </div>
    </section>
  )
}

export default TournamentsPage