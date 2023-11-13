'use client'
import React, { useEffect, useState } from 'react'
import { TournamentReducerInitialState, tournamentUpdateFunction } from '@/redux/reducers/tournament/actions'
import { Button, Typography } from '@mui/material';
import { TablePlayers } from '@/typesDefs/constants/tournaments/types';
import Modal from '@/components/Modal/Modal';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import useFirebaseContext from '@/contexts/firebaseConnection/hook';
import { PositionTable } from '@/components/TournamentTables/PositionTable/PositionTable';
import { MatchesTable } from '@/components/TournamentTables/MatchesTable/MatchesTable';
import style from './TournamentInformation.module.scss';

const TournamentInformation = () => {
    const dispatch = useAppDispatch();
    const fbContext = useFirebaseContext();
    const [modal, setModal] = useState<boolean>(false);
    const { data: tournaments, loading } = useAppSelector(state => state.tournamentList);
    const [currentTournament, setCurrentTournament] = useState<TournamentReducerInitialState | null>(null)
    const [rounds, setRounds] = useState<TournamentReducerInitialState[] | []>([])

    const tableToSortCurrent = [...(currentTournament?.table ?? [])];
    tableToSortCurrent.sort((a, b) => b.points - a.points);
        const matches: TablePlayers[][] = [];
        for (let i = 0; i < tableToSortCurrent.length;) {
            const element = [tableToSortCurrent[i], tableToSortCurrent[i + 1 ? i + 1 : i]];
            i = i + 2;
            matches.push(element);
        }

        useEffect(() => {
            if (tournaments && tournaments[0]?.length > 0) {
                setCurrentTournament(tournaments[0][tournaments[0].length-1] as TournamentReducerInitialState)
                setRounds(tournaments[0] as unknown as TournamentReducerInitialState[])
            }
          }, [tournaments])

        //Pendiente por terminar
        /* if( currentTournament?.currentRound > 5) {
             dispatch(tournamentUpdateFunction({
                 context: fbContext,
                 payload: {},
                 tournament: tournament
             }))
         } */

        const isTournamentFinish = (currentTournament?.currentRound > 5) && (tableToSort[0].points !== tableToSort[1].points);

        return (
            <section className={style.TournamentInformation}>
                {!loading && (
                    <>
                        <div className={style.TournamentInformationHeader}>
                            <Typography variant="h2">{currentTournament?.name}</Typography>
                            <Typography variant="h6">({currentTournament?.game})</Typography>
                        </div>
                        {isTournamentFinish
                            && <Typography variant="h6">Ganador: {tableToSort[0].team[0].name}</Typography>}
                        <Typography variant="h6">Formato del torneo: {currentTournament?.format}</Typography>
                        <Typography variant="h6">Fecha de inicio: {currentTournament?.startDate}</Typography>
                        <Typography variant="h6">Rondas jugadas: {((currentTournament?.currentRound ?? 1) - 1) ?? 0}</Typography>
                        <div className={style.TournamentInformationTable}>
                            <Typography variant="h3" sx={{ width: "100%" }} fontStyle={'bold'}  align='center'>Tabla de Posiciones</Typography>
                            {
                                rounds.map((round: TournamentReducerInitialState, index: number) => {
                                    let tableToSort = [...(round?.table ?? [])];
                                    tableToSort.sort((a, b) => b.points - a.points);
                                    
                                    return (
                                        <>
                                            <Typography variant="h4" sx={{ margin: '30px 0'}}>Ronda {round.currentRound}</Typography>
                                            <PositionTable data={tableToSort} />
                                        </>
                                    )
                                })
                            }
                        </div>
                        {!isTournamentFinish
                            && <div>
                                <Typography variant="h4">Enfrentamientos</Typography>
                                <MatchesTable data={matches} />
                                <Button fullWidth disableElevation variant="contained" color="primary"
                                    onClick={() => setModal(true)}
                                    className={"style.TournamentFormButton"}>
                                    Registrar resultados
                                </Button>
                            </div>}
                        {modal && <Modal setModal={() => setModal(false)} format="matches" matchesData={matches} />}
                    </>
                )}
            </section>
        )
}

export { TournamentInformation }