'use client'
import { TablePlayers } from '@/typesDefs/constants/tournaments/types'
import { Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import style from './MatchesForm.module.scss';

const MatchesForm = ({ data }: { data: TablePlayers[][] }) => {

    const [winnersList, setWinnersList] = useState<string[]>([]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setWinnersList((prevData) => ([...prevData, value]));
        console.log(winnersList);
    }

    return (
        <section className={style.MatchesForm}>
            <Typography variant='h4'>Selecciona los ganadores de la ronda</Typography>
            <div className={style.MatchesFormGrid}>
                {data.map((match, index) => (
                    <FormControl fullWidth={true} key={match[0].team[0].name + index}>
                        <FormLabel>{`Enfrentamiento ${index + 1}`}</FormLabel>
                        <RadioGroup
                            defaultValue="individual"
                            name="format"
                            row
                            value={winnersList.filter(item => item === match[0].team[0].name)[0]}
                            onChange={handleChange}
                        >
                            <FormControlLabel value={match[0].team[0].name} control={<Radio />} label={match[0].team[0].name} />
                            <FormControlLabel value={match[1]?.team[0].name
                                ? match[1].team[0].name
                                : "Sin rival"} control={<Radio />} label={match[1]?.team[0].name
                                    ? match[1].team[0].name
                                    : "Sin rival"} />
                        </RadioGroup>
                    </FormControl>
                ))}

            </div>
            <Button fullWidth disableElevation variant="contained" color="primary"
            //onClick={'() => setModal(true)'}
            // className={"style.TournamentFormButton"}
            >
                Confirmar
            </Button>
        </section>

    )
}

export { MatchesForm }