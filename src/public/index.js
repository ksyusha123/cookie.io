// import {throttle} from "throttle-debounce";

// const updateDirection = throttle(100, (direction) => socket.emit('update', direction));
const play = (username) => socket.emit('join', username);

document.getElementById("play-button").onclick = () => {
    console.log(1);
    return play(document.getElementById("username").value);
};