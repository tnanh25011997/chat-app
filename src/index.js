const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 7000;
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

let count = 0;

io.on('connection', (socket) => {
    console.log('New Websocket Connection');
    socket.emit('message', 'welcome');
    socket.broadcast.emit('message', 'A new User has joined');

    socket.on('sendMessage', (message) => {
        io.emit('message', message);
    });

    // socket.emit('countUpdated', count);
    // socket.on('increment', () => {
    //     count++;
    //     //socket.emit('countUpdated', count);
    //     io.emit('countUpdated', count);
    // })
    socket.on('disconnect', () => {
        io.emit('message', 'A new User has left')
    });

});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
