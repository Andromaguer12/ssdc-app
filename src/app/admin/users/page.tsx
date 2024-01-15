import Header from '@/components/commonLayout/Header/Header';
import Dashboard from '@/components/pages/Dashboard/Dashboard';
import UsersPage from '@/components/pages/UsersPage/UsersPage';
import Head from 'next/head';
import React from 'react';

const DashboardAdminIndex = () => {
  return (
    <>
      <Head>
        <title>DominoElite</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"></meta>
      </Head>
      <Header />
      <UsersPage />
    </>
  );
};

export default DashboardAdminIndex;
