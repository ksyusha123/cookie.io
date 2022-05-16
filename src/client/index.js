import io from 'socket.io-client';
import {throttle} from 'throttle-debounce';
import {downloadAssets, getAsset} from "./assets";

const settings = require('../settings');

const socket = io();

await downloadAssets();


socket.on(settings.MESSAGES.GAME_UPDATE, processGameUpdate);
socket.on('disconnect', () => {
    console.log('Disconnected from server');
});

const play = (username) => socket.emit(settings.MESSAGES.JOIN, username);
const updateDirection = throttle(20, direction => {
    console.log(direction);
    socket.emit(settings.MESSAGES.INPUT, direction)
});

document.getElementById("play-button").onclick = () => {
    console.log("click!");
    play(document.getElementById("username").value);
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