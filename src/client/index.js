import io from 'socket.io-client';
import { throttle } from 'throttle-debounce';

const settings = require('../settings');

const socket = io();

// const connectedPromise = new Promise(resolve => {
//     socket.on('connect', () => {
//         console.log('Connected to server!');
//         resolve();
//     });
// });

// connectedPromise.then(() => {
    socket.on(settings.MESSAGES.GAME_UPDATE, processGameUpdate);
    socket.on('disconnect', () => {
        console.log('Disconnected from server');
    });
// });

const play = (username, skin) => socket.emit(settings.MESSAGES.JOIN, username, skin);
const updateDirection = throttle(20, direction => {
    console.log(direction);
    socket.emit(settings.MESSAGES.INPUT, direction)
});

let skin = '';

document.getElementById("play-button").onclick = () => {
    play(document.getElementById("username").value, skin);
    startCapturingInput();
};


function processGameUpdate(update){
    console.log('process game upd');
    // todo
}

function onMouseInput(e) {
    handleInput(e.clientX, e.clientY);
}

function onTouchInput(e) {
    const touch = e.touches[0];
    handleInput(touch.clientX, touch.clientY);
}

function handleInput(x, y) {
    const dir = Math.atan2(x - window.innerWidth / 2, window.innerHeight / 2 - y);
    console.log(dir);
    updateDirection(dir);
}

function startCapturingInput() {
    window.addEventListener('mousemove', onMouseInput);
    window.addEventListener('click', onMouseInput);
    window.addEventListener('touchstart', onTouchInput);
    window.addEventListener('touchmove', onTouchInput);
}

function stopCapturingInput() {
    window.removeEventListener('mousemove', onMouseInput);
    window.removeEventListener('click', onMouseInput);
    window.removeEventListener('touchstart', onTouchInput);
    window.removeEventListener('touchmove', onTouchInput);
}