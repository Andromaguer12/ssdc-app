import { Button, ButtonGroup, Typography } from '@mui/material'
import React from 'react'
import GppBadIcon from '@mui/icons-material/GppBad';
import style from "./SanctoinForm.module.scss";

const SanctionForm = () => {
    return (
        <form className={style.SanctionForm}>
            <GppBadIcon fontSize='large' color='primary' />
            <Typography variant='h4'>Selecciona una sanción</Typography>
            <Typography variant='caption'>La sanción será aplicada al jugador, y tendrá un peso (-1 victoria) en el torneo</Typography>
            <ButtonGroup
                disableElevation
                variant="contained"
                aria-label="Disabled elevation buttons"
                fullWidth={true}
                size='large'
            >
                <Button fullWidth={true} size='large'>Pase agachado</Button>
                <Button fullWidth={true} size='large'>Cabra</Button>
            </ButtonGroup>
            <Button fullWidth={true} size='large'>Confirmar</Button>
        </form>
    )
}

export { SanctionForm }