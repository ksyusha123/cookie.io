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
    const state = getCurrentState();

    if (!state) {
        return;
    }

    const {me, visible, playersCoordinates, food, leaderboard} = state;
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
    let {x, y, radius, direction, skin, username, _, partsCount} = player;
    username = username || document.getElementById('username').getAttribute('placeholder');
    const canvasX = gameCanvas.width / 2 + x - me.x;
    const canvasY = gameCanvas.height / 2 + y - me.y;

    gameContext.save();
    gameContext.translate(canvasX, canvasY);
    gameContext.rotate(direction);
    drawAsset(0, 0, skin, radius / partsCount);
    drawParts(partsCount, radius, skin);
    renderNickname(username, radius * FONT_SCALE);
    gameContext.restore();
}

function drawParts(partsCount, totalRadius, skin){
    let counter = partsCount;
    const shift = 2 * totalRadius / partsCount;
    const freePoints = [[0, shift], [0, -shift], [shift, 0], [-shift, 0]];
    let i = 0;
    const usedPoints = new Set();
    usedPoints.add([0, 0]);
    while (counter > 1) {
        counter--;
        let point = freePoints[i];
        while (usedPoints.has(point)){
            point = freePoints[++i];
        }
        const x = point[0];
        const y = point[1];
        drawAsset(x, y, skin, totalRadius / partsCount);
        processPointNeighbors(x, y, shift, freePoints, usedPoints);
        i++;
    }
}

function processPointNeighbors(x, y, shift, freePoints, usedPoints){
    const pointNeighbors = [[x, y + shift], [x, y - shift], [x + shift, y], [x - shift, y]];
    for (let e of pointNeighbors){
        if (usedPoints.has(e)){
            continue;
        }
        freePoints.push(e);
    }
    usedPoints.add([x, y]);
}

function drawAsset(x, y, skin, radius){
    gameContext.drawImage(
        getAsset(skin),
        x - radius,
        y - radius,
        radius * 2,
        radius * 2,
    );
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

function renderNickname(username, fontSize) {
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
        2 * radius,
        2 * radius
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