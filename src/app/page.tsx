"use client"
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import { AllRoutes } from '@/constants/routes/routes';

export default function HomeIndex() {
  const router = useRouter();

  useEffect(() => {
    router.push(AllRoutes.ADMIN_LOGIN);
  }, []);

  return (
    <>
      <Head>
        <title>SSDC App</title>
      </Head>

      {/*body */}
    </>
  );
}
