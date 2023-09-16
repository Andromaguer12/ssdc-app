"use client"
import Header from "@/components/commonLayout/Header/Header"
import theme from "@/constants/styling/theme/muiTheme"
import FirebaseContext from "@/contexts/firebaseConnection/context"
import store from "@/redux/store"
import Firebase from "@/services/firebaseConnection/class"
import { ThemeProvider } from "@emotion/react"
import { Provider } from "react-redux"


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const firebaseClass = new Firebase();

  return (
    <html lang="en">

      <body>
        <Provider store={store}>
          <FirebaseContext.Provider value={firebaseClass}>
            <ThemeProvider theme={theme}>
              <Header />
              {children}
            </ThemeProvider>
          </FirebaseContext.Provider>
        </Provider>
      </body>
    </html>
  )
}
