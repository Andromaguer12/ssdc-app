'use client'
import { TableInterface, TablePlayers } from '@/typesDefs/constants/tournaments/types'
import { Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import style from './MatchesForm.module.scss';
import { tournamentUpdateFunction } from '@/redux/reducers/tournament/actions';
import { useAppDispatch, useAppSelector } from '@/redux/store';

import useFirebaseContext from '@/contexts/firebaseConnection/hook';
import { styles } from '../commonLayout/Footer/styles/sxStyles';
import MatchesResultsCard from './components/MatchesResultsCard';


const MatchesForm = ({ data }: { data: TablePlayers[][] }) => {
    const dispatch = useAppDispatch();
    const fbContext = useFirebaseContext();
    const tournament = useAppSelector(state => state.tournamentList.data[0]);
    const [winnersList, setWinnersList] = useState<string[]>([]);
    const [tableToSend, setTableToSend] = useState<TableInterface>(tournament.table[tournament.currentRound - 1]);
    const [results, setResults] = useState<any[]>([])

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        const matchRef = data[parseInt(name)]; // el name que se obtiene en el evento es el index del match
        const idLoser = matchRef.filter(user => user.team[0].id !== value)[0].team[0].id;
        setWinnersList([...winnersList.filter(id => id !== idLoser), value]);

    }
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Agrega los puntos a los ganadores
        setTableToSend(prev => ({
            ...prev,
            standings: prev.standings.map(player => {
                if (winnersList.includes(player.team[0].id)) {
                    console.log(`El jugado: ${player.team[0].name} es ganador y tiene ${player.points}pts`);
                    return {
                        ...player,
                        won: player.won + 1,
                        points: player.points == 0 ? 1 : (player.points + 1),
                        playedRounds: tournament.currentRound,
                        lost: (tournament.currentRound) - (player.points + 1)
                    };
                } else {
                    return {
                        ...player,
                        playedRounds: tournament.currentRound,
                        lost: (tournament.currentRound) - (player.points)
                    }
                }
            })

        }));
        dispatch(tournamentUpdateFunction({
            context: fbContext,
            payload: {
                ...tournament,
                table: [...tournament.table, tableToSend]
            },
            tournament: tournament
        }))
    };

    // Actualiza los resultados de los match
    useEffect(() => {
        setTableToSend(prev => ({
            ...prev,
            standings: prev.standings.map(player => {
                if (winnersList.includes(player.team[0].id)) {
                    console.log(`El jugado: ${player.team[0].name} es ganador y tiene ${player.points}pts`);
                    return {
                        ...player,
                        won: player.won + 1,
                        points: player.points == 0 ? 1 : (player.points + 1),
                        playedRounds: tournament.currentRound,
                        lost: (tournament.currentRound) - (player.points + 1)
                    };
                } else {
                    return {
                        ...player,
                        playedRounds: tournament.currentRound,
                        lost: (tournament.currentRound) - (player.points)
                    }
                }
            })

        }));
    }, [winnersList.length >= data.length]);

    const handleUpdateMatchesResults = (index: number, values: number[]) => {
        if(!results.find((d) => d.id === index)) {
            setResults(results.concat({ id: index, values }))
        }
    }

    return (
        <form className={style.MatchesForm} onSubmit={handleSubmit}>
            <Typography variant='h4'>Selecciona los ganadores de la ronda</Typography>
            <div className={style.MatchesFormGrid}>
                {data.map((match, index) => {
                    return (
                        <MatchesResultsCard match={match} tournament={tournament} updateFunction={handleUpdateMatchesResults} index={index} />
                    )
                })}

            </div>
            <Button fullWidth disableElevation variant="contained" color="primary" type="submit">
                Confirmar
            </Button>
        </form>

    )
}

export { MatchesForm }