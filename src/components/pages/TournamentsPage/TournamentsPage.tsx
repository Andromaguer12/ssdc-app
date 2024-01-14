'use client';
import styles from './styles/TournamentsPage.module.scss';
import { Button, CircularProgress, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { EmojiEvents, Warning } from '@mui/icons-material';
import CreateTournamentsModal from './components/CreateTournamentsModal';
import { useCallback, useEffect, useState } from 'react';
import {
  clearGetTournaments,
  deleteTournament,
  getAllTournaments
} from '@/redux/reducers/tournaments/actions';
import useFetchingContext from '@/contexts/backendConection/hook';
import ReactTable from '@/components/ReactTable/ReactTable';
import { tournamentsColumns } from './constants/tournamentsColumns';
import { tournamentsMapper } from './constants/mapper';
import AcceptModal from '@/components/AcceptModal/AcceptModal';

const TournamentsPage = () => {
  const dispatch = useAppDispatch();
  const fContext = useFetchingContext();
  const [openModal, setOpenModal] = useState(false);
  const {
    getTournaments: {
      loadingGetTournaments,
      successGetTournaments,
      tournamentsList,
      errorGetTournaments
    },
    createTournament: { successCreateTournament },
    deleteTournament: {
      loadingDeleteTournament,
      successDeleteTournament,
      errorDeleteTournament
    }
  } = useAppSelector(({ tournaments }) => tournaments);
  const [DeleteTournament, setDeleteTournament] = useState('');

  const [allTournaments, setAllTournaments] = useState([]);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleDeleteModal = (id: string) => {
    setDeleteTournament(id);
  };

  useEffect(() => {
    if (successGetTournaments && tournamentsList) {
      const mappedData = tournamentsMapper(tournamentsList, handleDeleteModal);

      setAllTournaments(mappedData);
    }
  }, [successGetTournaments, tournamentsList]);

  useEffect(() => {
    dispatch(
      getAllTournaments({
        context: fContext
      })
    );
  }, []);

  useEffect(() => {
    if (successCreateTournament || successDeleteTournament) {
      dispatch(
        getAllTournaments({
          context: fContext
        })
      );
      setDeleteTournament('');
    }
  }, [successCreateTournament, successDeleteTournament]);

  useEffect(() => {
    return () => {
      dispatch(clearGetTournaments());
    };
  }, []);

  const acceptAction = useCallback(() => {
    if (DeleteTournament) {
      dispatch(
        deleteTournament({
          context: fContext,
          id: DeleteTournament
        })
      );
    }
  }, [DeleteTournament]);

  return (
    <section className={styles.pageContainer}>
      <Typography sx={{ marginBottom: '20px', color: '#fff' }} variant="h3">
        Torneos
      </Typography>
      <div className={styles.tounamentsContainer}>
        <div className={styles.listHeader}>
          <Typography variant="h5">Lista de Torneos de Domino</Typography>
          <span className={styles.TournamentsPageRegisterUser}>
            <Button
              onClick={handleOpenModal}
              variant="contained"
              endIcon={<EmojiEvents />}
            >
              Nuevo Torneo
            </Button>
          </span>
        </div>
        <div className={styles.listBody}>
          {loadingGetTournaments ? (
            <div className={styles.loading}>
              <CircularProgress color="primary" size={50} />
              <Typography variant="h6" style={{ marginTop: '20px' }}>
                Cargando torneos...
              </Typography>
            </div>
          ) : allTournaments.length > 0 ? (
            <ReactTable columns={tournamentsColumns} data={allTournaments} />
          ) : (
            <div className={styles.loading}>
              <Warning style={{ color: '#7a7a7a', fontSize: 50 }} />
              <Typography variant="h6" style={{ marginTop: '20px' }}>
                No hay torneos registrados o activos.
              </Typography>
            </div>
          )}
        </div>
      </div>
      <CreateTournamentsModal open={openModal} handleClose={handleCloseModal} />
      <AcceptModal
        acceptAction={acceptAction}
        handleClose={() => setDeleteTournament('')}
        open={Boolean(DeleteTournament)}
        loading={loadingDeleteTournament}
        error={errorDeleteTournament}
        text="Estas seguro de eliminar este torneo?"
        title="Advertencia"
      />
    </section>
  );
};

export default TournamentsPage;
