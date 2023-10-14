'use client'
import React, { useEffect, useState } from 'react'
import { TournamentReducerInitialState, tournamentUpdateFunction } from '@/redux/reducers/tournament/actions'
import { Button, Typography } from '@mui/material';
import { TablePlayers } from '@/typesDefs/constants/tournaments/types';
import Modal from '@/components/Modal/Modal';
import { useAppDispatch } from '@/redux/store';
import useFirebaseContext from '@/contexts/firebaseConnection/hook';
import { PositionTable } from '@/components/TournamentTables/PositionTable/PositionTable';
import { MatchesTable } from '@/components/TournamentTables/MatchesTable/MatchesTable';
import style from './TournamentInformation.module.scss';

const TournamentInformation = ({ tournament }: { tournament: TournamentReducerInitialState }) => {
    const dispatch = useAppDispatch();
    const fbContext = useFirebaseContext();
    const [modal, setModal] = useState<boolean>(false);

    if (tournament) {
        const tableToSort = [...tournament.table];
        tableToSort.sort((a, b) => b.points - a.points);
        const matches: TablePlayers[][] = [];
        for (let i = 0; i < tableToSort.length;) {
            const element = [tableToSort[i], tableToSort[i + 1 ? i + 1 : i]];
            i = i + 2;
            matches.push(element);
        }

        //Pendiente por terminar
        /* if( tournament.currentRound > 5) {
             dispatch(tournamentUpdateFunction({
                 context: fbContext,
                 payload: {},
                 tournament: tournament
             }))
         } */

        const isTournamentFinish = (tournament.currentRound > 5) && (tableToSort[0].points !== tableToSort[1].points);

        return (
            <section className={style.TournamentInformation}>
                <div className={style.TournamentInformationHeader}>
                    <Typography variant="h2">{tournament.name}</Typography>
                    <Typography variant="h6">({tournament.game})</Typography>
                </div>
                {isTournamentFinish
                    && <Typography variant="h6">Ganador: {tableToSort[0].team[0].name}</Typography>}
                <Typography variant="h6">Formato del torneo: {tournament.format}</Typography>
                <Typography variant="h6">Fecha de inicio: {tournament.startDate}</Typography>
                <Typography variant="h6">Rondas jugadas: {tournament.currentRound - 1}</Typography>
                <div className={style.TournamentInformationTable}>
                    <Typography variant="h4">Tabla de Posiciones</Typography>
                    <PositionTable data={tableToSort} />
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
            </section>
        )
    } else {
        return <h2> Loading</h2>
    }
}

export { TournamentInformation }