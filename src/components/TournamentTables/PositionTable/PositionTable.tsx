import { TablePlayers } from '@/typesDefs/constants/tournaments/types';
import { IconButton, Menu, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import Paper from '@mui/material/Paper';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useState } from 'react';
import Modal from '@/components/Modal/Modal';

//Componente de menu para la list
export default function ActionsPlayerMenu({ setModal }: { setModal: (boolean: boolean) => void }) {
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
                <MenuItem onClick={() => {
                    handleClose();
                    setModal(true);
                }}>Sancionar jugador</MenuItem>
                <MenuItem onClick={handleClose}>Eliminar jugador</MenuItem>
            </Menu>
        </div>
    );
}

const PositionTable = ({ data }: { data: TablePlayers[] }) => {
    const [modal, setModal] = useState<boolean>(false);

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell align="center">Posicion</TableCell>
                        <TableCell align="center">Nombre</TableCell>
                        <TableCell align="center">Puntos</TableCell>
                        <TableCell align="center">Derrotas</TableCell>
                        <TableCell align="center">Sancion</TableCell>
                        <TableCell align="center"></TableCell>
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
                            <TableCell align="center">{team.lost}</TableCell>
                            <TableCell align="center">{team.sanction ? team.sanction : ''}</TableCell>
                            <TableCell align="center">
                                <ActionsPlayerMenu setModal={setModal} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {modal && <Modal setModal={() => setModal(false)} format="sanction" />}
        </TableContainer>
    )
}

export { PositionTable }