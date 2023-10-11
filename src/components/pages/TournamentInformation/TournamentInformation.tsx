'use client'
import React, { useEffect, useState } from 'react'
import { TournamentReducerInitialState, tournamentUpdateFunction } from '@/redux/reducers/tournament/actions'
import { Button, Typography } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import style from './TournamentInformation.module.scss';
import { TablePlayers } from '@/typesDefs/constants/tournaments/types';
import Modal from '@/components/Modal/Modal';
import { useAppDispatch } from '@/redux/store';
import useFirebaseContext from '@/contexts/firebaseConnection/hook';

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

        return (
            <section className={style.TournamentInformation}>
                <div className={style.TournamentInformationHeader}>
                    <Typography variant="h2">{tournament.name}</Typography>
                    <Typography variant="h6">({tournament.game})</Typography>
                </div>
                {tournament.currentRound > 5
                    && <Typography variant="h6">Ganador: {tableToSort[0].team[0].name}</Typography>}
                <Typography variant="h6">Formato del torneo: {tournament.format}</Typography>
                <Typography variant="h6">Fecha de inicio: {tournament.startDate}</Typography>
                <Typography variant="h6">Rondas jugadas: {tournament.currentRound - 1}</Typography>
                <div className={style.TournamentInformationTable}>
                    <Typography variant="h4">Tabla de Posiciones</Typography>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">Posicion</TableCell>
                                    <TableCell align="center">Nombre</TableCell>
                                    <TableCell align="center">Puntos</TableCell>
                                    <TableCell align="center">Victorias</TableCell>
                                    <TableCell align="center">Derrotas</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {tableToSort.map((team, index) => (
                                    <TableRow
                                        key={index}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell align="center">{index + 1}</TableCell>
                                        <TableCell component="th" scope="row" align="center">
                                            {team.team.map(user => user.name).toString()}
                                        </TableCell>
                                        <TableCell align="center">{team.points}</TableCell>
                                        <TableCell align="center">{team.won}</TableCell>
                                        <TableCell align="center">{team.lost}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
                {tournament.currentRound <= 5
                    && <div>
                        <Typography variant="h4">Enfrentamientos</Typography>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableBody>
                                    {matches.map((match, index) => (
                                        <TableRow
                                            key={index}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell align="center">{match[0].team[0].name}</TableCell>
                                            <TableCell align="center">VS</TableCell>
                                            <TableCell align="center">{match[1]?.team[0].name
                                                ? match[1].team[0].name
                                                : "Sin rival"}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
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