const socket = io();

//Elements
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $sendLocationButton = document.querySelector('#send-location');
const $messages = document.querySelector('#messages')

//Template
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML;


//Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

socket.on('message', (message) => {
    console.log(message);
    const html = Mustache.render(messageTemplate, {
        createdAt: moment(message.createdAt).format('h:mm a'),
        message: message.text
    });
    $messages.insertAdjacentHTML('beforeend', html);
});

socket.on('locationMessage', (message) => {
    console.log(message);
    const html = Mustache.render(locationMessageTemplate, {
        createdAt: moment(message.createdAt).format('h:mm a'),
        url: message.url
    });
    $messages.insertAdjacentHTML('beforeend', html);
});

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    //disable the form
    $messageFormButton.setAttribute('disabled', 'disabled');


    const message = e.target.elements.message.value;
    socket.emit('sendMessage', message, (error) => {
        //enable
        $messageFormButton.removeAttribute('disabled');
        $messageFormInput.value = '';
        $messageFormInput.focus();


        if (error) {
            return console.log(error);
        }
        console.log('Message delivered!');
    });
});

$sendLocationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser');
    }

    $sendLocationButton.setAttribute('disabled', 'disabled');

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit(('sendLocation'), {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            $sendLocationButton.removeAttribute('disabled', 'disabled');
            console.log('Location Shared');
        });
    });
});

socket.emit('join', { username, room });