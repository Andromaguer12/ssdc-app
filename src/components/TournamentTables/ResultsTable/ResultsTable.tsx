import { ResultsFormat } from '@/typesDefs/constants/tournaments/types';
import { Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material'
import Paper from '@mui/material/Paper';

const ResultsTable = ({ data }: { data: ResultsFormat[] }) => {
    // left player or group will be the color darkblue
    // right player or group will be the color orange

    return (
        <TableContainer sx={{ marginBottom: '20px' }} component={Paper}>
            <Table aria-label="simple table">
                <TableBody>
                    {data.map((match, index) => (
                        <TableRow
                            key={index}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 }, background: index % 2 == 0 ? '#fff' : '#e7e7e7' }}
                        >
                            <TableCell align="center" sx={{ fontWeight: 'bold', color: 'darkblue'}}>{match.winner.team[0].name ?? 'Sin nombre'}</TableCell>
                            <TableCell align="center" sx={{ fontSize: '20px', color: 'darkblue'}}>{match.result[1]}</TableCell>
                            <TableCell align="center">VS</TableCell>
                            <TableCell align="center" sx={{ fontSize: '20px', color: 'orange'}}>{match.result[0]}</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold', color: 'orange'}}>{match.loser?.team[0].name}   </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export { ResultsTable }