const { Server } = require('socket.io');

let io;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('joinRoom', (userId) => {
      console.log(`User ${userId} joined room`);
      socket.join(userId);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io is not initialized. Please call initializeSocket first.");
  }
  return io;
};

module.exports = { initializeSocket, getIO };
