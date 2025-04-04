// pages/painel-chamada.js
import { useState, useEffect } from "react";
import Head from "next/head";
import socketService from "/services/socketService";
import styles from "/styles/PainelChamada.module.css";

export default function PainelChamada() {
  const [chamadaAtual, setChamadaAtual] = useState({
    paciente: "Aguardando...",
    profissional: "--",
    local: "--",
    horario: "--",
  });

  const [historicoChamadas, setHistoricoChamadas] = useState([]);
  const [horarioAtual, setHorarioAtual] = useState("");

  // Configurar Socket.IO e atualizar o horário
  useEffect(() => {
    // Inicializar conexão com Socket.IO se ainda não estiver conectado
    socketService.connect();

    // Atualizar o horário
    const atualizarHorario = () => {
      const agora = new Date();
      const horarioFormatado =
        agora.toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        }) +
        " " +
        agora.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });

      setHorarioAtual(horarioFormatado);
    };

    // Atualizar horário imediatamente e a cada segundo
    atualizarHorario();
    const intervalo = setInterval(atualizarHorario, 1000);

    // Configurar listener para novas chamadas
    const handleNovaChamada = (data) => {
      console.log("Nova chamada no painel:", data);

      // Verificar se a chamada é para o mesmo paciente
      if (chamadaAtual.paciente === data.paciente) {
        return; // Não atualiza se for o mesmo paciente
      }

      // Atualizar chamada atual
      setChamadaAtual(data);

      // Adicionar ao histórico
      setHistoricoChamadas((prev) => {
        // Verificar se já existe no histórico
        const jaExiste = prev.some(
          (chamada) => chamada.paciente === data.paciente,
        );
        if (jaExiste) return prev;

        // Adicionar no início e manter apenas os 5 mais recentes
        const novoHistorico = [data, ...prev];
        return novoHistorico.slice(0, 5);
      });

      // Reproduzir som de notificação
      try {
        const audio = new Audio("/notificacao.mp3");
        audio.play();
      } catch (error) {
        console.error("Erro ao reproduzir som de notificação:", error);
      }

      // Sintetizar voz para anunciar a chamada
      setTimeout(() => {
        const texto = `Paciente ${data.paciente}, dirigir-se para ${data.local}`;
        falarTexto(texto);
      }, 1000);
    };

    socketService.on("atualizar-chamada", handleNovaChamada);

    return () => {
      clearInterval(intervalo);
      socketService.off("atualizar-chamada", handleNovaChamada);
    };
  }, [chamadaAtual.paciente]);

  // Função para síntese de voz
  function falarTexto(texto) {
    if ("speechSynthesis" in window) {
      const synth = window.speechSynthesis;
      const speech = new SpeechSynthesisUtterance(texto);

      speech.lang = "pt-BR";
      speech.rate = 0.9;
      speech.pitch = 1;
      speech.volume = 1;

      // Buscar vozes em português
      let voices = synth.getVoices();

      function definirVoz() {
        let voices = synth.getVoices();
        const ptVoice = voices.find(
          (voice) =>
            voice.lang.includes("pt") ||
            voice.name.includes("Portuguese") ||
            voice.name.includes("Brasil"),
        );

        if (ptVoice) {
          speech.voice = ptVoice;
        }

        synth.speak(speech);
      }

      // Se as vozes já estiverem carregadas
      if (voices.length) {
        definirVoz();
      } else {
        // Caso contrário, aguardar pelo evento onvoiceschanged
        synth.onvoiceschanged = definirVoz;
      }
    }
  }

  return (
    <div className={styles.painelContainer}>
      <Head>
        <title>Painel de Chamada</title>
        <meta name="description" content="Painel de chamada de pacientes" />
      </Head>

      <div className={styles.painelWrapper}>
        <div className={styles.painelContent}>
          {/* Seção principal com informações do paciente atual */}
          <div className={styles.painelMainInfo}>
            <div className={styles.pacienteInfo}>
              <h2 className={styles.pacienteLabel}>PACIENTE</h2>
              <h1 className={styles.pacienteNome}>{chamadaAtual.paciente}</h1>
              <p className={styles.profissionalLabel}>PROFISSIONAL</p>
              <p className={styles.profissionalNome}>
                {chamadaAtual.profissional}
              </p>
            </div>

            <div className={styles.localInfo}>
              <h2 className={styles.localLabel}>LOCAL</h2>
              <h1 className={styles.localNome}>{chamadaAtual.local}</h1>
            </div>
          </div>

          {/* Tabela de histórico de chamadas */}
          <div className={styles.historicoSection}>
            <h2 className={styles.historicoTitle}>ÚLTIMAS CHAMADAS</h2>
            <div className={styles.tabelaContainer}>
              <table className={styles.tabelaHistorico}>
                <thead>
                  <tr>
                    <th>PACIENTE</th>
                    <th>PROFISSIONAL</th>
                    <th>LOCAL</th>
                    <th>HORÁRIO</th>
                  </tr>
                </thead>
                <tbody>
                  {historicoChamadas.length > 0 ? (
                    historicoChamadas.map((chamada, index) => (
                      <tr key={index}>
                        <td>{chamada.paciente}</td>
                        <td>{chamada.profissional}</td>
                        <td>{chamada.local}</td>
                        <td>{chamada.horario}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className={styles.nenhumRegistro}>
                        Nenhuma chamada registrada
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer com horário */}
        <div className={styles.painelFooter}>
          <p className={styles.horarioAtual}>{horarioAtual}</p>
          <div className={styles.footerInfo}>
            <p className={styles.instituicao}>Policlínica</p>
          </div>
        </div>
      </div>

      {/* Áudio de notificação - preload */}
      <audio id="audio-alert" preload="auto">
        <source src="/notificacao.mp3" type="audio/mp3" />
        Seu navegador não suporta áudio HTML5
      </audio>
    </div>
  );
}
