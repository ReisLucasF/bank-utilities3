const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

// Configuração do servidor
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Permitir conexões de qualquer origem (ajuste conforme necessário)
    methods: ["GET", "POST"],
  },
});

// Porta do servidor
const PORT = process.env.PORT || 8001;

// Configuração dos eventos do Socket.IO
io.on("connection", (socket) => {
  console.log("Novo cliente conectado:", socket.id);

  // Evento para nova chamada de paciente
  socket.on("nova-chamada", (data) => {
    console.log("Nova chamada recebida:", data);

    // Broadcast para todos os clientes conectados
    io.emit("atualizar-chamada", data);
  });

  // Tratamento de desconexão
  socket.on("disconnect", () => {
    console.log("Cliente desconectado:", socket.id);
  });
});

// Iniciar o servidor
server.listen(PORT, () => {
  console.log(`Servidor WebSocket rodando na porta ${PORT}`);
});
