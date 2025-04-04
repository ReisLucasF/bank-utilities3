// pages/api/socket.js
import { Server } from "socket.io";

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log("Socket já está inicializado");
    res.end();
    return;
  }

  const io = new Server(res.socket.server);
  res.socket.server.io = io;

  io.on("connection", (socket) => {
    console.log("Cliente conectado:", socket.id);

    socket.on("disconnect", () => {
      console.log("Cliente desconectado:", socket.id);
    });

    socket.on("nova-chamada", (data) => {
      console.log("Nova chamada recebida:", data);
      // Reenviar para todos os clientes
      io.emit("atualizar-chamada", data);
    });
  });

  console.log("Iniciando Socket.IO");
  res.end();
};

export default SocketHandler;
