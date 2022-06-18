import {soundManager} from "soundmanager2";


const soundtrackOptions = {
    onfinish: playOrResumeSoundtrack
};

export function createSoundtrack() {
    soundManager.createSound({
        id: 'soundtrack',
        url: './audio/cookie-io_soundtrack.mp3',
    });
}

export function playOrResumeSoundtrack() {
    const soundtrack = soundManager.getSoundById('soundtrack');
    if (soundtrack.paused) {
        soundManager.resume('soundtrack', soundtrackOptions);
    } else {
        soundManager.play('soundtrack', soundtrackOptions);
    }
}

export function pauseSoundtrack() {
    soundManager.pause('soundtrack');
}

export function muteSoundtrack() {
    soundManager.mute('soundtrack');
}

export function unmuteSoundtrack() {
    soundManager.unmute('soundtrack');
}