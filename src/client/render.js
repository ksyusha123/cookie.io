import { getAsset } from './assets';
import { getCurrentState } from './state';

const settings = require('../settings');
const {MAP_SIZE} = settings;

const canvas = document.getElementById('game-canvas');
const context = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const PLAYER_RADIUS = 50;


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
    const backgroundX = MAP_SIZE / 2 - x + canvas.width / 2;
    const backgroundY = MAP_SIZE / 2 - y + canvas.height / 2;
    const backgroundGradient = context.createRadialGradient(
        backgroundX,
        backgroundY,
        MAP_SIZE / 10,
        backgroundX,
        backgroundY,
        MAP_SIZE / 2,
    );
    backgroundGradient.addColorStop(1, '#EEE5E9');
    context.fillStyle = backgroundGradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
    console.log('load game background');

    for (let x = 0.5; x < canvas.width; x += 10) {
        context.moveTo(x, 0);
        context.lineTo(x, canvas.height);
    }

    for (let y = 0.5; y < canvas.height; y += 10) {
        context.moveTo(0, y);
        context.lineTo(canvas.width, y);
    }

    context.strokeStyle = "#888";
    context.stroke();
}

function renderPlayer(me, player) {
    const { x, y, direction } = player;
    const canvasX = canvas.width / 2 + x - me.x;
    const canvasY = canvas.height / 2 + y - me.y;

    context.save();
    context.translate(canvasX, canvasY);
    context.rotate(direction);
    context.drawImage(
        getAsset('Zhenya.png'),
        -PLAYER_RADIUS,
        -PLAYER_RADIUS,
        PLAYER_RADIUS * 2,
        PLAYER_RADIUS * 2,
    );
    context.restore();

    // Draw health bar
    context.fillStyle = 'white';
    context.fillRect(
        canvasX - PLAYER_RADIUS,
        canvasY + PLAYER_RADIUS + 8,
        PLAYER_RADIUS * 2,
        2,
    );
    context.fillStyle = 'red';
    context.fillRect(
        canvasX - PLAYER_RADIUS + PLAYER_RADIUS * 2 * player.radius / 10,
        canvasY + PLAYER_RADIUS + 8,
        PLAYER_RADIUS * 2 * (1 - player.radius / 10),
        2,
    );
}

let renderInterval = null;

export function startRendering() {
    renderInterval = setInterval(render, 1000 / 60);
}
export function stopRendering() {
    clearInterval(renderInterval);
}