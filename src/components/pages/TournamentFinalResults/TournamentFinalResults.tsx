'use client';
import styles from './styles/TournamentFinalResults.module.scss';
import {
  Button,
  CircularProgress,
  List,
  ListItem,
  Typography
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { useEffect } from 'react';
import { getTournamentById } from '@/redux/reducers/tournaments/actions';
import useFetchingContext from '@/contexts/backendConection/hook';
import useTournamentData from '@/hooks/useTournamentData/useTournamentData';
import {
  TournamentFormat,
  TournamentInterface
} from '@/typesDefs/constants/tournaments/types';
import { EmojiEvents, Warning } from '@mui/icons-material';
import ReactTable from '@/components/ReactTable/ReactTable';
import Link from 'next/link';
import {
  finalPositionsTableByPairsMapper,
  finalPositionsTableIndividualMapper
} from '../TournamentFinalResults/constants/mapper';
import {
  finalPositionsTableByPairsColumns,
  finalPositionsTableIndividualColumns
} from '../TournamentFinalResults/constants/positionsTableColumns';
import Image from 'next/image';
import logo1 from '../../../assets/pages/home/logo1.png';

interface TournamentFinalResultsProps {
  tournamentId: string;
}

const TournamentFinalResults: React.FC<TournamentFinalResultsProps> = ({ tournamentId }) => {
  const dispatch = useAppDispatch();
  const fContext = useFetchingContext();
  const {
    tournamentData,
    tournamentAPI,
    errorDocument: errorGetTournamentById
  } = useTournamentData(tournamentId);

  const {
    updateTournament: { loadingUpdateTournament }
  } = useAppSelector(({ tournaments }) => tournaments);

  useEffect(() => {
    dispatch(
      getTournamentById({
        context: fContext,
        id: tournamentId
      })
    );
  }, []);

  const finalWinnerResults: any = (data: TournamentInterface) =>
    tournamentAPI.calculateFinalResults(
      data?.format as 'individual' | 'pairs' | 'tables'
    ).winnerInfo;

  const finalPositionsTable = (
    format: TournamentFormat
  ): {
    columns: any[];
    data: any[];
    name: TournamentFormat;
  } => {
    if (format === 'individual') {
      return {
        columns: finalPositionsTableIndividualColumns,
        data: finalPositionsTableIndividualMapper(
          tournamentAPI.calculateFinalResults('individual').globalPositionsTable
        ),
        name: 'individual'
      };
    }
    if (format === 'pairs') {
      return {
        columns: finalPositionsTableByPairsColumns,
        data: finalPositionsTableByPairsMapper(
          tournamentAPI.calculateFinalResults('pairs').globalPositionsTable
        ),
        name: 'pairs'
      };
    }
    return {
      columns: [],
      data: [],
      name: 'individual'
    };
  };

  return (
    <section className={styles.pageContainer}
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
        <div className={styles.header} style={{ marginBottom: "30px"}}>
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
          <div className={styles.tournamentFinalInfo}>
            <Typography className={styles.title} variant="h5">
              Tabla de resultados finales
            </Typography>
            <div className={styles.winner}>
              <Typography className={styles.first} variant="h5">
                El ganador del torneo de formato {tournamentData.format}, es:
              </Typography>
              <EmojiEvents className={styles.icon} />
              <div className={styles.datas}>
                <Typography className={styles.secondary} variant="h5">
                  {finalWinnerResults(tournamentData)?.name ?? '--'}
                </Typography>
                <Typography className={styles.terciary} variant="h5">
                  Puntaje obtenido del ganador:
                </Typography>
                <div className={styles.winnerTable}>
                  <List className={styles.resultsWinner}>
                    <ListItem
                      className={styles.listItem}
                      style={{ background: '#f5f5f5' }}
                    >
                      <Typography className={styles.pairColors}>
                        Puntos:{' '}
                      </Typography>
                      <Typography
                        fontWeight={'bold'}
                        className={styles.pairColors}
                      >
                        {finalWinnerResults(tournamentData)?.points ?? '--'} pts
                      </Typography>
                    </ListItem>
                    <ListItem
                      className={styles.listItem}
                      style={{ background: '#e7e7e7' }}
                    >
                      <Typography className={styles.pairColors}>
                        Efectividad:{' '}
                      </Typography>
                      <Typography
                        style={{
                          color:
                            finalWinnerResults(tournamentData)?.effectiveness >
                            0
                              ? 'green'
                              : 'red'
                        }}
                        fontWeight={'bold'}
                        className={styles.pairColors}
                      >
                        {finalWinnerResults(tournamentData)?.effectiveness ??
                          '--'}
                      </Typography>
                    </ListItem>
                    <ListItem
                      className={styles.listItem}
                      style={{ background: '#f5f5f5' }}
                    >
                      <Typography className={styles.pairColors}>
                        Victorias:{' '}
                      </Typography>
                      <Typography
                        style={{
                          color:
                            finalWinnerResults(tournamentData)?.wins === 0
                              ? 'red'
                              : finalWinnerResults(tournamentData)?.wins >= 3
                                ? 'green'
                                : 'orange'
                        }}
                        fontWeight={'bold'}
                        className={styles.pairColors}
                      >
                        {finalWinnerResults(tournamentData)?.wins ?? '--'}
                      </Typography>
                    </ListItem>
                    <ListItem
                      className={styles.listItem}
                      style={{ background: '#e7e7e7' }}
                    >
                      <Typography className={styles.pairColors}>
                        Derrotas:{' '}
                      </Typography>
                      <Typography
                        style={{
                          color:
                            finalWinnerResults(tournamentData)?.defeats === 0
                              ? 'green'
                              : finalWinnerResults(tournamentData)?.defeats >= 3
                                ? 'red'
                                : 'orange'
                        }}
                        fontWeight={'bold'}
                        className={styles.pairColors}
                      >
                        {finalWinnerResults(tournamentData)?.defeats ?? '--'}
                      </Typography>
                    </ListItem>
                  </List>
                </div>
              </div>
            </div>
            <ReactTable
              columns={finalPositionsTable(tournamentData.format)?.columns}
              data={finalPositionsTable(tournamentData.format)?.data}
            />
            <Link href={'/admin/tournaments'}>
              <Button
                variant="contained"
                color="secondary"
                className={styles.buttonGood}
                disableElevation
              >
                Volver a la lista de torneos
              </Button>
            </Link>
          </div>
        </>
      ) : (
        <></>
      )}
    </section>
  );
};

export default TournamentFinalResults;
