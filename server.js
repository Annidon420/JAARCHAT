const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from the "public" folder
app.use(express.static('public'));

// Listen for WebSocket connections
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Broadcast messages to all connected clients
  socket.on('chat message', (data) => {
    io.emit('chat message', data); // Broadcast to everyone
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
