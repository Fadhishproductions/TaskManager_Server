const http = require('http');
const { Server } = require('socket.io');

// Create a basic HTTP server
 const socketServer = http.createServer();

// Attach Socket.IO to this server and specify the CORS settings
const io = new Server(socketServer, {
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ['GET', 'POST'],
        credentials: true,
      },
});

// Handle Socket.IO connections
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('joinRoom', (userId) => {
        console.log(`User ${userId} joined room`);
        socket.join(userId);
    });

    // // Emit events to all other sockets except the one that triggered it
    // socket.on('taskCreated', (task) => {
    //     socket.broadcast.to(task.userId).emit('taskCreated', task);
    // });

    // socket.on('taskUpdated', (updatedTask) => {
    //     socket.broadcast.to(updatedTask.userId).emit('taskUpdated', updatedTask);
    // });

    // socket.on('taskDeleted', (taskId, userId) => {
    //     socket.broadcast.to(userId).emit('taskDeleted', taskId);
    // });

    // socket.on('taskCompleted', (completedTask) => {
    //     socket.broadcast.to(completedTask.userId).emit('taskCompleted', completedTask);
    // });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});
  
  


module.exports = {io,socketServer};
