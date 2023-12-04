import { TablePlayers } from '@/typesDefs/constants/tournaments/types';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import Paper from '@mui/material/Paper';

const FinishedTournamentResumeCard = ({ data }
    : { data: TablePlayers[], tournamentId?: string, standingIndex?: number }) => {


    return (
        <section>
            <Typography variant="h3">Resumen del torneo (TOP 5)</Typography>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow sx={{ background: '#003994' }}>
                            <TableCell sx={{ color: '#fff' }} align="center">Posicion</TableCell>
                            <TableCell sx={{ color: '#fff' }} align="center">Nombre</TableCell>
                            <TableCell sx={{ color: '#fff' }} align="center">Victorias</TableCell>
                            <TableCell sx={{ color: '#fff' }} align="center">Derrotas</TableCell>
                            <TableCell sx={{ color: '#fff' }} align="center">Efectividad</TableCell>
                            <TableCell sx={{ color: '#fff' }} align="center">Puntos</TableCell>
                            <TableCell sx={{ color: '#fff' }} align="center">Puntos por partida</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((team, index) => (
                            <TableRow
                                key={index}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 }, background: index % 2 == 0 ? '#fff' : '#e7e7e7' }}
                            >
                                <TableCell align="center">{index + 1}</TableCell>
                                <TableCell component="th" scope="row" align="center" sx={{ fontSize: '18px' }}>
                                    {team.team.map(user => user.name).toString()}
                                </TableCell>
                                <TableCell align="center" sx={{ color: 'darkblue', fontWeight: 'bold' }}>{team.won}</TableCell>
                                <TableCell align="center" sx={{ color: 'orange', fontWeight: 'bold' }}>{team.lost}</TableCell>
                                <TableCell align="center" sx={{ color: team.difference > 0 ? 'green' : 'red', fontWeight: 'bold' }}>{team.difference > 0 ? '+' : ''}{team.difference}</TableCell>
                                <TableCell align="center" sx={{ color: 'blue', fontWeight: 'bold' }}>{team.points}</TableCell>
                                <TableCell sx={{ color: '#4f4f4f' }} align="center">{team.points / team.playedRounds}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

            </TableContainer>
        </section>
    )
}

export { FinishedTournamentResumeCard }