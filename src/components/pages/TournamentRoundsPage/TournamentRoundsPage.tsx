'use client';
import styles from './styles/TournamentRoundsPage.module.scss';
import {
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography
} from '@mui/material';
import { useAppDispatch } from '@/redux/store';
import { useEffect, useState } from 'react';
import { getTournamentById } from '@/redux/reducers/tournaments/actions';
import useFetchingContext from '@/contexts/backendConection/hook';
import useTournamentData from '@/hooks/useTournamentData/useTournamentData';
import { Warning } from '@mui/icons-material';
import PositionsTable from '@/components/PositionsTable/PositionsTable';
import logo1 from '../../../assets/pages/home/logo1.png';
import Image from 'next/image';
import Link from 'next/link';

interface TournamentPageProps {
  tournamentId: string;
}

const TournamentRoundsPage: React.FC<TournamentPageProps> = ({
  tournamentId
}) => {
  const dispatch = useAppDispatch();
  const fContext = useFetchingContext();
  const {
    tournamentData,
    tournamentAPI,
    errorDocument: errorGetTournamentById
  } = useTournamentData(tournamentId);

  const [round, setRound] = useState(1);

  useEffect(() => {
    dispatch(
      getTournamentById({
        context: fContext,
        id: tournamentId
      })
    );
  }, []);

  return (
    <section
      className={styles.pageContainer}
      style={{ padding: '0px 20px', paddingBottom: '50px' }}
    >
      {!tournamentData ? (
        <div className={styles.loading}>
          <CircularProgress style={{ color: '#fff' }} size={50} />
          <Typography
            variant="h6"
            color="secondary"
            style={{ marginTop: '20px' }}
          >
            Cargando...
          </Typography>
        </div>
      ) : errorGetTournamentById ? (
        <div className={styles.loading}>
          <Warning style={{ color: '#fff', fontSize: 50 }} />
          <Typography
            variant="h6"
            style={{ marginTop: '20px' }}
            color={'secondary'}
          >
            {errorGetTournamentById}
          </Typography>
        </div>
      ) : tournamentData ? (
        <>
          <div className={styles.header}>
            <div className={styles.title}>
              <Typography
                style={{ color: '#000', fontWeight: 'bold' }}
                variant="h5"
              >
                {tournamentData.name}
              </Typography>
            </div>
            <Typography
              className={styles.mainLabels}
              color="secondary"
              fontWeight={'bold'}
              variant="h6"
            >
              Estado:
              <Typography
                color="secondary"
                fontWeight={'bold'}
                display={'flex'}
                alignItems={'center'}
                flexDirection={'row'}
                variant="h4"
              >
                {tournamentData?.status?.toLocaleUpperCase()}
                <div
                  className={styles.dot}
                  style={{
                    background:
                      tournamentData.status === 'active'
                        ? 'green'
                        : tournamentData.status === 'paused'
                          ? 'yellow'
                          : '#7a7a7a'
                  }}
                />
              </Typography>
            </Typography>
            <Typography
              className={styles.mainLabels}
              color="secondary"
              fontWeight={'bold'}
              variant="h6"
            >
              Ronda:
              <Typography
                color="secondary"
                fontWeight={'bold'}
                display={'flex'}
                alignItems={'flex-end'}
                flexDirection={'row'}
                variant="h4"
              >
                {tournamentData.currentGlobalRound}{' '}
                <Typography color="secondary" fontWeight={'bold'} variant="h6">
                  {' '}
                  / {tournamentData.customRounds}
                </Typography>
              </Typography>
            </Typography>
            <Typography
              className={styles.mainLabels}
              color="secondary"
              fontWeight={'bold'}
              variant="h6"
            >
              Formato:
              <Typography color="secondary" fontWeight={'bold'} variant="h4">
                {tournamentData.format.toLocaleUpperCase()}
              </Typography>
            </Typography>
            <div className={styles.logo}>
              <Image src={logo1} alt="logo" className={styles.image} />
            </div>
          </div>
          <div className={styles.controlPanel} style={{ marginBottom: '30px' }}>
            <Typography
              variant="h5"
              color="secondary"
              className={styles.panelTitle}
            >
              Panel de control del historial de rondas
            </Typography>
            <div className={styles.controlPanelContainer}>
              <div className={styles.controls}>
                <FormControl style={{ width: '150px', marginRight: '10px' }}>
                  <InputLabel id="demo-simple-select-label">
                    Seleccione una ronda
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={round}
                    label="Seleccione una ronda"
                    size="small"
                    onChange={e =>
                      setRound(Number(e.target.value))
                    }
                  >
                    {tournamentData &&
                      tournamentData?.results &&
                      Array(tournamentData?.currentGlobalRound - 1)
                        .fill('-')
                        .map((res, index) => {
                          return (
                            <MenuItem value={index + 1}>
                              <Typography
                                display="flex"
                                flexDirection={'row'}
                                alignItems={'center'}
                              >
                                Ronda {index + 1}
                              </Typography>
                            </MenuItem>
                          );
                        })}
                  </Select>
                </FormControl>
                {tournamentData?.currentGlobalRound > 1 && (
                  <Link href={'/admin/tournaments/' + tournamentData.id}>
                    <Button
                      disableElevation
                      variant="contained"
                      className={styles.button}
                    >
                      Volver al torneo
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
          {tournamentData?.storedRounds &&
            tournamentData?.status !== 'finished' &&
            tournamentData?.storedRounds?.length > 0 && (
              <div id="history-table" className={styles.historyTable}>
                <div className={styles.title}>
                  <Typography
                    style={{ color: '#000', fontWeight: 'bold' }}
                    variant="h5"
                  >
                    Historial de rondas globales
                  </Typography>
                </div>
                <div className={styles.title}>
                  <Typography
                    style={{ color: '#000', fontWeight: 'bold' }}
                    variant="h5"
                  >
                    Ronda{' '}
                    {tournamentData?.storedRounds[round - 1]?.currentRoundId}
                  </Typography>
                </div>
                <PositionsTable
                  calculateTablePositions={
                    tournamentAPI.calculateTablePositions
                  }
                  resultsToCalculate={tournamentData?.storedRounds[round - 1]}
                  storedRounds={tournamentData?.storedRounds}
                />
              </div>
            )}
        </>
      ) : (
        <></>
      )}
    </section>
  );
};

export default TournamentRoundsPage;
