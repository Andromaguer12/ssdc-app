'use client'
import { ResultsFormat, TablePlayers } from '@/typesDefs/constants/tournaments/types'
import { Button, Typography } from '@mui/material'
import React, { useState, } from 'react'
import style from './MatchesForm.module.scss';
import { tournamentUpdateFunction } from '@/redux/reducers/tournament/actions';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import useFirebaseContext from '@/contexts/firebaseConnection/hook';
import MatchesResultsCard from './components/MatchesResultsCard';

const MatchesForm = ({ data }: { data: TablePlayers[][] }) => {
    const dispatch = useAppDispatch();
    const fbContext = useFirebaseContext();

    const [results, setResults] = useState<any>({})

    const tournament = useAppSelector(state => state.tournamentList.data[0]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const matchInfoToSend = data.map((match, i) => {
            const result: number[] = results[i]
            const matchInfo = {
                winner: result[0] > result[1] ? match[0] : match[1],
                loser: result[0] > result[1] ? match[1] : match[0],
                points: result.sort((a, b) => a - b),
            }

            return matchInfo
        })

        const tableToSend = tournament.table[tournament.currentRound - 1]

        const standingsToSend: TablePlayers[] = tableToSend.standings.map((player) => {

            const matchref = matchInfoToSend.filter(match => match.winner.team[0].id === player.team[0].id)
            const matchLoseRef = matchInfoToSend.filter(match => match.loser.team[0].id === player.team[0].id)
            if (matchref.length < 1) {
                return {
                    ...player,
                    playedRounds: tournament.currentRound,
                    points: player.points + matchLoseRef[0].points[0],
                    lost: player.lost + 1,
                    difference: matchLoseRef[0].points[0] - matchLoseRef[0].points[1]
                }
            }
            return {
                ...player,
                won: player.won + 1,
                points: player.points + matchref[0].points[1],
                playedRounds: tournament.currentRound,
                difference: matchref[0].points[1] - matchref[0].points[0]
            }


        })

        const resultsToSend: ResultsFormat[] = matchInfoToSend.map((match, index) => {
            return {
                winner: match.winner,
                loser: match.loser,
                match: index,
                result: match.points
            }
        })

        dispatch(tournamentUpdateFunction({
            context: fbContext,
            payload: {
                ...tournament,
                currentRound: tournament.currentRound + 1,
                table: [...tournament.table, {
                    ...tournament.table[tournament.currentRound - 1],
                    standings: standingsToSend,
                    results: resultsToSend,
                }]
            },
            tournament: tournament
        }))
    };

    return (
        <form className={style.MatchesForm} onSubmit={handleSubmit}>
            <Typography variant='h4'>Selecciona los ganadores de la ronda</Typography>
            <div className={style.MatchesFormGrid}>
                {data.map((match, index) => {
                    return (
                        <MatchesResultsCard match={match} tournament={tournament} results={results} setResults={setResults} index={index} />
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