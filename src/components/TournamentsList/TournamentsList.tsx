'use client'
import useFirebaseContext from '@/contexts/firebaseConnection/hook';
import { tournamentCreateFunction } from '@/redux/reducers/tournament/actions';
import { getUsersList } from '@/redux/reducers/usersList/actions';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import React, { useEffect } from 'react'

const TournamentsList = () => {



    const TournamentList = useAppSelector(state => state.tournament);
    const UserList = useAppSelector(state => state.usersList.data);
    const dispatch = useAppDispatch();
    console.log("lista de usuarios", UserList);
    const fbContext = useFirebaseContext();

    useEffect(() => {
        dispatch(getUsersList({
            context: fbContext,
        }))
    }, []);


    return (
        <section>
            <button type='button' onClick={() => dispatch(tournamentCreateFunction({
                context: fbContext,
                tournamentData: {
                    name: "Torneo Prueba 1",
                    rules: "El primer torneo",
                    format: "individual",
                    startDate: "2023-09-20",
                    endDate: "2023-09-27",
                    currentRound: 1,
                    winner: null,
                    table: [
                        {
                            position: 1,
                            team: [UserList.length > 1 ? UserList[1] : {
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
                            team: [UserList.length > 1 ? UserList[2] : {
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
            </button>
            {/*TournamentList.map((tournament, index) => (
                <div key={index}>
                    <h5>{tournament.name}</h5>
                    <p>{tournament.endDate}</p>
                    <p>Jugador:{tournament.table[0].team[0].name}</p>
                </div>
            )) */}
        </section>
    )
}

// Se necesita mejorar esta lista de torneos, la logica que ordenamiento de posicion es logica de cada uno de los torneos

export { TournamentsList }