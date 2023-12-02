import { TablePlayers } from '@/typesDefs/constants/tournaments/types';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import Paper from '@mui/material/Paper';

const MatchesTable = ({ data }: { data: TablePlayers[][] }) => {
    // left player or group will be the color darkblue
    // right player or group will be the color orange

    return (
        <TableContainer sx={{ marginBottom: '20px'}} component={Paper}>
            <Table aria-label="simple table">
                <TableBody>
                    {data.map((match, index) => (
                        <TableRow
                            key={index}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 }, background: index % 2 == 0 ? '#fff' : '#e7e7e7' }}
                        >
                            <TableCell align="center" sx={{ color: 'darkblue', fontWeight: 'bold' }}>{match[0].team[0].name ?? 'Sin nombre'}</TableCell>
                            <TableCell align="center">VS</TableCell>
                            <TableCell align="center" sx={{ color: 'orange', fontWeight: 'bold' }}>{match[1]?.team[0].name
                                ? match[1].team[0].name
                                : "Sin rival"}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export { MatchesTable }