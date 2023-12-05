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
import { FinishedTournamentResumeCard } from '@/components/FinishedTournamentResumeCard/FinishedTournamentResumeCard';

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
        console.log(loadingUpdateTournament, 'loading')
    }, [round]);
    useEffect(() => {
        if (tournamentData) {
            console.log(tournament.winner)
            console.log(tournamentData.currentRound)
            console.log(tournamentData.table[round == -1 ? tournamentData.currentRound - 1 : round].standings)
            const array = tournamentData.table[round == -1 ? tournamentData.currentRound - 1 : round].standings.slice()
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

            setRound(tournamentData.currentRound - 1)
            setTableToSort(tableToSortArray)
            setMatches(matchesArray)
            setTournament(tournamentData)
            //setRound(tournamentData.table && tournamentData.table.length > 0 ? tournamentData.table.length - 1 : 0)
            console.log('PRUEBA PARA HACER PUSH')
            console.log(tableToSort)
            if ((tournamentData.currentRound > 6) && (tableToSortArray[0].won !== tableToSortArray[1].won) && !tournamentData.winner) {
                console.log('hp;a')
                dispatch(tournamentUpdateFunction({
                    context: fbContext,
                    payload: {
                        ...tournamentData,
                        winner: tableToSortArray[0].team[0]
                    },
                    tournament: tournamentData
                }))
                dispatch(tournamentGetById({
                    context: fbContext,
                    id: tournamentId
                }))
            }
        }
    }, [tournamentData])

    const handleFinishTournament = () => {

        dispatch(tournamentUpdateFunction({
            context: fbContext,
            payload: {
                ...tournamentData,
                winner: tableToSort[0].team[0]
            },
            tournament: tournamentData
        }))
    }

    const handleReloadData = () => {
        dispatch(tournamentGetById({
            context: fbContext,
            id: tournamentId
        }))
    }

    //const showWinnerCard = tournament.format === 'individual' ? tournament.table.length === 6 : false

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
                    <div className={style.titleAndRound}>
                        <div className={style.TournamentInformationHeader}>
                            <Typography variant="h2" color="secondary">{tournament.name}</Typography>
                            <Typography variant="h6" color="secondary">({tournament.game})</Typography>
                        </div>
                        <div className={style.TournamentInformationHeader}>
                            <Typography variant="h4" color="secondary">Ronda actual: {round < 0 ? 1 : round + 1}</Typography>
                        </div>
                    </div>
                    {tournament.winner
                        && <Typography variant="h3" color="secondary">Ganador: {tournament.winner.name}</Typography>}
                    <Typography color="secondary" variant="h6">Formato del torneo: {tournament.format}</Typography>
                    <Typography color="secondary" variant="h6">Fecha de inicio: {tournament.startDate}</Typography>
                    <Typography color="secondary" variant="h6">Rondas jugadas: {tournament.table.length ? tournament.table.length - 1 : 0}</Typography>
                    {tournament.winner && <FinishedTournamentResumeCard data={tableToSort.slice(0, 5)} />}
                    {!tournament.winner && <>
                        <div className={style.roundsButtons}>
                            <div className={style.buttons}>
                                {tournamentData.table.map((tab, index) => {
                                    return (
                                        <div className={index == round ? style.button__selectedButton : style.button}
                                            onClick={() => setRound(index)} >
                                            <Typography>Ronda {index + 1}</Typography>
                                        </div>
                                    )
                                })}
                            </div>
                            <div className={style.buttonsActions}>
                                {/* <Button disableElevation variant="contained"
                                    onClick={handleFinishTournament}
                                    className={"style.TournamentFormButton"}
                                    sx={{ background: 'red', marginRight: '10px' }}
                                >
                                    Terminar torneo
                                </Button> */}
                                {/* <Button disableElevation variant="contained" color="primary"
                                    onClick={() => setRound(round >= tournament.currentRound ? 1 : round + 1)}
                                    className={"style.TournamentFormButton"}>
                                    Cambiar ronda
                                </Button> */}
                            </div>
                        </div>
                        <div className={style.tournamentInformationTableContainer}>
                            <div className={style.TournamentInformationTable}>
                                <Typography color="secondary" variant="h6">Tabla de Posiciones</Typography>
                                <PositionTable data={tableToSort} />
                            </div>
                            <div className={style.vsContainerAndPreviousResults}>
                                <div className={style.vsContainer}>
                                    <Typography color="secondary" variant="h6">Enfrentamientos</Typography>
                                    <MatchesTable data={matches} />
                                    {((round + 1 === tournament.currentRound || round === -1) && !tournament.winner) && <Button
                                        fullWidth
                                        disableElevation
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => setModal(true)}
                                        sx={{ fontWeight: 'bold' }}
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
                        </div>
                        {modal && <Modal setModal={() => setModal(false)} handleReloadData={handleReloadData} format="matches" matchesData={matches} />}
                    </>}
                </>
            }
        </section>
    )
}

export { TournamentInformation }