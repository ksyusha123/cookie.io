import {downloadAssets, getPersonAsset, downloadSkinMenuAssets, updateSkinButton} from "./assets";
import {play} from "./networking";
import {startCapturingInput} from "./input";
import {startRendering, removeMenu} from "./render";
import addPrototypes from "../utils";
import {playOrResumeSoundtrack, createSoundtrack, muteSoundtrack, unmuteSoundtrack} from "./sound";

const DEFAULT_SKIN = 'Zhenya.png';
let SOUND_COUNTER = 0;

addPrototypes();
await downloadAssets();

let skin = DEFAULT_SKIN;
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
});

document.getElementById("sound").addEventListener('click', () => {
    const sound = document.getElementById("sound");
    if (SOUND_COUNTER % 2 === 0){
        sound.style.backgroundImage = 'url(/assets/mute.png)';
        muteSoundtrack();
    }
    else{
        sound.style.backgroundImage = 'url(/assets/volume.png)';
        unmuteSoundtrack();
    }
    SOUND_COUNTER += 1;
});

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

const prefixLen = 4;
for (let e of document.getElementById('modal-skins').childNodes) {
    if (e.nodeType !== 1)
        continue;
    e.addEventListener('click', () => {
        skin = getPersonAsset(Number(e.id.slice(prefixLen)) - 1);
    });
}
