"use client"
import Header from "@/components/commonLayout/Header/Header"
import theme from "@/constants/styling/theme/muiTheme"
import FirebaseContext from "@/contexts/firebaseConnection/context"
import store, { useAppDispatch, useAppSelector } from "@/redux/store"
import Firebase from "@/services/firebaseConnection/class"
import { ThemeProvider } from "@emotion/react"
import { Provider } from "react-redux"
import '../constants/styling/global.css'
import Cookies from 'js-cookie'
import { useEffect } from "react"
import { clearStateUser, getUserByUserUid } from "@/redux/reducers/user/actions"
import FetchingContext from "@/contexts/backendConection/context"
import { useRouter } from "next/navigation"

function Main({ children }: { children: any }) {
  const dispatch = useAppDispatch()
  const firebaseClass = new Firebase();
  const router = useRouter()

  const { signedOut } = useAppSelector(({ user }) => user)
  
  useEffect(() => {
      if(signedOut) {
          dispatch(clearStateUser())
          router.push('/login');
      }
  }, [signedOut])
  

  useEffect(() => {
    const uid = Cookies.get("auth");
    const accessToken = Cookies.get("accessToken");

    if (accessToken && uid) {
      dispatch(getUserByUserUid({
        uid, 
        accessToken,
        context: firebaseClass
      }))
    }
  }, []);
  

  return (
    <>
      {children}
    </>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const firebaseClass = new Firebase();
  return (
    <Provider store={store}>
      <FirebaseContext.Provider value={firebaseClass}>
        <FetchingContext.Provider value={firebaseClass}>
          <ThemeProvider theme={theme}>
            <Main>{children}</Main>
          </ThemeProvider>
        </FetchingContext.Provider>
      </FirebaseContext.Provider>
    </Provider>
  )
}