import {getAsset, foodAssets} from './assets';
import {getCurrentState} from './state';
import {getMyId} from "./networking";
import {pauseSoundtrack} from "./sound";
import settings from "../settings";
import {zip} from "../utils";
import {fillRow, resizeTable} from "./tableUtils";

const ME_COLOR = '#96616B';
const OTHER_COLOR = '#508CA4';
const LIGHT_PINK = '#EEE5E9';
const LIGHT_GREY = '#888';

const PLAYER_MINIMAP_RADIUS = 6;
const GRID_STEP_SIZE = 100;
const FONT_SCALE = 2 / 7;

let mapCounter = 0;

const gameCanvas = document.getElementById('game-canvas');
const gameContext = gameCanvas.getContext('2d');

gameCanvas.width = document.documentElement.clientWidth;
gameCanvas.height = document.documentElement.clientHeight;

const mapCanvas = document.getElementById('map');
const mapContext = mapCanvas.getContext('2d');

const headMenu = document.getElementsByClassName('head-menu')[0];
const choseMenu = document.getElementsByClassName('chose-menu')[0];
const minimap = document.getElementById('map');
const sound = document.getElementById('sound');
const home = document.getElementById('home');
const leaderboard = document.getElementById('leaderboard');
const leaderboardBody = leaderboard.getElementsByTagName('tbody')[0];
const rows = leaderboardBody.getElementsByTagName('tr');
const resultsTable = document.getElementById('results');

let prevX = 0;
let prevY = 0;

let prevNetX = GRID_STEP_SIZE;
let prevNetY = GRID_STEP_SIZE;

let renderInterval = null;

function render() {
    const {me, visible, playersCoordinates, food, leaderboard} = getCurrentState();

    if (!me) {
        return;
    }

    renderBackground(me.x, me.y);
    renderPlayer(me, me);

    if (mapCounter % 5 === 0) {
        renderMiniMap(me, playersCoordinates);
    }

    mapCounter++;
    renderLeaderboard(leaderboard);
    visible.forEach(renderPlayer.bind(null, me));
    food.forEach(renderFood.bind(null, me));
}

function renderBackground(playerX, playerY) {
    gameContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    gameContext.beginPath();
    gameContext.fillStyle = LIGHT_PINK;
    gameContext.strokeStyle = LIGHT_GREY;
    gameContext.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
    drawGrid(gameContext, playerX, playerY);
    gameContext.stroke();
}

function renderPlayer(me, player) {
    const {x, y, radius, direction, skin, username} = player;
    const canvasX = gameCanvas.width / 2 + x - me.x;
    const canvasY = gameCanvas.height / 2 + y - me.y;

    gameContext.save();
    gameContext.translate(canvasX, canvasY);
    gameContext.rotate(direction);
    gameContext.drawImage(
        getAsset(skin),
        -radius,
        -radius,
        radius * 2,
        radius * 2,
    );
    renderNickname(gameContext, username, radius * FONT_SCALE);
    gameContext.restore();
}

function renderLeaderboard(leaderboard) {
    resizeTable(leaderboardBody, rows, Object.values(leaderboard).length);
    const myId = getMyId();

    for (const [row, leaderboardRow] of zip(rows, leaderboard)) {
        const {id, username, radius} = leaderboardRow;
        fillRow(row, processUsername(username), radius);

        if (myId === id) {
            row.style.fontWeight = 'bold';
        }
    }
}

function renderMiniMap(me, players) {
    mapContext.clearRect(0, 0, mapCanvas.width, mapCanvas.height);
    players.forEach(renderPlayerOnMap.bind(null, OTHER_COLOR));
    renderPlayerOnMap(ME_COLOR, me);
}

function renderNickname(context, username, fontSize) {
    gameContext.lineWidth = 1.25;
    gameContext.strokeStyle = 'white';
    gameContext.shadowColor = 'black';
    gameContext.shadowBlur = '10';
    gameContext.font = `bold ${fontSize}pt Montserrat`;
    gameContext.textBaseline = 'hanging';
    gameContext.textAlign = 'center';

    username ||= document.getElementById('username').getAttribute('placeholder');
    gameContext.strokeText(username.slice(0, 6), 0, 0, 100);
}

function renderPlayerOnMap(color, player) {
    const canvasX = player.x / settings.MAP_SIZE * mapCanvas.width;
    const canvasY = player.y / settings.MAP_SIZE * mapCanvas.height;

    renderCircleOnCanvas(mapContext, canvasX, canvasY, PLAYER_MINIMAP_RADIUS, color);
}

const foodAssetData = {};

function renderFood(me, food) {
    const {x, y, radius} = food;
    const canvasX = gameCanvas.width / 2 + x - me.x;
    const canvasY = gameCanvas.height / 2 + y - me.y;

    if (!([x, y] in foodAssetData)) {
        const randomAssetIndex = Math.getRandomIntFromInterval(0, foodAssets.length);
        foodAssetData[[x, y]] = getAsset(foodAssets[randomAssetIndex]);
    }

    gameContext.drawImage(
        foodAssetData[[x, y]],
        canvasX,
        canvasY,
        radius,
        radius
    );
}

function renderCircleOnCanvas(context, x, y, radius, color) {
    context.beginPath();
    context.ellipse(x, y, radius, radius - 3, 0, 0, 2 * Math.PI, false);
    context.fillStyle = color;
    context.strokeStyle = color;
    context.fill();
    context.stroke();
}

function drawGrid(gameContext, playerX, playerY) {
    let diffX = playerX - prevX;
    let diffY = playerY - prevY;

    for (let x = prevNetX - diffX; x < gameCanvas.width; x += 100) {
        gameContext.moveTo(x, 0);
        gameContext.lineTo(x, gameCanvas.height);
    }

    for (let y = prevNetY - diffY; y < gameCanvas.height; y += 100) {
        gameContext.moveTo(0, y);
        gameContext.lineTo(gameCanvas.width, y);
    }

    prevX = playerX;
    prevY = playerY;

    prevNetX -= diffX;
    prevNetY -= diffY
}

function drawResults(player) {
    drawResultCell('radius', Math.round(player.radius).toString());
    drawResultCell('time', Math.round(player.time / 1000).toString());
}

function drawResultCell(cellName, data) {
    const cell = document.getElementById(cellName);

    if (cell.firstChild) {
        cell.removeChild(cell.firstChild);
    }

    const textNode = document.createTextNode(data);
    cell.appendChild(textNode);
}

function processUsername(username) {
    return username !== '' ? username.slice(0, 10) : 'oreo';
}

export function startRendering() {
    renderInterval = setInterval(render, 1000 / 60);
}

export function stopRendering() {
    clearInterval(renderInterval);
}

export function removeMenu() {
    headMenu.style.display = 'none';
    choseMenu.style.display = 'none';
    document.body.style.background = 'none';

    home.style.display = 'flex';
    minimap.style.display = 'flex';
    sound.style.display = 'flex';
    gameCanvas.style.display = 'flex';
    leaderboard.style.display = 'flex';
}

export function drawResultsMenu(results) {
    pauseSoundtrack();

    home.style.display = 'none';
    sound.style.display = 'none';
    minimap.style.display = 'none';
    gameCanvas.style.display = 'none';
    leaderboard.style.display = 'none';

    headMenu.style.display = 'flex';
    choseMenu.style.display = 'flex';

    resultsTable.classList.remove('hidden');
    drawResults(results);

    document.body.style.backgroundImage = 'url(assets/other/background.png)';
    document.body.style.backgroundRepeat = 'repeat';
    document.body.style.backgroundSize = 'cover';
}