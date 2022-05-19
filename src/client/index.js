import {downloadAssets} from "./assets";
import {play} from "./networking";
import {startCapturingInput} from "./input";
import {startRendering} from "./render";

const settings = require('../settings');

await downloadAssets();

document.getElementById("play-button").onclick = () => {
    console.log("click!");
    play(document.getElementById("username").value);
    document.getElementsByClassName('menu')[0].style.display = 'none';
    document.getElementsByClassName('chose-menu')[0].style.display = 'none';
    document.body.style.background = 'none';
    document.getElementById('game-canvas').style.display = 'flex';
    startCapturingInput();
    startRendering();
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


