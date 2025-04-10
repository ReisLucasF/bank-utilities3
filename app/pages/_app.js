import Layout from "/components/Layout";
import { ThemeProvider } from "/context/ThemeContext";
import "/styles/globals.css";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Bank Utilities</title>
        <meta
          name="description"
          content="Ferramentas para facilitar o trabalho dos colaboradores bancários"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon512.png" />
      </Head>

      <ThemeProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </>
  );
}

export default MyApp;
