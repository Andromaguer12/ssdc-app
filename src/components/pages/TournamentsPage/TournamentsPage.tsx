"use client"
import styles from './styles/TournamentsPage.module.scss';
import { Button, CircularProgress, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { EmojiEvents, Warning } from '@mui/icons-material';
import CreateTournamentsModal from './components/CreateTournamentsModal';
import { useEffect, useState } from 'react';
import { clearGetTournaments, getAllTournaments } from '@/redux/reducers/tournaments/actions';
import useFetchingContext from '@/contexts/backendConection/hook';
import ReactTable from '@/components/ReactTable/ReactTable';
import { tournamentsColumns } from './constants/tournamentsColumns';
import { tournamentsMapper } from './constants/mapper';

const TournamentsPage = () => {
  const dispatch = useAppDispatch()
  const fContext = useFetchingContext();
  const [openModal, setOpenModal] = useState(false)
  const {
    getTournaments: {
      loadingGetTournaments,
      successGetTournaments,
      tournamentsList,
      errorGetTournaments
    },
    createTournament: {
      successCreateTournament,
    }
  } = useAppSelector(({ tournaments }) => tournaments)

  const [allTournaments, setAllTournaments] = useState([])

  const handleOpenModal = () => {
    setOpenModal(true)
  }

  const handleCloseModal = () => {
    setOpenModal(false)
  }

  useEffect(() => {
    if(successGetTournaments && tournamentsList) {
      const mappedData = tournamentsMapper(tournamentsList)

      setAllTournaments(mappedData)
    }
  }, [successGetTournaments, tournamentsList])
  

  useEffect(() => {
    dispatch(getAllTournaments({
      context: fContext,
    }))
  }, [])

  useEffect(() => {
    if(successCreateTournament) {
      dispatch(getAllTournaments({
        context: fContext,
      }))
    }
  }, [successCreateTournament])

  useEffect(() => {  
    return () => {
      dispatch(clearGetTournaments())
    }
  }, [])
  
  return (
    <section className={styles.pageContainer}>
      <Typography sx={{ marginBottom: '20px', color: '#fff'}} variant="h3">Torneos</Typography>
      <div className={styles.tounamentsContainer}>
        <div className={styles.listHeader}>
          <Typography variant="h5">Lista de Torneos de Domino</Typography>
          <span className={styles.TournamentsPageRegisterUser}>
            <Button onClick={handleOpenModal} variant="contained" endIcon={<EmojiEvents />}>Nuevo Torneo</Button>
          </span>
        </div>
        <div className={styles.listBody}>
          {loadingGetTournaments 
            ? <div className={styles.loading}>
                <CircularProgress color="primary" size={50} />
                <Typography variant="h6" style={{ marginTop: '20px' }}>Cargando torneos...</Typography>
              </div>
            : allTournaments.length > 0
              ? <ReactTable 
                  columns={tournamentsColumns}
                  data={allTournaments}
                /> 
              : (
                <div className={styles.loading}>
                  <Warning style={{ color: "#7a7a7a", fontSize: 50 }} />
                  <Typography variant="h6" style={{ marginTop: '20px' }}>No hay torneos registrados o activos.</Typography>
                </div>
              )
          }
        </div>
      </div>
      <CreateTournamentsModal 
        open={openModal}
        handleClose={handleCloseModal}
      />
    </section>
  )
}

export default TournamentsPage