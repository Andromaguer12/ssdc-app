import React from 'react'
import { Typography } from '@mui/material';
import UserForm from '@/components/UserForm/UserForm';

import styles from './NewUser.module.scss';

const NewUser = () => {
   

    return (
        <div className={styles.UserForm}>
            <Typography variant='h3' gutterBottom>Registrar Usuario</Typography>
            <UserForm data={null} eventSubmit='Create' />
        </div>
    )
}

export default NewUser