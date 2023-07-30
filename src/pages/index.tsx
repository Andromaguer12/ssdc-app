import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Login from '@/components/pages/Login/Login';
import { AllRoutes } from '@/constants/routes/routes';
// import Home from '../components/pages/home/components/Home';

export default function HomeIndex() {
  const router = useRouter()

  useEffect(() => {
    router.push(AllRoutes.ADMIN_LOGIN)
  }, [])
  

  return (
    <>
      <Head>
        <title>SSDC App</title>
      </Head>
      {/* <Home /> */}
    </>
  );
}
