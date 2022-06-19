import {updateDirection} from "./networking";

const MIN_SPEED_DEVIATION_FOR_NON_GAMEPAD = 25;
const MAX_SPEED_DEVIATION_FOR_NON_GAMEPAD = 150;
const MIN_SPEED_DEVIATION_FOR_GAMEPAD = 0.1;
const MAX_SPEED_DEVIATION_FOR_GAMEPAD = 1;

const animationFrame = window.mozRequestAnimationFrame || window.requestAnimationFrame;

let interval;
let isUsingGamepad = false;

function onMouseInput(e) {
    handleNonGamepadInput(e.clientX, e.clientY);
}

function onTouchInput(e) {
    const touch = e.touches[0];
    handleNonGamepadInput(touch.clientX, touch.clientY);
}

function onGamepadUpdate() {
    const {dx, dy, speedMultiplier} = getMovementInfoFromGamepad();
    calculateDirectionAndUpdate(dx, dy, speedMultiplier);
}

function handleNonGamepadInput(x, y) {
    if (!isUsingGamepad) {
        const dx = x - window.innerWidth / 2;
        const dy = y - window.innerHeight / 2;
        const deviationDistance = Math.sqrt(dx * dx + dy * dy);
        const speedMultiplier = Math.scaleOntoInterval(deviationDistance,
            MIN_SPEED_DEVIATION_FOR_NON_GAMEPAD, MAX_SPEED_DEVIATION_FOR_NON_GAMEPAD,
            0, 1);
        calculateDirectionAndUpdate(dx, dy, speedMultiplier);
    }
}

function getMovementInfoFromGamepad() {
    const gp = navigator.getGamepads()[0];
    const diff = {dx: gp.axes[0], dy: gp.axes[1]};
    const deviationDistance = Math.sqrt(diff.dx * diff.dx + diff.dy * diff.dy);

    diff.speedMultiplier = Math.scaleOntoInterval(deviationDistance,
        MIN_SPEED_DEVIATION_FOR_GAMEPAD, MAX_SPEED_DEVIATION_FOR_GAMEPAD,
        0, 1);

    return diff;
}

function calculateDirectionAndUpdate(dx, dy, speedMultiplier) {
    const dir = Math.atan2(dx, -dy);
    updateDirection(dir, speedMultiplier);
}

export function startCapturingInput() {
    window.addEventListener('mousemove', onMouseInput);
    window.addEventListener('click', onMouseInput);
    window.addEventListener('touchstart', onTouchInput);
    window.addEventListener('touchmove', onTouchInput);

    window.addEventListener('gamepadconnected', _ => {
        isUsingGamepad = true;
        interval = setInterval(() => animationFrame(onGamepadUpdate), 150);
    });

    window.addEventListener('gamepaddisconnected', _ => {
        isUsingGamepad = false;
        clearInterval(interval);
    });
}

export function stopCapturingInput() {
    clearInterval(interval);
    window.removeEventListener('mousemove', onMouseInput);
    window.removeEventListener('click', onMouseInput);
    window.removeEventListener('touchstart', onTouchInput);
    window.removeEventListener('touchmove', onTouchInput);
}