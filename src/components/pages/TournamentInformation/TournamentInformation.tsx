'use client'
import React from 'react'
import { TournamentReducerInitialState } from '@/redux/reducers/tournament/actions'
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

const TournamentInformation = ({ tournament }: { tournament: TournamentReducerInitialState }) => {

    if (tournament) {
        const matches: TablePlayers[][] = [];
        for (let i = 0; i < tournament.table.length;) {
            const element = [tournament.table[i], tournament.table[i + 1 ? i + 1 : i]];
            i = i + 2;
            matches.push(element);
        }
        return (
            <section className={style.TournamentInformation}>
                <div className={style.TournamentInformationHeader}>
                    <Typography variant="h2">{tournament.name}</Typography>
                    <Typography variant="h6">({tournament.game})</Typography>
                </div>
                <Typography variant="h6">Formato del torneo: {tournament.format}</Typography>
                <Typography variant="h6">Fecha de inicio: {tournament.startDate}</Typography>
                <Typography variant="h6">Rondas jugadas: {tournament.currentRound}</Typography>
                <div>
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
                                {tournament.table.map((team, index) => (
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
                <div>
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
                                        <TableCell align="center">{match[1]?.team[0].name ? match[1].team[0].name : "Sin rival"}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Button fullWidth disableElevation variant="contained" color="primary"
                        className={"style.TournamentFormButton"}>
                        Registrar resultados
                    </Button>
                </div>
            </section>
        )
    } else {
        return <h2> Loading</h2>
    }
}

export { TournamentInformation }