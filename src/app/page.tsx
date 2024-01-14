'use client';
import React, { useEffect } from 'react';
import Head from 'next/head';
import { AllRoutes } from '@/constants/routes/routes';
import { useRouter } from 'next/navigation';

export default function HomeIndex() {
  const router = useRouter();

  useEffect(() => {
    router.replace(AllRoutes.ADMIN_LOGIN);
  }, []);

  return (
    <>
      <Head>
        <title>DominoElite</title>
      </Head>
    </>
  );
}
