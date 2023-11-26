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
import { IconButton, Link, Menu, MenuItem, Skeleton, Stack } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { TournamentReducerInitialState } from '@/redux/reducers/tournament/actions';
import style from './TournamentsList.module.scss';


//Componente de menu para la list
export default function ActionsMenu({ tournament }: { tournament: TournamentReducerInitialState }) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <div>
            <IconButton
                aria-label="more"
                id="long-button"
                aria-controls={open ? 'long-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleClick}
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <MenuItem onClick={handleClose}>
                    <Link href={`/tournaments/${tournament.id}`} underline="none" color={"inherit"}>Informacion</Link>
                </MenuItem>
                {/* <MenuItem onClick={handleClose}>Editar</MenuItem> */}
                {/* <MenuItem onClick={handleClose}>Terminar Torneo</MenuItem> */}
            </Menu>
        </div>
    );
}

const TournamentsList = () => {

    const TournamentList = useAppSelector(state => state.tournamentList.data);
    const [loading, setLoading] = useState<boolean>(true);

    const dispatch = useAppDispatch();
    const fbContext = useFirebaseContext();

    useEffect(() => {
        dispatch(getTournamentsList({
            context: fbContext,
        })).then(() => setLoading(false));
    }, []);

    return (
        <div>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Torneo</TableCell>
                            <TableCell align="right">Estado</TableCell>
                            <TableCell align="right">Participantes</TableCell>
                            <TableCell align="right">Rondas</TableCell>
                            <TableCell align="right">Fecha</TableCell>
                            <TableCell align="right">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {TournamentList.map((tournament) => (
                            <TableRow
                                key={tournament.name}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                className={style.TournamentListRow}
                            >
                                <TableCell component="th" scope="row">
                                    {tournament.name}
                                </TableCell>
                                <TableCell align="right">
                                    {tournament.currentRound > 5 ? "Terminado" : "En curso..."}
                                </TableCell>
                                <TableCell align="right">{tournament.table.length}</TableCell>
                                <TableCell align="right">{tournament.currentRound}</TableCell>
                                <TableCell align="right">{tournament.startDate}</TableCell>
                                <TableCell align="right">
                                    <ActionsMenu tournament={tournament} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export { TournamentsList }

