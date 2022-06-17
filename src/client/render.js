import {getAsset} from './assets';
import {getCurrentState} from './state';
import {getMyId} from "./networking";
import settings from "../settings";

const ME_COLOR = 'red';
const OTHER_COLOR = 'blue';
const FOOD_COLOR = 'green';
const PLAYER_MINIMAP_RADIUS = 5;

const gameCanvas = document.getElementById('game-canvas');
const gameContext = gameCanvas.getContext('2d');

gameCanvas.width = document.documentElement.clientWidth;
gameCanvas.height = document.documentElement.clientHeight;

let prevX = 0;
let prevY = 0;

let prevNetX = 100;
let prevNetY = 100;

function render() {
    const {me, visible, playersCoordinates, food, leaderboard} = getCurrentState();
    if (!me) {
        return;
    }

    renderBackground(me.x, me.y);

    renderPlayer(me, me);
    visible.forEach(renderPlayer.bind(null, me));
    food.forEach(renderFood.bind(null, me));

    renderMiniMap(me, playersCoordinates);

    renderLeaderboard(leaderboard);
}

function renderLeaderboard(leaderboard) {
    const leaderboardBody = document.getElementById('leaderboard').getElementsByTagName('tbody')[0];
    const rows = leaderboardBody.getElementsByTagName('tr');
    const myId = getMyId();

    clearTable(leaderboardBody, Object.values(leaderboard).length, rows.length);

    const newRowsCount = settings.TOP_COUNT - rows.length;
    enlargeTable(leaderboardBody, newRowsCount);

    for (let i = 0; i < leaderboard.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        cells[0].innerHTML = processUsername(leaderboard[i].username);
        cells[1].innerHTML = Math.round(leaderboard[i].radius).toString();
        rows[i].style.fontWeight = myId === leaderboard[i].id ? 'bold' : null;
    }
}

function enlargeTable(table, rowsCount) {
    for (let i = 0; i < rowsCount; i++) {
        const row = table.insertRow();
        const usernameCell = row.insertCell();
        const radiusCell = row.insertCell();
        const usernameTextNode = document.createTextNode('');
        const radiusTextNode = document.createTextNode('');
        usernameCell.appendChild(usernameTextNode);
        radiusCell.appendChild(radiusTextNode);
    }
}

function clearTable(table, actualRowsCount, rowsCount) {
    for (let i = actualRowsCount; i < rowsCount; i++) {
        table.deleteRow(actualRowsCount);
    }
}

function processUsername(username) {
    return username !== '' ? username.slice(0, 10) : 'oreo';
}

function renderBackground(x, y) {
    gameContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    gameContext.beginPath();
    gameContext.fillStyle = "#EEE5E9";
    gameContext.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

    let diffX = x - prevX;
    let diffY = y - prevY;

    prevX = x;
    prevY = y;

    for (let x = prevNetX - diffX; x < gameCanvas.width; x += 100) {
        gameContext.moveTo(x, 0);
        gameContext.lineTo(x, gameCanvas.height);
    }

    for (let y = prevNetY - diffY; y < gameCanvas.height; y += 100) {
        gameContext.moveTo(0, y);
        gameContext.lineTo(gameCanvas.width, y);
    }

    prevNetX -= diffX;
    prevNetY -= diffY

    gameContext.strokeStyle = "#888";
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
    let counter = partsCount
    const shift = 2 * radius / partsCount;
    const freePoints = [[0, shift], [0, -shift], [shift, 0], [-shift, 0]];
    let i = 0;
    const usedPoints = {0: new Set()};
    const contains = (point) => point[0] in usedPoints && point[1] in usedPoints[point[0]]
    usedPoints[0].add(0);
    console.log(usedPoints);
    while (counter > 1) {
        console.log(counter);
        counter--;
        let point = freePoints[i];
        while (contains(point)){
            point = freePoints[++i];
        }
        const x = point[0];
        const y = point[1];
        drawAsset(x, y, skin, radius / partsCount);
        const candidateNeighbors = [[x, y + shift], [x, y - shift], [x + shift, y], [x - shift, y]];
        for (let e of candidateNeighbors){
            if (contains(e)){
                continue;
            }
            freePoints.push(e);
        }
        if (x in usedPoints){
            usedPoints[x].add(y);
        } else {
            usedPoints[x] = new Set();
            usedPoints[x].add(y);
        }

        i++;
    }

    renderNickname(username, radius * 2 / 7);
    gameContext.restore();
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

function renderNickname(username, fontSize){
    gameContext.lineWidth = 1.25;
    gameContext.strokeStyle = '#ffffff';
    gameContext.shadowColor = '#000000';
    gameContext.shadowBlur = '10';
    gameContext.font = `bold ${fontSize}pt Montserrat`;
    gameContext.textBaseline = 'hanging';
    gameContext.textAlign = 'center';
    gameContext.strokeText(
        username.slice(0, 6),
        0,
        0,
        100
    );
}

function renderFood(me, food) {
    const {x, y, radius} = food;
    const canvasX = gameCanvas.width / 2 + x - me.x;
    const canvasY = gameCanvas.height / 2 + y - me.y;

    renderCircleOnCanvas(gameContext, canvasX, canvasY, radius, FOOD_COLOR);
}

let renderInterval = null;

export function startRendering() {
    renderInterval = setInterval(render, 1000 / 60);
}

export function stopRendering() {
    clearInterval(renderInterval);
}

export function removeMenu() {
    const headMenu = document.getElementsByClassName('head-menu')[0];
    const choseMenu = document.getElementsByClassName('chose-menu')[0];
    const minimap = document.getElementById('map');
    minimap.style.display = 'flex';
    headMenu.style.display = 'none';
    choseMenu.style.display = 'none';
    document.body.style.background = 'none';
    document.getElementById('game-canvas').style.display = 'flex';
    document.getElementById('leaderboard').style.display = 'flex';
}

export function drawResultsMenu(results) {
    const headMenu = document.getElementsByClassName('head-menu')[0];
    const choseMenu = document.getElementsByClassName('chose-menu')[0];
    const minimap = document.getElementById('map');
    minimap.style.display = 'none';
    headMenu.style.display = 'flex';
    choseMenu.style.display = 'flex';
    const resultsTable = document.getElementById('results');
    resultsTable.classList.remove('hidden');
    drawResults(results);
    document.body.style.background = 'url(assets/background.png) repeat cover';
    document.getElementById('game-canvas').style.display = 'none';
    document.getElementById('leaderboard').style.display = 'none';
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

const mapCanvas = document.getElementById('map');
const mapContext = mapCanvas.getContext('2d');

function renderPlayerOnMap(color, player) {
    const canvasX = player.x / settings.MAP_SIZE * mapCanvas.width;
    const canvasY = player.y / settings.MAP_SIZE * mapCanvas.height;

    renderCircleOnCanvas(mapContext, canvasX, canvasY, PLAYER_MINIMAP_RADIUS, color);
}

function renderCircleOnCanvas(context, x, y, radius, color) {
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI, false);
    context.fillStyle = color;
    context.fill();
    context.stroke();
}

function renderMiniMap(me, players) {
    mapContext.clearRect(0, 0, mapCanvas.width, mapCanvas.height);
    players.forEach(renderPlayerOnMap.bind(null, OTHER_COLOR));
    renderPlayerOnMap(ME_COLOR, me);
}
