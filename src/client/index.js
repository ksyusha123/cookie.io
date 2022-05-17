import {throttle} from 'throttle-debounce';
import {downloadAssets, getAsset} from "./assets";
import {play, updateDirection} from "./networking";

const settings = require('../settings');

await downloadAssets();


document.getElementById("play-button").onclick = () => {
    console.log("click!");
    play(document.getElementById("username").value);
    document.getElementsByClassName('menu')[0].style.display = 'none';
    document.getElementsByClassName('chose-menu')[0].style.display = 'none';
    startCapturingInput();
};

document.getElementById("select-skin-button").onclick = () => {
    console.log("click on select button");
    document.getElementsByClassName('menu')[0].style.display = 'none';
    document.getElementsByClassName('chose-menu')[0].style.display = 'none';
    document.getElementById("modal").style.display = 'flex';
};

document.getElementById("modal__close-button").onclick = () => {
    console.log("click on back select button");
    document.getElementsByClassName('menu')[0].style.display = 'flex';
    document.getElementsByClassName('chose-menu')[0].style.display = 'flex';
    document.getElementById("modal").style.display = 'none';
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
