import React from 'react';
import Login from '@/components/pages/Login/Login';
import Head from 'next/head';

export default function HomeIndex() {
  return (
    <>
      <Head>
        <title>DominoElite</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"></meta>
      </Head>
      <Login />
    </>
  );
}
