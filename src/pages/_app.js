import Layout from "@/components/Layout";
import Nav from "@/components/Nav";
import "@/styles/globals.css";
import Head from "next/head";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import { ToastContainer, Bounce } from "react-toastify";
import { useRouter } from 'next/router';

const publicPages = ['/login', '/register']; // páginas que não precisam de autenticação

export default function App({ Component, pageProps }) {
    const { loading } = useAuth();
    const router = useRouter();
    const isPublicPage = publicPages.includes(router.pathname);

    if (loading) {
        return <div>Carregando...</div>;
    }

    return (
        <>
            {!isPublicPage && <Nav />}
            <Layout>
                <Head>
                    <title>Plataforma Zury AI</title>
                </Head>
                {isPublicPage ? (
                    <Component {...pageProps} />
                ) : (
                    <ProtectedRoute>
                        <Component {...pageProps} />
                    </ProtectedRoute>
                )}
            </Layout>
            <ToastContainer
                position="top-center"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
                transition={Bounce}
            />
        </>
    );
}
