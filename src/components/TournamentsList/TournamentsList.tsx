'use client'
import { addTournament } from '@/redux/reducers/tournament/actions';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import React from 'react'

const TournamentsList = () => {

    const TournamentList = useAppSelector(state => state.tournament);
    const UserList = useAppSelector(state => state.usersList.data);
    const dispatch = useAppDispatch();
    console.log(UserList);
    return (
        <section>
            <button type='button' onClick={() => dispatch(addTournament({
                name: "Torneo de fútbol",
                rules: "El primer equipo en llegar a 10 goles gana el partido.",
                format: "individual",
                startDate: "2023-09-20",
                endDate: "2023-09-27",
                currentRound: 1,
                winner: null,
                table: [
                    {
                        position: 1,
                        team: [UserList[0]],
                        playedRounds: 1,
                        form: ["W"],
                        won: 1,
                        draw: 0,
                        lost: 0,
                    },
                    {
                        position: 2,
                        team: [UserList[1]],
                        playedRounds: 1,
                        form: ["L"],
                        won: 0,
                        draw: 0,
                        lost: 1,
                    },
                ],
            }))}
            >Agregar torneo
            </button>
            {TournamentList.map((tournament, index) => (
                <div key={index}>
                    <h5>{tournament.name}</h5>
                    <p>{tournament.endDate}</p>
                    <p>Jugador:{tournament.table[0].team[0].name}</p>
                </div>
            ))}
        </section>
    )
}

// Se necesita mejorar esta lista de torneos, la logica que ordenamiento de posicion es logica de cada uno de los torneos

export { TournamentsList }