'use-client';
import TournamentPage from '@/components/pages/TournamentPage/TournamentPage';
import TournamentRoundsPage from '@/components/pages/TournamentRoundsPage/TournamentRoundsPage';
import Head from 'next/head';
import React from 'react';

const TournamentPageIndex = ({
  params
}: {
  params: { tournament_id: string };
}) => {
  const { tournament_id } = params;

  return (
    <>
      <Head>
        <title>Historial de rondas | DominoElite</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        ></meta>
      </Head>
      <TournamentRoundsPage tournamentId={tournament_id} />
    </>
  );
};

export default TournamentPageIndex;
