import Header from '@/components/commonLayout/Header/Header';
import Dashboard from '@/components/pages/Dashboard/Dashboard';
import Head from 'next/head';
import React from 'react';

const DashboardAdminIndex = () => {
  return (
    <>
      <Head>
        <title>DominoElite</title>
      </Head>
      <Dashboard />
    </>
  );
};

export default DashboardAdminIndex;
