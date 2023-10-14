import { Button, ButtonGroup, Typography } from '@mui/material'
import React from 'react'
import GppBadIcon from '@mui/icons-material/GppBad';
import style from "./SanctoinForm.module.scss";

const SanctionForm = () => {
    return (
        <form className={style.SanctionForm}>
            <GppBadIcon fontSize='large' color='primary' />
            <Typography variant='h4'>Selecciona una sancion</Typography>
            <Typography variant='caption'>La sanacion sera aplicada al jugador, y tendra un peso en el torneo</Typography>
            <ButtonGroup
                disableElevation
                variant="contained"
                aria-label="Disabled elevation buttons"
                fullWidth={true}
                size='large'
            >
                <Button fullWidth={true} size='large'>Sancion 1</Button>
                <Button fullWidth={true} size='large'>Sancion 2</Button>
            </ButtonGroup>
        </form>
    )
}

export { SanctionForm }