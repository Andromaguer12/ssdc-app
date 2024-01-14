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
      </Head>
      <Header />
      <UsersPage />
    </>
  );
};

export default DashboardAdminIndex;
