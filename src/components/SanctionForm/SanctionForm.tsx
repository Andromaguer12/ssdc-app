import { Button, ButtonGroup, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import GppBadIcon from '@mui/icons-material/GppBad';
import style from "./SanctoinForm.module.scss";
import { tournamentUpdateFunction } from '@/redux/reducers/tournament/actions';
import useFirebaseContext from '@/contexts/firebaseConnection/hook';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { UserReducerInitialState } from '@/redux/reducers/user/actions';
import { TableInterface } from '@/typesDefs/constants/tournaments/types';



const SanctionForm = ({ user, format, tournamentId, standingIndex }: {
    user: UserReducerInitialState, format: string, tournamentId?: string, standingIndex: number
}) => {
    const dispatch = useAppDispatch();
    const fbContext = useFirebaseContext();
    const tournaments = useAppSelector(state => state.tournamentList.data);
    const tournamentToUpdate = tournaments.filter(tournament => tournament.id === tournamentId)[0]

    const [tournamentToSend, setTournamentToSend] = useState(tournamentToUpdate);

    useEffect(() => {
        console.log(tournamentToUpdate, 'torneo')
    }, [tournamentToUpdate])

    /* useEffect(() => {
        dispatch(tournamentUpdateFunction({
            context: fbContext,
            payload: tournamentToSend,
            tournament: tournamentToUpdate
        }))
    }, [tournamentToSend]) */

    const handleAddSanction = (sanctionToAdd: 'Pase agachado' | 'Cabra') => {
        console.log(standingIndex, 'index')
        const standingToSend = tournamentToSend.table[standingIndex].standings.map(player => {
            if (player.team[0].id === user.id) {
                return {
                    ...player,
                    sanction: sanctionToAdd,
                    points: 0,
                    lost: player.lost + 1
                }
            } else {
                return {
                    ...player,
                }
            }
        })
        const tableToSend = tournamentToSend.table.map((table, index) => {
            if (index === standingIndex) {
                return {
                    ...table,
                    standings: standingToSend
                }
            } else {
                return {
                    ...table
                }
            }
        })

        console.log(standingToSend, 'aaa')

        setTournamentToSend({
            ...tournamentToSend,
            table: tableToSend,
        })
    }
    const handleSubmit = () => {
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
                <Button fullWidth={true} size='large' onClick={() => handleAddSanction('Pase agachado')} >Pase agachado</Button>
                <Button fullWidth={true} size='large' onClick={() => handleAddSanction('Cabra')}>Cabra</Button>
            </ButtonGroup>
            <Button fullWidth={true} size='large' onClick={handleSubmit}>Confirmar</Button>
        </form>
    )
}

export { SanctionForm }