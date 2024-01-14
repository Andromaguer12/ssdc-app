'use-client';
import TournamentPage from '@/components/pages/TournamentPage/TournamentPage';
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
        <title>Torneo | DominoElite</title>
      </Head>
      <TournamentPage tournamentId={tournament_id} />
    </>
  );
};

export default TournamentPageIndex;
