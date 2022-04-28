import io from 'socket.io-client';
import { throttle } from 'throttle-debounce';

const socket = io();

const play = (username) => socket.emit('join', username);
export const updateDirection = throttle(100, direction => socket.emit('update', direction));

document.getElementById("play-button").onclick = () => {
    console.log(1);
    return play(document.getElementById("username").value);
};