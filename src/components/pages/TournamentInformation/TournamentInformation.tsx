'use client'
import React, { useEffect, useState } from 'react'
import { TournamentReducerInitialState, tournamentFinishFunction, tournamentUpdateFunction } from '@/redux/reducers/tournament/actions'
import { Button, CircularProgress, Typography } from '@mui/material';
import { TablePlayers } from '@/typesDefs/constants/tournaments/types';
import Modal from '@/components/Modal/Modal';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import useFirebaseContext from '@/contexts/firebaseConnection/hook';
import { PositionTable } from '@/components/TournamentTables/PositionTable/PositionTable';
import { MatchesTable } from '@/components/TournamentTables/MatchesTable/MatchesTable';
import style from './TournamentInformation.module.scss';
import { emptyTournamentinitialState } from '@/typesDefs/constants/tournaments/emptyTournamentInitialState';
import { tournamentGetById } from '@/redux/reducers/tournamentsList/actions';
import { ResultsTable } from '@/components/TournamentTables/ResultsTable/ResultsTable';

const TournamentInformation = ({ tournamentId }: { tournamentId: string }) => {
    const dispatch = useAppDispatch();
    const fbContext = useFirebaseContext();
    const [modal, setModal] = useState<boolean>(false);

    const [tournament, setTournament] = useState(emptyTournamentinitialState)
    const [matches, setMatches] = useState<TablePlayers[][]>([])
    const [tableToSort, setTableToSort] = useState(emptyTournamentinitialState.table[0].standings)
    const [round, setRound] = useState(-1)
    const { loading } = useAppSelector(({ tournamentList }) => tournamentList)
    const loadingUpdateTournament = useAppSelector(state => state.tournament.loading)

    const tournamentData = useAppSelector(state => state.tournamentList.data[0]);

    useEffect(() => {
        dispatch(tournamentGetById({
            context: fbContext,
            id: tournamentId
        }))
    }, [/**SuccessUpdateTournament */loadingUpdateTournament]);
    useEffect(() => {
        if (tournamentData) {
            const array = tournamentData.table[round == -1 ? tournament.currentRound - 1 : round].standings.slice()
            const tableToSortArray = array.sort((a, b) => {
                // Ordenar por victorias
                if (a.won !== b.won) {
                    return b.won - a.won;
                } else if (a.difference !== b.difference) {
                    return b.difference - a.difference;
                } else {
                    // Si la diferencia es igual, ordenar por puntos
                    return b.points - a.points;
                }

            })
            const matchesArray = []

            for (let i = 0; i < tableToSortArray.length;) {
                const element = [tableToSortArray[i], tableToSortArray[i + 1 ? i + 1 : i]];
                i = i + 2;
                matchesArray.push(element)
            }

            setTableToSort(tableToSortArray)
            setMatches(matchesArray)
            setTournament(tournamentData)
        }
    }, [tournamentData, round])

    const handleFinishTournament = () => {
        console.log(tournament.table)
        // dispatch(tournamentFinishFunction({
        //     context: fbContext,
        //     winnerId: tournament.table
        // }))
    }

    const isTournamentFinish = (tournament.currentRound > 5) && (tableToSort[0].points !== tableToSort[1].points); // pendiente por acomodar

    return (
        <section className={style.TournamentInformation}>
            {loading && (
                <div className={style.loader}>
                    <CircularProgress size={50} color="secondary" />
                    <Typography color="secondary" className={style.loaderText}>
                        Cargando Torneo
                    </Typography>
                </div>
            )}

            {!loading && tournamentData &&
                <>
                    <div className={style.TournamentInformationHeader}>
                        <Typography variant="h2" color="secondary">{tournament.name}</Typography>
                        <Typography variant="h6" color="secondary">({tournament.game})</Typography>
                    </div>
                    {isTournamentFinish
                        && <Typography variant="h6">Ganador: {tableToSort[0].team[0].name}</Typography>}
                    <Typography color="secondary" variant="h6">Formato del torneo: {tournament.format}</Typography>
                    <Typography color="secondary" variant="h6">Fecha de inicio: {tournament.startDate}</Typography>
                    <Typography color="secondary" variant="h6">Rondas jugadas: {round == -1 ? tournament.currentRound : round + 1}</Typography>
                    <div className={style.roundsButtons}>
                        <div className={style.buttons}>
                            {tournamentData.table.map((tab, index) => {
                                return (
                                    <div className={style.button}
                                        onClick={() => setRound(index)} >
                                        <Typography>Ronda {index + 1}</Typography>
                                    </div>
                                )
                            })}
                        </div>
                        <div className={style.buttonsActions}>
                            <Button disableElevation variant="contained"
                                onClick={handleFinishTournament}
                                className={"style.TournamentFormButton"}
                                sx={{ background: 'red', marginRight: '10px' }}
                            >
                                Terminar torneo
                            </Button>
                            <Button disableElevation variant="contained" color="primary"
                                onClick={() => setRound(round >= tournament.currentRound ? 1 : round + 1)}
                                className={"style.TournamentFormButton"}>
                                Cambiar ronda
                            </Button>
                        </div>
                    </div>
                    <div className={style.tournamentInformationTableContainer}>
                        <div className={style.TournamentInformationTable}>
                            <Typography color="secondary" variant="h6">Tabla de Posiciones</Typography>
                            <PositionTable data={tableToSort} />
                        </div>
                        <div className={style.vsContainer}>
                            <Typography color="secondary" variant="h6">Enfrentamientos</Typography>
                            <MatchesTable data={matches} />
                            {(round + 1 === tournament.currentRound || round === -1) && <Button
                                fullWidth
                                disableElevation
                                variant="contained"
                                color="primary"
                                onClick={() => setModal(true)}
                                className={"style.TournamentFormButton"}
                            >
                                Registrar resultados
                            </Button>}
                        </div>
                        {tournamentData.table[round == -1 ? tournament.currentRound - 1 : round].results.length > 0 && <div className={style.vsContainer}>
                            <Typography color="secondary" variant="h6">Resultados de la ronda anterior</Typography>
                            <ResultsTable data={tournamentData.table[round == -1 ? tournament.currentRound - 1 : round].results} />
                        </div>}
                    </div>
                    {modal && <Modal setModal={() => setModal(false)} format="matches" matchesData={matches} />}
                </>
            }
        </section>
    )
}

export { TournamentInformation }