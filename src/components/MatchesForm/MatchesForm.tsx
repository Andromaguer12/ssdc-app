'use client'
import { TablePlayers } from '@/typesDefs/constants/tournaments/types'
import { Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import style from './MatchesForm.module.scss';
import { tournamentUpdateFunction } from '@/redux/reducers/tournament/actions';
import { useAppDispatch, useAppSelector } from '@/redux/store';

import useFirebaseContext from '@/contexts/firebaseConnection/hook';


const MatchesForm = ({ data }: { data: TablePlayers[][] }) => {
    const dispatch = useAppDispatch();
    const fbContext = useFirebaseContext();
    const tournament = useAppSelector(state => state.tournamentList.data[0]);
    const [winnersList, setWinnersList] = useState<string[]>([]);
    const [tournamentToSend, setTournamentToSend] = useState(tournament);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        const matchRef = data[parseInt(name)]; // el name que se obtiene en el evento es el index del match
        const idLoser = matchRef.filter(user => user.team[0].id !== value)[0].team[0].id;
        setWinnersList([...winnersList.filter(id => id !== idLoser), value]);

    }
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Agrega los puntos a los ganadores
        setTournamentToSend(prev => ({
            ...prev,
            table: prev.table.map(player => {
                if (winnersList.includes(player.team[0].id)) {
                    //console.log(`El jugado: ${player.team[0].name} es ganador`);
                    return {
                        ...player,
                        won: player.won + 1,
                        points: player.points + 1,
                        playedRounds: tournamentToSend.currentRound,
                        lost: (tournamentToSend.currentRound) - (player.points + 1)
                    };
                } else {
                    return {
                        ...player,
                        playedRounds: tournamentToSend.currentRound,
                        lost: (tournamentToSend.currentRound) - (player.points)
                    }
                }
            })
        }));
        dispatch(tournamentUpdateFunction({
            context: fbContext,
            payload: tournamentToSend,
            tournament: tournament
        }))
    };

    // Actualiza los resultados de los match
    useEffect(() => {
        setTournamentToSend(prev => ({
            ...prev,
            table: prev.table.map(player => {
                if (winnersList.includes(player.team[0].id)) {
                    return {
                        ...player,
                        won: player.won + 1,
                        points: player.points + 1,
                        playedRounds: tournamentToSend.currentRound,
                        lost: (tournamentToSend.currentRound) - (player.points + 1),
                    };
                }
                return {
                    ...player,
                    playedRounds: tournamentToSend.currentRound,
                    lost: (tournamentToSend.currentRound) - (player.points)
                };
            })
        }));
        //console.log("playedRouds", tournamentToSend.table.map(player => player.playedRounds));
    }, [winnersList.length >= data.length]);


    return (
        <form className={style.MatchesForm} onSubmit={handleSubmit}>
            <Typography variant='h4'>Selecciona los ganadores de la ronda</Typography>
            <div className={style.MatchesFormGrid}>
                {data.map((match, index) => (
                    <FormControl fullWidth={true} key={match[0].team[0].name + index}>
                        <FormLabel>{`Enfrentamiento ${index + 1}`}</FormLabel>
                        <RadioGroup
                            defaultValue="individual"
                            name={`${index}`}
                            row
                            value={winnersList.filter(item => item == match[0].team[0].name)[0]}
                            onChange={handleChange}
                        >
                            <FormControlLabel value={match[0].team[0].id} control={<Radio />} label={match[0].team[0].name} />
                            <FormControlLabel value={match[1]?.team[0].id
                                ? match[1].team[0].id
                                : match[0].team[0].id} control={<Radio />} label={match[1]?.team[0].name
                                    ? match[1].team[0].name
                                    : "Sin rival"} />
                        </RadioGroup>
                    </FormControl>
                ))}

            </div>
            <Button fullWidth disableElevation variant="contained" color="primary"
                type='submit'
            // className={"style.TournamentFormButton"}
            >
                Confirmar
            </Button>
        </form>

    )
}

export { MatchesForm }