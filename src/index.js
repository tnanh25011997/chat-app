const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const Filter = require('bad-words');
const { generateMessage, generateLocationMessage } = require('./utils/messages');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 7000;
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

let count = 0;

io.on('connection', (socket) => {
    console.log('New Websocket Connection');

    //socket.emit, io.emit, socket.broadcast.emit
    //io.to().emit, socket.broadcast.to().emit

    socket.on('join', ({ username, room }) => {
        socket.join(room);
        socket.emit('message', generateMessage('Welcome!'));
        socket.broadcast.to(room).emit('message', generateMessage(`${username} has joined!`));
    });
    socket.on('sendMessage', (message, callback) => {

        const filter = new Filter();
        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed!');
        }
        io.to('123').emit('message', generateMessage(message));
        callback();
    });

    socket.on('sendLocation', (coords, callback) => {
        io.emit('locationMessage', generateLocationMessage(`https://www.google.com/maps/@=${coords.latitude},${coords.longitude}`));
        callback();
    });
    socket.on('disconnect', () => {
        io.emit('message', generateMessage('A new User has left'));
    });


});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
