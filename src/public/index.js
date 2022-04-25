// import {play} from "./client";

const play = (username) => socket.emit('join', username);

document.getElementById("play-button").onclick = () => {
    console.log(1);
    return play(document.getElementById("username").value);
};