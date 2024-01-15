import Header from '@/components/commonLayout/Header/Header';
import TournamentsPage from '@/components/pages/TournamentsPage/TournamentsPage';
import Head from 'next/head';
import React from 'react';

const Tournament = () => {
  return (
    <>
      <Head>
        <title>DominoElite</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        ></meta>
      </Head>
      <Header />
      <TournamentsPage />
    </>
  );
};

export default Tournament;
