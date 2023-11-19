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
import { emptyTournamentinitialState } from '@/typesDefs/constants/tournaments/emptyTournamentInitialState';
import { tournamentGetById } from '@/redux/reducers/tournamentsList/actions';

const TournamentInformation = ({ tournamentId }: { tournamentId: string }) => {
    const dispatch = useAppDispatch();
    const fbContext = useFirebaseContext();
    const [modal, setModal] = useState<boolean>(false);

    const [tournament, setTournament] = useState(emptyTournamentinitialState)
    const [matches, setMatches] = useState<TablePlayers[][]>([])
    const [tableToSort, setTableToSort] = useState(emptyTournamentinitialState.table[0].standings)
    const [loading, setLoading] = useState(true)
    const [round, setRound] = useState(1)

    const tournamentData = useAppSelector(state => state.tournamentList.data[0]);

    useEffect(() => {
        dispatch(tournamentGetById({
            context: fbContext,
            id: tournamentId
        }))
    }, []);
    useEffect(() => {
        if (tournamentData) {
            const array = tournamentData.table[tournament.currentRound - round].standings.slice()
            setTournament(tournamentData)
            setLoading(false)
            setTableToSort(array.sort((a, b) => b.points - a.points))
            for (let i = 0; i < tableToSort.length;) {
                const element = [tableToSort[i], tableToSort[i + 1 ? i + 1 : i]];
                i = i + 2;
                setMatches([...matches, element])
            }
        }
    }, [tournamentData, round])


    if (!loading && tournamentData) {

        /*console.log(tournament, 'xddd')
        const array = tournament.table[tournament.currentRound - 1].standings.slice()
        console.log(array, 'eee')
    
        const tableToSort = array.sort((a, b) => b.points - a.points);
        const matches: TablePlayers[][] = [];
        for (let i = 0; i < tableToSort.length;) {
            const element = [tableToSort[i], tableToSort[i + 1 ? i + 1 : i]];
            i = i + 2;
            matches.push(element);
        } */
        //Pendiente por terminar
        /* if( tournament.currentRound > 5) {
             dispatch(tournamentUpdateFunction({
                 context: fbContext,
                 payload: {},
                 tournament: tournament
             }))
         } */


        const isTournamentFinish = (tournament.currentRound > 5) && (tableToSort[0].points !== tableToSort[1].points); // pendiente por acomodar

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
                <Button fullWidth disableElevation variant="contained" color="primary"
                    onClick={() => setRound(round >= tournament.currentRound ? 1 : round + 1)}
                    className={"style.TournamentFormButton"}>
                    Cambiar ronda
                </Button>
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