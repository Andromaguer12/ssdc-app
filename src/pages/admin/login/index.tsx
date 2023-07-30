import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Login from '@/components/pages/Login/Login';

export default function HomeIndex() {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>SSDC App</title>
      </Head>
      <Login />
    </>
  );
}
