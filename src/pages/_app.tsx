import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { ThemeProvider } from '@mui/material';
import { Provider } from 'react-redux';
import Firebase from '../services/firebaseConnection/class';
import FirebaseContext from '@/contexts/firebaseConnection/context';
import LoginAndRegisterLayout from '@/components/commonLayout/LoginAndRegisterLayout/LoginAndRegisterLayout';
import store from '@/redux/store';
import theme from '../constants/styling/theme/muiTheme';
import { AllRoutes } from '../constants/routes/routes';
import '../constants/styling/global.css';

const Module = ({ nextAPI }: { nextAPI: AppProps }) => {
  const router = useRouter();
  const { Component, pageProps } = nextAPI;

  if ( 
    router.pathname.includes(AllRoutes.HOME) ||
    router.pathname.includes(AllRoutes.ADMIN_LOGIN)
  ) {
    return (
      <LoginAndRegisterLayout showHeader showFooter>
        <Component {...pageProps} />
      </LoginAndRegisterLayout>
    );
  }

  return <Component {...pageProps} />;
};
export default function MyApp(props: AppProps) {
  const firebaseClass = new Firebase();

  // here we can add contexts like the backend context, and we can also add providers for sass or antd
  return (
    <Provider store={store}>
      <FirebaseContext.Provider value={firebaseClass}>
        <ThemeProvider theme={theme}>
            <Module nextAPI={props} />
        </ThemeProvider>
      </FirebaseContext.Provider>
    </Provider>
  );
}
