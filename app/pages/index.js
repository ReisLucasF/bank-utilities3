import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Minha Aplicação</title>
        <meta name="description" content="Minha aplicação Next.js" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="home-container">
        <h2>Bem-vindo à sua aplicação</h2>
        <div>
          <p className="magic-text">🧙‍♂️ Asa de dragão, pena de galinha...</p>
          <p className="love-text">Se você me ama...</p>
          <button
            onClick={() => alert("Também te amo, baby 💖")}
            className="fun-button"
          >
            Dá uma risadinha! 😆
          </button>
        </div>
      </div>
    </>
  );
}
