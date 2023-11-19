"use client"
import { TournamentInformation } from '@/components/pages/TournamentInformation/TournamentInformation'
import useFirebaseContext from '@/contexts/firebaseConnection/hook';
import { tournamentGetById } from '@/redux/reducers/tournamentsList/actions';
//import { tournamentGetById } from '@/redux/reducers/tournament/actions';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import React, { useEffect } from 'react'

const TournamentPage = ({ params }: { params: { id: string } }) => {

    const { id } = params;
    const fbContext = useFirebaseContext();
    const dispatch = useAppDispatch();
    const tournament = useAppSelector(state => state.tournamentList.data);
    useEffect(() => {
        dispatch(tournamentGetById({
            context: fbContext,
            id: id
        }))
    }, [/*tournament*/]);
    return (
        <TournamentInformation tournament={tournament[0]} />
    )
}

export default TournamentPage