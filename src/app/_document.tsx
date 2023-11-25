import React, { useEffect } from 'react';
import { Html, Head, Main, NextScript } from 'next/document';
import { useDispatch } from 'react-redux';
import { getUserByUserUid } from '@/redux/reducers/user/actions';
import useFetchingContext from '@/contexts/backendConection/hook';

export default function Document() {
  const dispatch = useDispatch()
  const fContext = useFetchingContext()

  useEffect(() => {
    const uid = document.cookie.split('; ').find(row => row.startsWith('auth')).split('=')[1];
    const accessToken = document.cookie.split('; ').find(row => row.startsWith('accessToken')).split('=')[1];

    if (accessToken && uid) {
      dispatch(getUserByUserUid({
        uid, 
        accessToken,
        context: fContext
      }))
    }
  }, []);

  return (
    <Html>
      {/* please note we have all routes inside constants/routes/routes.tsx */}
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Source+Code+Pro&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Share+Tech&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
