// services/socketService.js
import { io } from "socket.io-client";

// Classe para gerenciar a conexão com o Socket.IO
class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = {};
    this.isConnected = false;
    this.serverUrl = "http://localhost:8001";
  }

  // Inicializar a conexão
  connect() {
    if (this.socket) return;

    this.socket = io(this.serverUrl, {
      transports: ["websocket"],
      reconnectionAttempts: 5,
    });

    this.socket.on("connect", () => {
      console.log("Conectado ao servidor Socket.IO");
      this.isConnected = true;
    });

    this.socket.on("disconnect", () => {
      console.log("Desconectado do servidor Socket.IO");
      this.isConnected = false;
    });

    this.socket.on("connect_error", (err) => {
      console.error("Erro de conexão Socket.IO:", err);
    });

    // Configurar listener para chamadas de pacientes
    this.socket.on("atualizar-chamada", (data) => {
      console.log("Nova chamada recebida:", data);

      // Notificar todos os listeners registrados
      if (this.listeners["atualizar-chamada"]) {
        this.listeners["atualizar-chamada"].forEach((callback) =>
          callback(data),
        );
      }
    });
  }

  // Registrar um listener para um evento
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);

    // Se for a primeira inscrição, iniciar a conexão
    if (!this.socket) {
      this.connect();
    }
  }

  // Remover um listener
  off(event, callback) {
    if (!this.listeners[event]) return;

    this.listeners[event] = this.listeners[event].filter(
      (cb) => cb !== callback,
    );
  }

  // Emitir um evento
  emit(event, data) {
    if (!this.socket || !this.isConnected) {
      console.warn("Socket não está conectado. Tentando reconectar...");
      this.connect();
      // Colocar na fila para tentar novamente quando conectar
      this.socket.once("connect", () => {
        this.socket.emit(event, data);
      });
      return;
    }

    this.socket.emit(event, data);
  }

  // Chamar um paciente
  chamarPaciente(dadosPaciente) {
    const horarioAtual = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const chamadaData = {
      paciente: dadosPaciente.nome,
      profissional: dadosPaciente.profissional,
      local: dadosPaciente.local,
      horario: horarioAtual,
    };

    console.log("Emitindo chamada:", chamadaData);
    this.emit("nova-chamada", chamadaData);
  }

  // Desconectar o socket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }
}

// Cria uma instância singleton do serviço
const socketService = new SocketService();

export default socketService;
