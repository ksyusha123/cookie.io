import { getAsset } from './assets';
import { getCurrentState } from './state';

const settings = require('../settings');
const {PLAYER_RADIUS} = settings;

const canvas = document.getElementById('game-canvas');
const context = canvas.getContext('2d');

canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;

let prevX = 0;
let prevY = 0;

let prevNetX = 100;
let prevNetY = 100;

function render() {
    const { me, others } = getCurrentState();
    if (!me) {
        return;
    }

    renderBackground(me.x, me.y);

    renderPlayer(me, me);
    others.forEach(renderPlayer.bind(null, me));
}

function renderBackground(x, y) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.beginPath();
    context.fillStyle = "#EEE5E9";
    context.fillRect(0, 0, canvas.width, canvas.height);

    let diffX = x - prevX;
    let diffY = y - prevY;

    prevX = x;
    prevY = y;

    for (let x = prevNetX - diffX; x < canvas.width; x += 100) {
        context.moveTo(x, 0);
        context.lineTo(x, canvas.height);
    }

    for (let y = prevNetY - diffY; y < canvas.height; y += 100) {
        context.moveTo(0, y);
        context.lineTo(canvas.width, y);
    }

    prevNetX -= diffX;
    prevNetY -= diffY

    context.strokeStyle = "#888";
    context.stroke();
}

function renderPlayer(me, player) {
    const { x, y, direction, skin } = player;
    const canvasX = canvas.width / 2 + x - me.x;
    const canvasY = canvas.height / 2 + y - me.y;

    context.save();
    context.translate(canvasX, canvasY);
    context.rotate(direction);
    context.drawImage(
        getAsset(skin),
        -PLAYER_RADIUS,
        -PLAYER_RADIUS,
        PLAYER_RADIUS * 2,
        PLAYER_RADIUS * 2,
    );
    context.restore();
}

let renderInterval = null;

export function startRendering() {
    renderInterval = setInterval(render, 1000 / 60);
}
export function stopRendering() {
    clearInterval(renderInterval);
}