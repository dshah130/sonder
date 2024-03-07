import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';


import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);





//Creating the servers
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Socket.io connections
io.on('connection', (socket) => {
    console.log('A user connected');
    
    // Handle events (e.g., chat messages, game events) using Socket.io
    
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});


//starting up server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});


