const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '../public')));

let userCount = 0;

io.on('connection', (socket) => {
    userCount++;
    io.emit('userJoined', { count: userCount });
    console.log(`User connected. Total users: ${userCount}`);

    socket.on('message', (data) => {
        console.log('Message received:', data);
        io.emit('message', data);
    });

    socket.on('disconnect', () => {
        userCount--;
        io.emit('userLeft', { count: userCount });
        console.log(`User disconnected. Total users: ${userCount}`);
    });
});

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
