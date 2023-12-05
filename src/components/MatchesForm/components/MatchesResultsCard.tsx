import { TextField, Typography } from '@mui/material'
import React, { useState, useCallback, useRef } from 'react'
import style from '../MatchesForm.module.scss';
import { TournamentReducerInitialState } from '@/redux/reducers/tournament/actions';
import { TablePlayers } from '@/typesDefs/constants/tournaments/types';

interface MatchesResultsCardProps { 
  match: TablePlayers[],
  results: any,
  setResults: (value: any) => any,
  tournament: TournamentReducerInitialState,
  index: number
}

const MatchesResultsCard = ({ match, tournament, results, setResults, index }: MatchesResultsCardProps) => {
    const firstInput = useRef<any>()
    const secondaryInput = useRef<any>()

  const handlePoints = useCallback(
    () => {
        const result1 = firstInput.current?.value
        const result2 = secondaryInput.current?.value

        const currentPoints = {
            ...results,
            [index]: [Number(result1), Number(result2)]
        }
                  
        setResults(currentPoints)
    },
    [results],
  )

  return (
    <div className={style.matchesFields}>
        <Typography className={style.title}>{`Enfrentamiento ${index + 1}`}</Typography>
        <div className={style.scoresRow}>
            <div className={style.scores}>
                <Typography className={style.matchesLabel}>
                    {match[0].team[0].name}
                    {tournament.format !== 'individual' && 
                        <>
                            {' - '}{match[0]?.team[1]?.name
                                ? match[0].team[1].name
                                : "Sin rival"}
                        </>
                    }
                </Typography>
                <TextField
                    name="score"
                    size='small'
                    placeholder={`Puntaje`}
                    type="number"
                    inputProps={{
                        ref: firstInput
                    }}
                    onChange={handlePoints}
                />
            </div>
            <div className={style.scores}>
                <Typography className={style.matchesLabel}>
                    {match[1]?.team[0].name
                    ? match[1].team[0].name
                    : "Sin rival"}
                    {tournament.format !== 'individual' && <>
                        {' - '}{match[1]?.team[1]?.name
                            ? match[1].team[1].name
                            : "Sin rival"}
                    </>}
                <TextField
                    name="score"
                    size='small'
                    placeholder={`Puntaje`}
                    type="number"
                    inputProps={{
                        ref: secondaryInput
                    }}
                    onChange={handlePoints}
                />
                </Typography>
            </div>

        </div>
    </div>  
  )
}

export default MatchesResultsCard