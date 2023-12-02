"use client"
import { TournamentsList } from '@/components/TournamentsList/TournamentsList'
import { Button, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import style from './Tournaments.module.scss';
import { getUsersList } from '@/redux/reducers/usersList/actions';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import useFirebaseContext from '@/contexts/firebaseConnection/hook';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import Modal from '@/components/Modal/Modal';
import { getTournamentsList } from '@/redux/reducers/tournamentsList/actions';

const Tournaments = () => {
    const dispatch = useAppDispatch();
    const fbContext = useFirebaseContext();
    //const UserList = useAppSelector(state => state.usersList.data);
    const [modal, setModal] = useState<boolean>(false);

    useEffect(() => {
        dispatch(getUsersList({
            context: fbContext,
        }))
    }, [])

    const handleReloadData = () => {
        dispatch(getTournamentsList({
            context: fbContext,
        }));
    }

    return (
        <section className={style.Tournaments}>
            <Typography sx={{ marginLeft: '0px' }} color="secondary" variant='h3'>Torneos</Typography>
            <div className={style.TournamentsListContainer}>
                <div className={style.header}>
                    <Typography variant='h5'>Lista de torneos</Typography>
                    <Button variant="contained"
                        color="primary"
                        endIcon={<EmojiEventsIcon />}
                        type='button'
                        size="medium"
                        onClick={() => setModal(true)}>
                        Crear torneo
                    </Button>
                </div>
                <TournamentsList />
            </div>
            {modal && <Modal handleReloadData={handleReloadData} setModal={() => setModal(false)} format="tournament" />}
        </section>
    )
}

export { Tournaments }