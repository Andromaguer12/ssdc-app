"use client"
import styles from './styles/TournamentPage.module.scss';
import { CircularProgress, FormControl, FormControlLabel, FormGroup, InputLabel, MenuItem, Select, Switch, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { useEffect, useState } from 'react';
import { getTournamentById } from '@/redux/reducers/tournaments/actions';
import useFetchingContext from '@/contexts/backendConection/hook';
import ReactTable from '@/components/ReactTable/ReactTable';
import { SignalWifiStatusbarConnectedNoInternet4, Warning } from '@mui/icons-material';
import useTournamentData from '@/hooks/useTournamentData/useTournamentData';
import TableComponent from './components/TableComponent';
import UpdateResultsModal from './components/UpdateResultsModal';
import { TournamentInterface, TournamentState } from '@/typesDefs/constants/tournaments/types';
import PositionsTable from './components/PositionsTable';
interface TournamentPageProps {
  tournamentId: string
}

const TournamentPage: React.FC<TournamentPageProps> = ({
  tournamentId
}) => {
  const dispatch = useAppDispatch();
  const fContext = useFetchingContext();
  const { tournamentData, tournamentAPI, errorDocument: errorGetTournamentById } = useTournamentData(tournamentId)
  const [openUpdateResults, setOpenUpdateResults] = useState("")
  const [showPositionsPanel, setShowPositionsPanel] = useState(false)

  const {
    updateTournament: {
      loadingUpdateTournament,
    }
  } = useAppSelector(({ tournaments }) => tournaments)

  useEffect(() => {
    dispatch(getTournamentById({
      context: fContext,
      id: tournamentId
    }))
  }, [])

  return (
    <section className={styles.pageContainer}>
      {!tournamentData 
            ? <div className={styles.loading}>
                <CircularProgress style={{ color: "#fff" }} size={50} />
                <Typography variant="h6" color="secondary" style={{ marginTop: '20px' }}>Cargando...</Typography>
              </div>
            : errorGetTournamentById 
                ? (
                  <div className={styles.loading}>
                    <Warning style={{ color: "#7a7a7a", fontSize: 50 }} />
                    <Typography variant="h6" style={{ marginTop: '20px' }}>{errorGetTournamentById}</Typography>
                  </div>
                )
                : tournamentData
                ? (
                  <>
                    <div className={styles.header}>
                      <div className={styles.title}>
                        <Typography style={{ color: "#000", fontWeight: 'bold' }} variant="h5">{tournamentData.name}</Typography>
                      </div>
                      <Typography 
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
                      </Typography>
                      <Typography 
                        color="secondary"
                        fontWeight={"bold"}
                        variant="h6"
                      >
                        Estado: 
                        <Typography 
                          color="secondary"
                          fontWeight={"bold"} 
                          display={"flex"}
                          alignItems={'center'}
                          flexDirection={"row"}
                          variant="h4">
                            {tournamentData.status.toLocaleUpperCase()}
                            <div 
                              className={styles.dot} 
                              style={{ background: tournamentData.status === 'active' 
                                ? "green" 
                                : tournamentData.status === "paused"
                                  ? "yellow"
                                  : "#7a7a7a" 
                              }} 
                            />
                          </Typography>
                      </Typography>
                      <Typography 
                        color="secondary"
                        fontWeight={"bold"}
                        variant="h6"
                      >
                        Ronda: 
                        <Typography 
                          color="secondary"
                          fontWeight={"bold"} 
                          display={"flex"}
                          alignItems={'flex-end'}
                          flexDirection={"row"}
                          variant="h4">
                            {tournamentData.currentGlobalRound}{' '}
                            <Typography 
                              color="secondary"
                              fontWeight={"bold"}
                              variant="h6"
                            >
                              {' '} / {tournamentData.customRounds}
                            </Typography>
                          </Typography>
                      </Typography>
                      <Typography 
                        color="secondary"
                        fontWeight={"bold"}
                        variant="h6"
                      >
                        Formato: 
                        <Typography 
                          color="secondary"
                          fontWeight={"bold"} 
                          variant="h4">
                            {tournamentData.format.toLocaleUpperCase()}
                          </Typography>
                      </Typography>
                    </div>
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
                          <FormControl style={{ width: "150px" }}>
                            <InputLabel id="demo-simple-select-label">Status del torneo</InputLabel>
                            <Select
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              value={tournamentData.status}
                              label="Status del torneo"
                              size='small'
                              onChange={(e) => tournamentAPI.updateTournamentStatus(e.target.value as TournamentState)}
                            >
                              <MenuItem value={"active"}>
                                <Typography display="flex" flexDirection={"row"} alignItems={"center"}>
                                  Activo <div style={{ backgroundColor: "green"}} className={styles.dot} />
                                </Typography>
                              </MenuItem>
                              <MenuItem value={"inactive"}>
                                <Typography display="flex" flexDirection={"row"} alignItems={"center"}>
                                  Inactivo <div style={{ backgroundColor: "#7a7a7a"}} className={styles.dot} />
                                </Typography>
                              </MenuItem>
                              <MenuItem value={"paused"}>
                                <Typography display="flex" flexDirection={"row"} alignItems={"center"}>
                                  Pausado <div style={{ backgroundColor: "yellow"}} className={styles.dot} />
                                </Typography>
                              </MenuItem>
                            </Select>
                          </FormControl>
                          <FormGroup style={{ marginLeft: "10px"}}>
                            <FormControlLabel control={<Switch onClick={() => setShowPositionsPanel(!showPositionsPanel)} checked={showPositionsPanel} />} label="Mostrar panel de posiciones" />
                          </FormGroup>
                        </div>
                        <div className={styles.loader}>
                          {loadingUpdateTournament && <CircularProgress color="primary" size={25} />}
                        </div>
                      </div>
                    </div>
                    <div className={styles.tournamentTablesContainer} style={{ paddingLeft: showPositionsPanel ? "0" : "20px"}}>
                      {tournamentData.status !== "active" && <div className={styles.shadow}>
                        <div className={styles.message}>
                          {tournamentData.status === "paused" && <CircularProgress color='secondary' size={50} />}
                          {tournamentData.status === "inactive" && <SignalWifiStatusbarConnectedNoInternet4 sx={{ fontSize: "50px", color: "#ffffff" }} />}
                          <Typography color="secondary">
                            {
                              tournamentData.status === "inactive" 
                                ? "El torneo esta inactivo, debe activarlo para poder continuar"
                                : "Torneo en pausa"
                            }
                          </Typography>
                        </div>
                      </div>}
                      <div className={showPositionsPanel ? styles.tableComponentsContainer__asideActive : styles.tableComponentsContainer}>
                        {tournamentData.tables.tables.map((table: any, index) => {
                          return (
                            <TableComponent 
                              key={table.tableId} 
                              tableData={table}
                              thisTablePairs={table.thisTablePairs} 
                              tableNumber={index + 1}
                              showHUD={true}
                              setOpenUpdateResults={() => setOpenUpdateResults(table.tableId)}
                            />
                          )
                        })}
                      </div>
                      <div className={showPositionsPanel ? styles.asideContainer__active : styles.asideContainer}>
                        <PositionsTable 
                          tables={tournamentData.tables}
                        />
                      </div>
                    </div>
                  </>
                )
              : "Error"
          }
        {tournamentData && (
          <UpdateResultsModal 
            open={openUpdateResults}
            tournament={tournamentData as TournamentInterface}
            handleClose={() => setOpenUpdateResults(null)}
          />
        )}
    </section>
  )
}

export default TournamentPage