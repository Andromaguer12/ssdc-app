"use client"
import { TournamentsList } from '@/components/TournamentsList/TournamentsList'
import { Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import style from './Tournaments.module.scss';
import { getUsersList } from '@/redux/reducers/usersList/actions';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import useFirebaseContext from '@/contexts/firebaseConnection/hook';
import { tournamentCreateFunction } from '@/redux/reducers/tournament/actions';
import Modal from '@/components/Modal/Modal';

const Tournaments = () => {
    const dispatch = useAppDispatch();
    const fbContext = useFirebaseContext();
    const UserList = useAppSelector(state => state.usersList.data);
    const [modal , setModal] = useState<boolean>(false);

    useEffect(() => {
        dispatch(getUsersList({
            context: fbContext,
        }))
    }, [])
    return (
        <section className={style.Tournaments}>
            <Typography variant='h3'>Torneos</Typography>
            <div className={style.TournamentsListContainer}>
                {/*<button type='button' onClick={() => dispatch(tournamentCreateFunction({
                    context: fbContext,
                    tournamentData: {
                        name: "Torneo de Verano",
                        rules: "El segundo torneo",
                        format: "individual",
                        startDate: "2023-09-23",
                        endDate: "2023-09-29",
                        currentRound: 1,
                        winner: null,
                        table: [
                            {
                                position: 1,
                                team: [UserList.length > 1 ? UserList[3] : {
                                    name: '',
                                    email: '',
                                    phone: '',
                                    rank: "C",
                                    loadingUser: false,
                                    accessToken: '',
                                    uid: '',
                                    error: '',
                                    id: ''
                                }],
                                playedRounds: 1,
                                form: ["W"],
                                won: 1,
                                draw: 0,
                                lost: 0,
                                poitns: 0,
                            },
                            {
                                position: 2,
                                team: [UserList.length > 1 ? UserList[0] : {
                                    name: '',
                                    email: '',
                                    phone: '',
                                    rank: "C",
                                    loadingUser: false,
                                    accessToken: '',
                                    uid: '',
                                    error: '',
                                    id: ''
                                }],
                                playedRounds: 1,
                                form: ["L"],
                                won: 0,
                                draw: 0,
                                lost: 1,
                                poitns: 0,
                            },
                        ],
                    }
                }))}
                >Agregar torneo
                </button> */}
                <button type='button' onClick={() => setModal(true)}>Crear</button>
                <Typography variant='h5'>Lista de torneos</Typography>
                <TournamentsList />
            </div>
            {modal && <Modal setModal={() => setModal(false)} data={null} format="tournament" />}
        </section>
    )
}

export { Tournaments }