import Layout from "@/components/Layout";
import Nav from "@/components/Nav";
import "@/styles/globals.css";
import Head from "next/head";
import "react-toastify/dist/ReactToastify.css";

export default function App({ Component, pageProps }) {
    return (
        <>
            <Nav />
            <Layout>
                <Head>
                    <title>Plataforma Zury AI</title>
                </Head>
                <Component {...pageProps} />
            </Layout>
        </>
    );
}
