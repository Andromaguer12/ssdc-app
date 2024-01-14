import React from 'react';
import Login from '@/components/pages/Login/Login';
import Head from 'next/head';

export default function HomeIndex() {
  return (
    <>
      <Head>
        <title>DominoElite</title>
      </Head>
      <Login />
    </>
  );
}
