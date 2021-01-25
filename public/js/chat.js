const socket = io();

// socket.on('countUpdated', (count) => {
//     console.log('The Count has been updated!', count);
// });

// document.querySelector('#increment').addEventListener('click', () => {
//     socket.emit('increment');
// });

socket.on('message', (message) => {
    console.log(message);
});

document.querySelector('#message-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const message = e.target.elements.message.value;
    socket.emit('sendMessage', message);
});