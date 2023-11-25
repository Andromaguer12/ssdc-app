import { TextField, Typography } from '@mui/material'
import React, { useState, useCallback } from 'react'
import style from '../MatchesForm.module.scss';
import { TournamentReducerInitialState } from '@/redux/reducers/tournament/actions';
import { TablePlayers } from '@/typesDefs/constants/tournaments/types';

interface MatchesResultsCardProps { 
  match: TablePlayers[],
  updateFunction: (index: number, currentPoints: number[]) => any,
  tournament: TournamentReducerInitialState,
  index: number
}

const MatchesResultsCard = ({ match, tournament, updateFunction, index }: MatchesResultsCardProps) => {
  const [points, setPoints] = useState([0, 0])

  const handlePoints = (e: any, team: number) => {
      const currentPoints = [...points]

      currentPoints[team] = Number(e.target.value)
      
      setPoints(currentPoints)
      
      if(team == 1) {
        updateFunction(index, currentPoints)
      }
  }

  return (
    <div className={style.matchesFields}>
        <Typography className={style.title}>{`Enfrentamiento ${index + 1}`}</Typography>
        <div className={style.scoresRow}>
            <div className={style.scores}>
                <Typography className={style.matchesLabel}>
                    {match[0].team[0].name}
                    {tournament.format !== 'individual' && 
                        <>
                            {' - '}{match[1]?.team[1]?.name
                                ? match[1].team[1].name
                                : "Sin rival"}
                        </>
                    }
                </Typography>
                <TextField 
                    name="score"
                    size='small'
                    placeholder={`Puntaje`}
                    type="number"
                    defaultValue={points[0]}
                    onChange={(e) => handlePoints(e, 0)}
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
                    defaultValue={points[1]}
                    onChange={(e) => handlePoints(e, 1)}
                />
                </Typography>
            </div>

        </div>
    </div>  
  )
}

export default MatchesResultsCard