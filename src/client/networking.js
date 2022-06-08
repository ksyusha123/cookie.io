import io from "socket.io-client";
import settings from "../settings";
import {throttle} from "throttle-debounce";
import {processGameUpdate} from "./state";
import {stopRendering} from "./render";
import {stopCapturingInput} from "./input";


const socket = io();

socket.on(settings.MESSAGES.GAME_UPDATE, processGameUpdate);
socket.on('disconnect', () => {
    console.log('Disconnected from server');
});
socket.on(settings.MESSAGES.GAME_OVER, () => {
    console.log('Game over');
    stopRendering();
    stopCapturingInput();
});

// const connectedPromise = new Promise(resolve => {
//     socket.on('connect', () => {
//         console.log('Connected to server!');
//         resolve();
//     });
// });
//
// export const connect = async onGameOver => {
//     await connectedPromise;
//     socket.on(settings.MESSAGES.GAME_UPDATE, processGameUpdate);
//
// };

export const updateDirection = throttle(20, direction => {
    socket.emit(settings.MESSAGES.INPUT, direction)
});

export const play = (username, skin) => socket.emit(settings.MESSAGES.JOIN, username, skin);

export const getMyId = () => socket.id;