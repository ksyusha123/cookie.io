import {updateDirection} from "./networking";

const MAX_INSIGNIFICANT_DEVIATION = 10;
const rAF = window.mozRequestAnimationFrame || window.requestAnimationFrame;
let interval;

function onMouseInput(e) {
    handleInput(e.clientX, e.clientY);
}

function onTouchInput(e) {
    const touch = e.touches[0];
    handleInput(touch.clientX, touch.clientY);
}

function onGamepadUpdate() {
    const gp = navigator.getGamepads()[0];
    //todo add some black magic and gamepad controlling stuff
}

function handleInput(x, y) {
    const dx = x - window.innerWidth / 2;
    const dy = window.innerHeight / 2 - y;
    const deviation = Math.sqrt(dx * dx + dy * dy);

    const dir = Math.atan2(dx, dy);
    const isMoving = deviation > MAX_INSIGNIFICANT_DEVIATION;
    updateDirection(dir, isMoving);
}

export function startCapturingInput() {
    window.addEventListener('mousemove', onMouseInput);
    window.addEventListener('click', onMouseInput);
    window.addEventListener('touchstart', onTouchInput);
    window.addEventListener('touchmove', onTouchInput);

    window.addEventListener('gamepadconnected', _ => {
        interval = setInterval(() => rAF(onGamepadUpdate), 150);
    });
    window.addEventListener('gamepaddisconnected', _ => clearInterval(interval));
}

export function stopCapturingInput() {
    clearInterval(interval);
    window.removeEventListener('mousemove', onMouseInput);
    window.removeEventListener('click', onMouseInput);
    window.removeEventListener('touchstart', onTouchInput);
    window.removeEventListener('touchmove', onTouchInput);
}