import { ResultsFormat } from '@/typesDefs/constants/tournaments/types';
import { Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material'
import Paper from '@mui/material/Paper';

const ResultsTable = ({ data }: { data: ResultsFormat[] }) => {

    return (
        <TableContainer sx={{ marginBottom: '20px' }} component={Paper}>
            <Table aria-label="simple table">
                <TableBody>
                    {data.map((match, index) => (
                        <TableRow
                            key={index}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell align="center">{match.winner.team[0].name ?? 'Sin nombre'}</TableCell>
                            <TableCell align="center">{match.result[1]}</TableCell>
                            <TableCell align="center">VS</TableCell>
                            <TableCell align="center">{match.result[0]}</TableCell>
                            <TableCell align="center">{match.loser?.team[0].name}   </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export { ResultsTable }