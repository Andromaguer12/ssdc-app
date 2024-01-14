import Header from '@/components/commonLayout/Header/Header';
import TournamentsPage from '@/components/pages/TournamentsPage/TournamentsPage';
import Head from 'next/head';
import React from 'react';

const Tournament = () => {
  return (
    <>
      <Head>
        <title>DominoElite</title>
      </Head>
      <Header />
      <TournamentsPage />
    </>
  );
};

export default Tournament;
