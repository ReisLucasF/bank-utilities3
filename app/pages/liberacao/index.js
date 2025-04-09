import Head from "next/head";
import LiberacaoDispositivos from "/components/LiberacaoDispositivos";

export default function DispositivosPage() {
  return (
    <>
      <Head>
        <title>Liberação de Dispositivos | Bank Utilities</title>
        <meta
          name="description"
          content="Gerador de scripts para liberação de dispositivos"
        />
      </Head>

      <LiberacaoDispositivos />
    </>
  );
}
