import { createContext, useContext, useState, useEffect } from "react";
import socketService from "../services/socketService";

// Função para síntese de voz
function falarTexto(texto) {
  if ("speechSynthesis" in window) {
    const synth = window.speechSynthesis;
    const speech = new SpeechSynthesisUtterance(texto);

    speech.lang = "pt-BR";
    speech.rate = 0.9;
    speech.pitch = 1;
    speech.volume = 1;

    // Tentar encontrar uma voz em português
    let voices = synth.getVoices();

    function definirVoz() {
      let voices = synth.getVoices();
      // Buscar vozes em português
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

const NotificacaoContext = createContext();

export function NotificacaoProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Conectar ao Socket.IO e configurar listener para novas chamadas
    socketService.connect();

    const handleNovaNotificacao = (data) => {
      console.log("Nova notificação recebida:", data);

      // Adicionar notificação à lista
      const novaNotificacao = {
        id: Date.now(),
        titulo: "Nova Chamada",
        mensagem: `Paciente ${data.paciente} para ${data.local}`,
        hora: new Date().toLocaleTimeString(),
        lida: false,
      };

      setNotifications((prev) => [novaNotificacao, ...prev]);

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

    socketService.on("atualizar-chamada", handleNovaNotificacao);

    return () => {
      socketService.off("atualizar-chamada", handleNovaNotificacao);
    };
  }, []);

  // Marcar todas as notificações como lidas
  const marcarTodasComoLidas = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, lida: true })));
  };

  // Limpar todas as notificações
  const limparNotificacoes = () => {
    setNotifications([]);
  };

  const value = {
    notifications,
    marcarTodasComoLidas,
    limparNotificacoes,
  };

  return (
    <NotificacaoContext.Provider value={value}>
      {children}
    </NotificacaoContext.Provider>
  );
}

export function useNotificacoes() {
  return useContext(NotificacaoContext);
}
