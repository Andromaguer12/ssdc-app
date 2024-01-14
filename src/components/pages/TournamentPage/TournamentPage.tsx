'use client';
import styles from './styles/TournamentPage.module.scss';
import {
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Select,
  Switch,
  Typography
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { useEffect, useState } from 'react';
import { getTournamentById } from '@/redux/reducers/tournaments/actions';
import useFetchingContext from '@/contexts/backendConection/hook';
import ReactTable from '@/components/ReactTable/ReactTable';
import {
  EmojiEvents,
  NextPlan,
  SignalWifiStatusbarConnectedNoInternet4,
  StickyNote2Sharp,
  Warning
} from '@mui/icons-material';
import useTournamentData from '@/hooks/useTournamentData/useTournamentData';
import TableComponent from './components/TableComponent';
import UpdateResultsModal from './components/UpdateResultsModal';
import {
  StoredRoundDataInterface,
  TournamentFormat,
  TournamentInterface,
  TournamentState
} from '@/typesDefs/constants/tournaments/types';
import PositionsTable from './components/PositionsTable';
import Link from 'next/link';
import {
  finalPositionsTableByPairsMapper,
  finalPositionsTableIndividualMapper,
  positionsTableByPairsMapper,
  positionsTableIndividualMapper
} from './constants/mapper';
import {
  finalPositionsTableByPairsColumns,
  finalPositionsTableIndividualColumns,
  positionsTableByPairsColumns,
  positionsTableIndividualColumns
} from './constants/positionsTableColumns';
import Image from 'next/image';
import logo1 from '../../../assets/pages/home/logo1.png';
interface TournamentPageProps {
  tournamentId: string;
}

const TournamentPage: React.FC<TournamentPageProps> = ({ tournamentId }) => {
  const dispatch = useAppDispatch();
  const fContext = useFetchingContext();
  const {
    tournamentData,
    tournamentAPI,
    errorDocument: errorGetTournamentById
  } = useTournamentData(tournamentId);
  const [openUpdateResults, setOpenUpdateResults] = useState('');
  const [showPositionsPanel, setShowPositionsPanel] = useState(true);
  const [viewAnalytics, setViewAnalytics] = useState(false);

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

  const isPossibleChangeRound = () => {
    if(tournamentData) {
      if (
        tournamentData.results &&
        Object.keys(tournamentData.results).length > 0
      ) {
        const tableKeys = Object.keys(tournamentData.results);
        const finishedTables = [];
  
        if (tournamentData && tournamentData?.results) {
          tableKeys.forEach(key => {
            if(tournamentData?.results) {
              const thereIsFinalWinner = (tournamentData?.results[
                key as keyof typeof tournamentData.results
              ] as any).resultsByRound.find((p: any) => typeof p?.finalWinner === 'number')
                ?.finalWinner;
    
              if (typeof thereIsFinalWinner === 'number' && thereIsFinalWinner > -1)
                finishedTables.push(thereIsFinalWinner);
            }

          });
  
          if (finishedTables.length === tournamentData?.tables.tables.length) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const handleNavigateToHistory = () => {
    if (tournamentData?.status !== 'finished') {
      const element = document.getElementById('history-table');
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    } else {
      setViewAnalytics(true);
    }
  };

  const finalPositionsTable = (format: TournamentFormat): {
    columns: any[],
    data: any[],
    name: TournamentFormat
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

  const finalWinnerResults: any = (data: TournamentInterface) =>
    tournamentAPI.calculateFinalResults(data?.format as 'individual' | 'pairs' | 'tables').winnerInfo;

  return (
    <section className={styles.pageContainer}>
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
            {/* <Typography 
                        color="secondary"
                        fontWeight={"bold"}
                        variant="h6"
                      >
                        1er puesto: 
                        <Typography 
                          color="secondary"
                          fontWeight={"bold"} 
                          variant="h4">
                            --
                          </Typography>
                      </Typography> */}
            <Typography color="secondary" fontWeight={'bold'} variant="h6">
              Estado:
              <Typography
                color="secondary"
                fontWeight={'bold'}
                display={'flex'}
                alignItems={'center'}
                flexDirection={'row'}
                variant="h4"
              >
                {tournamentData.status.toLocaleUpperCase()}
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
            <Typography color="secondary" fontWeight={'bold'} variant="h6">
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
            <Typography color="secondary" fontWeight={'bold'} variant="h6">
              Formato:
              <Typography color="secondary" fontWeight={'bold'} variant="h4">
                {tournamentData.format.toLocaleUpperCase()}
              </Typography>
            </Typography>
            <div className={styles.logo}>
              <Image src={logo1} alt="logo" className={styles.image} />
            </div>
          </div>
          {tournamentData.status !== 'finished' && (
            <div className={styles.controlPanel}>
              <Typography
                variant="h5"
                color="secondary"
                className={styles.panelTitle}
              >
                Panel de control
              </Typography>
              <div className={styles.controlPanelContainer}>
                <div className={styles.controls}>
                  <FormControl style={{ width: '150px' }}>
                    <InputLabel id="demo-simple-select-label">
                      Status del torneo
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={tournamentData.status}
                      label="Status del torneo"
                      size="small"
                      onChange={e =>
                        tournamentAPI.updateTournamentStatus(
                          e.target.value as TournamentState
                        )
                      }
                    >
                      <MenuItem value={'active'}>
                        <Typography
                          display="flex"
                          flexDirection={'row'}
                          alignItems={'center'}
                        >
                          Activo{' '}
                          <div
                            style={{ backgroundColor: 'green' }}
                            className={styles.dot}
                          />
                        </Typography>
                      </MenuItem>
                      <MenuItem value={'inactive'}>
                        <Typography
                          display="flex"
                          flexDirection={'row'}
                          alignItems={'center'}
                        >
                          Inactivo{' '}
                          <div
                            style={{ backgroundColor: '#7a7a7a' }}
                            className={styles.dot}
                          />
                        </Typography>
                      </MenuItem>
                      <MenuItem value={'paused'}>
                        <Typography
                          display="flex"
                          flexDirection={'row'}
                          alignItems={'center'}
                        >
                          Pausado{' '}
                          <div
                            style={{ backgroundColor: 'yellow' }}
                            className={styles.dot}
                          />
                        </Typography>
                      </MenuItem>
                    </Select>
                  </FormControl>
                  <FormGroup style={{ marginLeft: '10px' }}>
                    <FormControlLabel
                      control={
                        <Switch
                          onClick={() =>
                            setShowPositionsPanel(!showPositionsPanel)
                          }
                          checked={showPositionsPanel}
                        />
                      }
                      label="Mostrar panel de posiciones"
                    />
                  </FormGroup>
                  {tournamentData?.currentGlobalRound > 1 && (
                    <Button
                      disableElevation
                      variant="contained"
                      className={styles.button}
                      onClick={handleNavigateToHistory}
                    >
                      Historial de Rondas
                    </Button>
                  )}
                  {isPossibleChangeRound() &&
                    tournamentData.currentGlobalRound !==
                      tournamentData.customRounds && (
                      <Button
                        disableElevation
                        variant="contained"
                        className={styles.button}
                        endIcon={<NextPlan />}
                        onClick={tournamentAPI.handleNextGlobalRound}
                      >
                        Siguiente Ronda!
                      </Button>
                    )}
                  {isPossibleChangeRound() &&
                    tournamentData.currentGlobalRound ===
                      tournamentData.customRounds && (
                      <Button
                        disableElevation
                        variant="contained"
                        className={styles.button}
                        endIcon={<EmojiEvents />}
                        onClick={tournamentAPI.handleNextGlobalRound}
                      >
                        Terminar torneo!
                      </Button>
                    )}
                </div>
                <div className={styles.loader}>
                  {loadingUpdateTournament && (
                    <CircularProgress color="primary" size={25} />
                  )}
                </div>
              </div>
            </div>
          )}
          {!viewAnalytics && (
            <div
              className={styles.tournamentTablesContainer}
              style={{ paddingLeft: showPositionsPanel ? '0' : '20px' }}
            >
              {tournamentData.status !== 'active' && (
                <div
                  style={{
                    background:
                      tournamentData.status === 'finished'
                        ? 'transparent'
                        : '#7A7A7A7A'
                  }}
                  className={styles.shadow}
                >
                  {tournamentData.status === 'paused' && (
                    <CircularProgress color="secondary" size={50} />
                  )}
                  {tournamentData.status === 'inactive' && (
                    <SignalWifiStatusbarConnectedNoInternet4
                      sx={{ fontSize: '50px', color: '#ffffff' }}
                    />
                  )}
                  {tournamentData.status === 'finished' && (
                    <EmojiEvents sx={{ fontSize: '50px', color: '#ffffff' }} />
                  )}
                  {/* texts */}
                  {tournamentData.status === 'inactive' && (
                    <Typography color="secondary">
                      El torneo esta inactivo, debe activarlo para poder
                      continuar
                    </Typography>
                  )}
                  {tournamentData.status === 'paused' && (
                    <Typography color="secondary">Torneo en pausa</Typography>
                  )}
                  {tournamentData.status === 'finished' && (
                    <Typography sx={{ mt: 2, mb: 2 }} color="secondary">
                      El torneo ha finalizado
                    </Typography>
                  )}
                  {tournamentData.status === 'finished' && (
                    <Button
                      variant="contained"
                      color="secondary"
                      className={styles.buttonGood}
                      onClick={handleNavigateToHistory}
                    >
                      Ver estadisticas
                    </Button>
                  )}
                </div>
              )}
              {tournamentData.status !== 'finished' && (
                <>
                  <div
                    className={
                      showPositionsPanel
                        ? styles.tableComponentsContainer__asideActive
                        : styles.tableComponentsContainer
                    }
                  >
                    {tournamentData.tables.tables.map((table: any, index) => {
                      return (
                        <TableComponent
                          tournament={tournamentData}
                          key={table.tableId}
                          tableData={table}
                          thisTablePairs={table.thisTablePairs}
                          tableNumber={index + 1}
                          showHUD={true}
                          setOpenUpdateResults={() =>
                            setOpenUpdateResults(table.tableId)
                          }
                        />
                      );
                    })}
                  </div>
                  <div
                    className={
                      showPositionsPanel
                        ? styles.asideContainer__active
                        : styles.asideContainer
                    }
                  >
                    <PositionsTable
                      calculateTablePositions={
                        tournamentAPI.calculateTablePositions
                      }
                    />
                  </div>
                </>
              )}
            </div>
          )}
          {viewAnalytics && (
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
                          {finalWinnerResults(tournamentData)?.points ?? '--'}{' '}
                          pts
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
                              finalWinnerResults(tournamentData)
                                ?.effectiveness > 0
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
                                : finalWinnerResults(tournamentData)?.defeats >=
                                    3
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
          )}
        </>
      ) : (
        'Error'
      )}
      {tournamentData && (
        <UpdateResultsModal
          open={openUpdateResults}
          tournament={tournamentData as TournamentInterface}
          handleClose={() => setOpenUpdateResults('')}
        />
      )}
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
            {tournamentData?.storedRounds?.map(
              (currentResults: StoredRoundDataInterface) => {
                return (
                  <>
                    <div className={styles.title}>
                      <Typography
                        style={{ color: '#000', fontWeight: 'bold' }}
                        variant="h5"
                      >
                        Ronda {currentResults.currentRoundId}
                      </Typography>
                    </div>
                    <PositionsTable
                      calculateTablePositions={
                        tournamentAPI.calculateTablePositions
                      }
                      resultsToCalculate={currentResults}
                    />
                  </>
                );
              }
            )}
          </div>
        )}
    </section>
  );
};

export default TournamentPage;
