import Layout from "/components/Layout";
import { NotificacaoProvider } from "/contexts/NotificacaoContext";
import "/styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <NotificacaoProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </NotificacaoProvider>
  );
}

export default MyApp;
