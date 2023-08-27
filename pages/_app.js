import '@/styles/globals.css'
import { SessionProvider, useSession } from "next-auth/react"
import Layout from "../components/Layout"
import AuthGuard from '../components/auth/AuthGuard'
import AdminAuthGuard from '../components/auth/AdminAuthGuard'
import { ToastContainer } from "react-toastify";



export default function App({ Component, pageProps: { session, ...pageProps } }) {

  if(Component.layout==="Blank") return <Component {...pageProps} />
   
  return (
    <SessionProvider session={session}>
      {
        Component.requiredAuth ?(  
         <AuthGuard>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </AuthGuard>):
          Component.requiredAdminAuth ?
           (<AdminAuthGuard>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </AdminAuthGuard>):
          (
            <Layout>
            <Component {...pageProps} />
          </Layout>
          )
      }
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </SessionProvider>
   
  )
}




