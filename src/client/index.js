import io from 'socket.io-client';
import { throttle } from 'throttle-debounce';

const socket = io();

const play = (username) => socket.emit('join', username);
const updateDirection = throttle(100, direction => socket.emit('update', direction));

document.getElementById("play-button").onclick = () => {
    console.log(1);
    play(document.getElementById("username").value);
    startCapturingInput()
};

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