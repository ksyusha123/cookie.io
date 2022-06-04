import {downloadAssets} from "./assets";
import {play} from "./networking";
import {startCapturingInput} from "./input";
import {startRendering} from "./render";

const settings = require('../settings');

await downloadAssets();

let skin = 'Zhenya.png';

document.getElementById("play-button").addEventListener('click', () => {
    play(document.getElementById("username").value, skin);
    document.getElementsByClassName('menu')[0].style.display = 'none';
    document.getElementsByClassName('chose-menu')[0].style.display = 'none';
    document.body.style.background = 'none';
    document.getElementById('game-canvas').style.display = 'flex';
    document.getElementById('leaderboard').style.display = 'flex';
    startCapturingInput();
    startRendering();
});

document.getElementById("select-skin-button").addEventListener('click', () => {
    document.getElementsByClassName('menu')[0].style.display = 'none';
    document.getElementsByClassName('chose-menu')[0].style.display = 'none';
    document.getElementById("modal").style.display = 'flex';
});

document.getElementById("modal__close-button").addEventListener('click', () => {
    console.log("click on back select button");
    document.getElementsByClassName('menu')[0].style.display = 'flex';
    document.getElementsByClassName('chose-menu')[0].style.display = 'flex';
    document.getElementById("modal").style.display = 'none';
});


