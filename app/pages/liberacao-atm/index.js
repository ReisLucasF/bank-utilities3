import Head from "next/head";
import LiberacaoATM from "/components/LiberacaoATM";

export default function ATMPage() {
  return (
    <>
      <Head>
        <title>Liberação de Dispositivos ATM | Bank Utilities</title>
        <meta
          name="description"
          content="Gerador de scripts para liberação de dispositivos ATM"
        />
      </Head>

      <LiberacaoATM />
    </>
  );
}
