import { TablePlayers } from '@/typesDefs/constants/tournaments/types';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import Paper from '@mui/material/Paper';

const PositionTable = ({ data }: { data: TablePlayers[] }) => {
    return (
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
                    {data.map((team, index) => (
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
    )
}

export { PositionTable }