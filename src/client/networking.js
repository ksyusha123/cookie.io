import io from "socket.io-client";
import settings from "../settings";
import {throttle} from "throttle-debounce";
import {processGameUpdate} from "./state";
import {stopRendering, drawResultsMenu} from "./render";
import {stopCapturingInput} from "./input";


const socket = io();

socket.on(settings.MESSAGES.GAME_UPDATE, processGameUpdate);
socket.on('disconnect', () => {
    console.log('Disconnected from server');
});

socket.on(settings.MESSAGES.GAME_OVER, results => {
    console.log('Game over');
    document.body.style.backgroundImage = 'url(assets/background.png)';
    drawResultsMenu(results);
    stopRendering();
    stopCapturingInput();

});

document.addEventListener('keydown', (event) => {
    if (event.code === 'KeyZ'){
        socket.emit(settings.MESSAGES.PLAYER_SPLIT);
    }
})

export const updateDirection = throttle(20, (direction, speedMultiplier) => {
    socket.emit(settings.MESSAGES.INPUT, direction, speedMultiplier)
});

export const play = (username, skin) => socket.emit(settings.MESSAGES.JOIN, username, skin);

export const getMyId = () => socket.id;