import {downloadAssets, getPersonAsset, downloadSkinMenuAssets, updateSkinButton} from "./assets";
import {play} from "./networking";
import {startCapturingInput} from "./input";
import {startRendering, removeMenu, drawResultsMenu} from "./render";
import {addPrototypes} from "../utils";
import {playOrResumeSoundtrack, createSoundtrack, muteSoundtrack, unmuteSoundtrack} from "./sound";
import {getCurrentState} from "./state";

const DEFAULT_SKIN = 'Zhenya.png';
const PREFIX_LEN = 4;
let soundCounter = 0;
let skin = DEFAULT_SKIN;

addPrototypes();
await downloadAssets();
updateSkinButton(skin);

const headMenu = document.getElementsByClassName('head-menu')[0];
const choseMenu = document.getElementsByClassName('chose-menu')[0];

createSoundtrack();

document.getElementById("play-button").addEventListener('click', () => {
    play(document.getElementById("username").value, skin);
    removeMenu();
    startCapturingInput();
    startRendering();
    playOrResumeSoundtrack();
    muteSoundtrack();
});

document.getElementById("sound").addEventListener('click', () => {
    const sound = document.getElementById("sound");

    if (soundCounter % 2 === 1) {
        sound.style.backgroundImage = 'url(/assets/other/mute.png)';
        muteSoundtrack();
    } else {
        sound.style.backgroundImage = 'url(/assets/other/volume.png)';
        unmuteSoundtrack();
    }

    soundCounter += 1;
});

document.getElementById("home").addEventListener('click', () => {
    const currentState = getCurrentState();
    const results = {
        radius: currentState.me.radius,
        time: currentState.me.time,
    };
    drawResultsMenu(results);
})

document.getElementById("select-skin-button").addEventListener('click', () => {
    headMenu.style.display = 'none';
    choseMenu.style.display = 'none';
    downloadSkinMenuAssets();
    document.getElementById("modal").style.display = 'flex';
});

document.getElementById("modal__close-button").addEventListener('click', () => {
    console.log("click on back select button");
    headMenu.style.display = 'flex';
    choseMenu.style.display = 'flex';
    document.getElementById("modal").style.display = 'none';
    updateSkinButton(skin);
});

for (let e of document.getElementById('modal-skins').childNodes) {
    if (e.nodeType !== 1)
        continue;

    e.addEventListener('click', () => {
        skin = getPersonAsset(Number(e.id.slice(PREFIX_LEN)) - 1);
    });
}
