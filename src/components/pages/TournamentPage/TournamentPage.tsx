"use client"
import styles from './styles/TournamentPage.module.scss';
import { CircularProgress, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { useEffect, useState } from 'react';
import { getTournamentById } from '@/redux/reducers/tournaments/actions';
import useFetchingContext from '@/contexts/backendConection/hook';
import ReactTable from '@/components/ReactTable/ReactTable';
import { Warning } from '@mui/icons-material';
import useTournamentData from '@/hooks/useTournamentData/useTournamentData';
import TableComponent from './components/TableComponent';
import UpdateResultsModal from './components/UpdateResultsModal';
import { TournamentInterface } from '@/typesDefs/constants/tournaments/types';
interface TournamentPageProps {
  tournamentId: string
}

const TournamentPage: React.FC<TournamentPageProps> = ({
  tournamentId
}) => {
  const dispatch = useAppDispatch();
  const fContext = useFetchingContext();
  const { tournamentData, errorDocument: errorGetTournamentById } = useTournamentData(tournamentId)
  const [openUpdateResults, setOpenUpdateResults] = useState("")

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
                    <div className={styles.tournamentTablesContainer}>
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