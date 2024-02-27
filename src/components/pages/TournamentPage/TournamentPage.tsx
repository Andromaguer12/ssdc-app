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
  Pagination,
  Select,
  Switch,
  Tab,
  Tabs,
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
import Link from 'next/link';
import Image from 'next/image';
import logo1 from '../../../assets/pages/home/logo1.png';
import SwipeableViews from 'react-swipeable-views';
import ChangePlayerTablePositionsModal from './components/ChangePlayerTablePositionsModal';
import PositionsTable from '@/components/PositionsTable/PositionsTable';
import { arraySplitter } from '@/utils/array-splitter';
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
  const [openChangePlayerTablePositions, setOpenChangePlayerTablePositions] =
    useState('');
  const [showPositionsPanel, setShowPositionsPanel] = useState(true);
  const [viewAnalytics, setViewAnalytics] = useState(false);
  const [viewsResponsive, setViewsResponsive] = useState(0);
  const [page, setPage] = useState(1);

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
    if (tournamentData) {
      if (
        tournamentData.results &&
        Object.keys(tournamentData.results).length > 0
      ) {
        const tableKeys = Object.keys(tournamentData.results);
        const finishedTables = [];

        if (tournamentData && tournamentData?.results) {
          tableKeys.forEach(key => {
            if (tournamentData?.results) {
              const thereIsFinalWinner = (
                tournamentData?.results[
                  key as keyof typeof tournamentData.results
                ] as any
              ).resultsByRound.find(
                (p: any) => typeof p?.finalWinner === 'number'
              )?.finalWinner;

              if (
                typeof thereIsFinalWinner === 'number' &&
                thereIsFinalWinner > -1
              )
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

  const handleChangeViewsResponsive = (
    event: React.SyntheticEvent,
    newValue: number
  ) => {
    setViewsResponsive(newValue);
  };

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

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
                  <FormGroup
                    className={styles.switchPositions}
                    style={{ marginLeft: '10px' }}
                  >
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
                    <Link
                      href={
                        '/admin/tournaments/rounds-history/' + tournamentData.id
                      }
                    >
                      <Button
                        disableElevation
                        variant="contained"
                        className={styles.button}
                      >
                        Historial de Rondas
                      </Button>
                    </Link>
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
                <div className={styles.controlsResponsive}>
                  <Tabs
                    value={viewsResponsive}
                    onChange={handleChangeViewsResponsive}
                    scrollButtons
                    allowScrollButtonsMobile
                  >
                    <Tab style={{ fontWeight: 'bold' }} label="Juego" />
                    <Tab
                      style={{ fontWeight: 'bold' }}
                      label="Tabla de posiciones"
                    />
                  </Tabs>
                </div>
              </div>
            </div>
          )}
          <>
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
                    <Link href={"/admin/tournaments/final-results/" + tournamentId}>
                      <Button
                        variant="contained"
                        color="secondary"
                        className={styles.buttonGood}
                      >
                        Ver estadisticas
                      </Button>
                    </Link>
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
                    {arraySplitter(tournamentData.tables.tables, 4)[page-1 === -1 ? 0 : page-1].map(
                      (table: any, index) => {
                        const findNumber = tournamentData.tables.tables.findIndex((tab) => tab.tableId === table.tableId)

                        return (
                          <TableComponent
                            tournament={tournamentData}
                            key={table.tableId}
                            tableData={table}
                            thisTablePairs={table.thisTablePairs}
                            tableNumber={findNumber+1}
                            showHUD={true}
                            setOpenUpdateResults={() =>
                              setOpenUpdateResults(table.tableId)
                            }
                            setOpenChangePlayerTablePositions={() =>
                              setOpenChangePlayerTablePositions(table.tableId)
                            }
                          />
                        );
                      }
                    )}
                    {arraySplitter(tournamentData.tables.tables, 4).length > 1 && <div className={styles.paginationDiv}>
                      <div className={styles.container}>
                        <Pagination
                          variant="outlined"
                          shape="rounded"
                          page={page}
                          onChange={handleChange}
                          defaultPage={1}
                          count={
                            arraySplitter(tournamentData.tables.tables, 4).length
                          }
                          color="primary"
                        />
                      </div>
                    </div>}
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
                      storedRounds={tournamentData?.storedRounds}
                    />
                  </div>
                </>
              )}
            </div>
            <div className={styles.tournamentSwipeableContainerResponsive}>
              <SwipeableViews
                index={viewsResponsive}
                onChangeIndex={index => setViewsResponsive(index)}
              >
                {
                  (
                    <div
                      className={styles.tournamentTablesContainerResponsive}
                      style={{
                        paddingLeft: showPositionsPanel ? '0' : '20px'
                      }}
                    >
                      {viewsResponsive === 0 && (
                        <>
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
                                <EmojiEvents
                                  sx={{ fontSize: '50px', color: '#ffffff' }}
                                />
                              )}
                              {/* texts */}
                              {tournamentData.status === 'inactive' && (
                                <Typography color="secondary">
                                  El torneo esta inactivo, debe activarlo para
                                  poder continuar
                                </Typography>
                              )}
                              {tournamentData.status === 'paused' && (
                                <Typography color="secondary">
                                  Torneo en pausa
                                </Typography>
                              )}
                              {tournamentData.status === 'finished' && (
                                <Typography
                                  sx={{ mt: 2, mb: 2 }}
                                  color="secondary"
                                >
                                  El torneo ha finalizado
                                </Typography>
                              )}
                              {tournamentData.status === 'finished' && (
                                <Link href={"/admin/tournaments/final-results/" + tournamentId}>
                                  <Button
                                    variant="contained"
                                    color="secondary"
                                    className={styles.buttonGood}
                                  >
                                    Ver estadisticas
                                  </Button>
                                </Link>
                              )}
                            </div>
                          )}
                          {tournamentData.status !== 'finished' && (
                            <>
                              <div className={styles.tableComponentsContainer}>
                                {tournamentData.tables.tables.map(
                                  (table: any, index) => {
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
                                        setOpenChangePlayerTablePositions={() =>
                                          setOpenChangePlayerTablePositions(
                                            table.tableId
                                          )
                                        }
                                      />
                                    );
                                  }
                                )}
                              </div>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  ) as any
                }
                {
                  (
                    <div className={styles.tournamentPositionsTableResponsive}>
                      {viewsResponsive === 1 && (
                        <PositionsTable
                          calculateTablePositions={
                            tournamentAPI.calculateTablePositions
                          }
                        />
                      )}
                    </div>
                  ) as any
                }
              </SwipeableViews>
            </div>
          </>
        </>
      ) : (
        'Error'
      )}
      {tournamentData && openUpdateResults && (
        <UpdateResultsModal
          open={openUpdateResults}
          tournament={tournamentData as TournamentInterface}
          handleClose={() => setOpenUpdateResults('')}
        />
      )}
      {tournamentData && openChangePlayerTablePositions && (
        <ChangePlayerTablePositionsModal
          open={openChangePlayerTablePositions}
          tournament={tournamentData as TournamentInterface}
          handleClose={() => setOpenChangePlayerTablePositions('')}
        />
      )}
    </section>
  );
};

export default TournamentPage;
