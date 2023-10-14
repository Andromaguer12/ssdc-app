import { TablePlayers } from '@/typesDefs/constants/tournaments/types';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import Paper from '@mui/material/Paper';

const MatchesTable = ({ data }: { data: TablePlayers[][] }) => {
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableBody>
                    {data.map((match, index) => (
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
    )
}

export { MatchesTable }