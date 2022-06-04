import {downloadAssets} from "./assets";
import {play} from "./networking";
import {startCapturingInput} from "./input";
import {startRendering} from "./render";

const settings = require('../settings');

await downloadAssets();

let skin = 'Zhenya.png';

const headMenu = document.getElementsByClassName('head-menu')[0];
const choseMenu = document.getElementsByClassName('chose-menu')[0];

document.getElementById("play-button").addEventListener('click', () => {
    play(document.getElementById("username").value, skin);
    headMenu.style.display = 'none';
    choseMenu.style.display = 'none';
    document.body.style.background = 'none';
    document.getElementById('game-canvas').style.display = 'flex';
    startCapturingInput();
    startRendering();
});

document.getElementById("select-skin-button").addEventListener('click', () => {
    headMenu.style.display = 'none';
    choseMenu.style.display = 'none';
    document.getElementById("modal").style.display = 'flex';
});

document.getElementById("modal__close-button").addEventListener('click', () => {
    console.log("click on back select button");
    headMenu.style.display = 'flex';
    choseMenu.style.display = 'flex';
    document.getElementById("modal").style.display = 'none';
});


