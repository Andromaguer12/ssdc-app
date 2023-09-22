'use client'
import useFirebaseContext from '@/contexts/firebaseConnection/hook';
import { getTournamentsList } from '@/redux/reducers/tournamentsList/actions';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import React, { useEffect, useState } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const TournamentsList = () => {

    const TournamentList = useAppSelector(state => state.tournamentList.data);
    const [loading, setLoading] = useState<boolean>(true);

    const dispatch = useAppDispatch();
    const fbContext = useFirebaseContext();

    useEffect(() => {
        dispatch(getTournamentsList({
            context: fbContext,
        })).then(() => setLoading(false));
    }, [TournamentList]);

    if (!loading) {
        return (
            <section>
                
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Torneo</TableCell>
                                <TableCell align="right">Ganador</TableCell>
                                <TableCell align="right">Participantes</TableCell>
                                <TableCell align="right">Rondas</TableCell>
                                <TableCell align="right">Fecha</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {TournamentList.map((tournament) => (
                                <TableRow
                                    key={tournament.name}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {tournament.name}
                                    </TableCell>
                                    <TableCell align="right">{tournament.table[0].team[0].name}</TableCell>
                                    <TableCell align="right">{tournament.table.length}</TableCell>
                                    <TableCell align="right">{tournament.currentRound}</TableCell>
                                    <TableCell align="right">{tournament.startDate}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </section>
        )
    } else return (
        <h2>LOADING</h2>
    )
}

// Se necesita mejorar esta lista de torneos, la logica que ordenamiento de posicion es logica de cada uno de los torneos

export { TournamentsList }

