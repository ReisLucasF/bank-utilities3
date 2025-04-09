import Layout from "/components/Layout";
import { ThemeProvider } from "/context/ThemeContext";
import "/styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  );
}

export default MyApp;
