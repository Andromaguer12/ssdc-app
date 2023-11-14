"use client"
import { TournamentInformation } from '@/components/pages/TournamentInformation/TournamentInformation'
import useFirebaseContext from '@/contexts/firebaseConnection/hook';
import { tournamentGetById } from '@/redux/reducers/tournamentsList/actions';
//import { tournamentGetById } from '@/redux/reducers/tournament/actions';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import React, { useEffect, useState } from 'react'

const TournamentPage = ({ params }: { params: { id: string } }) => {

    const { id } = params;
    const fbContext = useFirebaseContext();
    const dispatch = useAppDispatch();
    const { data: tournament, loading } = useAppSelector(state => state.tournamentList);
    const [currentRound, setCurrentRound] = useState(null)
    const { updateTournament:{ success: successUpdated } } = useAppSelector(({ tournament }) => tournament)
    
    useEffect(() => {
        dispatch(tournamentGetById({
            context: fbContext,
            id: id
        }))
    }, []);

    useEffect(() => {
      if(successUpdated) {
        dispatch(tournamentGetById({ context: fbContext, id }))
      }
    }, [successUpdated])

    useEffect(() => {
      if (tournament && tournament[0]?.length > 0) {
        setCurrentRound(tournament[0][tournament[0].length-1])
      }
    }, [tournament])
    

    return (
        <>
            {currentRound && !loading && <TournamentInformation tournament={currentRound} />}
        </>
    )
}

export default TournamentPage