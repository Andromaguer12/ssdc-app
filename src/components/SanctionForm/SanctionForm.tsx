import { Button, ButtonGroup, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import GppBadIcon from '@mui/icons-material/GppBad';
import style from "./SanctoinForm.module.scss";
import { tournamentUpdateFunction } from '@/redux/reducers/tournament/actions';
import useFirebaseContext from '@/contexts/firebaseConnection/hook';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { UserReducerInitialState } from '@/redux/reducers/user/actions';



const SanctionForm = ({ user, format }: {
    user: UserReducerInitialState, format: string
}) => {
    const dispatch = useAppDispatch();
    const fbContext = useFirebaseContext();
    const tournaments = useAppSelector(state => state.tournamentList.data);
    const tournamentToUpdate = tournaments.filter(tournament => tournament.table.filter(team => team.team[0].id == user.id))[0]

    const [tournamentToSend, setTournamentToSend] = useState(tournamentToUpdate);

    /* useEffect(() => {
        dispatch(tournamentUpdateFunction({
            context: fbContext,
            payload: tournamentToSend,
            tournament: tournamentToUpdate
        }))
    }, [tournamentToSend]) */

    const handleClick = () => {
        dispatch(tournamentUpdateFunction({
            context: fbContext,
            payload: tournamentToSend,
            tournament: tournamentToUpdate
        }))
    };


    return (
        <form className={style.SanctionForm}>
            <GppBadIcon fontSize='large' color='primary' />
            <Typography variant='h4'>Selecciona una sanción</Typography>
            <Typography variant='caption'>La sanción será aplicada al jugador ({user.name}), y tendrá un peso (-1 victoria) en el torneo</Typography>
            <ButtonGroup
                disableElevation
                variant="contained"
                aria-label="Disabled elevation buttons"
                fullWidth={true}
                size='large'
            >
                <Button fullWidth={true} size='large' onClick={() => {
                    setTournamentToSend(prev => ({
                        ...prev,
                        table: prev.table.map((player) => {
                            if (player.team[0].id == user.id) {
                                return {
                                    ...player,
                                    sanction: 'Pase agachado'
                                }
                            }
                            return player
                        })
                    }))
                }} >Pase agachado</Button>
                <Button fullWidth={true} size='large' onClick={() => {
                    setTournamentToSend(prev => ({
                        ...prev,
                        table: prev.table.map((player) => {
                            if (player.team[0].id == user.id) {
                                return {
                                    ...player,
                                    sanction: 'Cabra'
                                }
                            }
                            return player
                        })
                    }))
                }}>Cabra</Button>
            </ButtonGroup>
            <Button fullWidth={true} size='large' onClick={handleClick}>Confirmar</Button>
        </form>
    )
}

export { SanctionForm }