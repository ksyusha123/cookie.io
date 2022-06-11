import {getAsset} from './assets';
import {getCurrentState} from './state';
import {getMyId} from "./networking";
import settings from "../settings";

const canvas = document.getElementById('game-canvas');
const context = canvas.getContext('2d');

canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;

let prevX = 0;
let prevY = 0;

let prevNetX = 100;
let prevNetY = 100;

function render() {
    const {me, others, food, leaderboard} = getCurrentState();
    if (!me) {
        return;
    }

    renderBackground(me.x, me.y);

    renderPlayer(me, me);
    others.forEach(renderPlayer.bind(null, me));
    food.forEach(renderFood.bind(null, me));

    renderMeOnMap(me);

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
    for (let i = 0; i < rowsCount; i++){
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

function processUsername(username){
    return username !== '' ? username.slice(0, 10) : 'oreo';
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
    const {x, y, radius, direction, skin} = player;
    const canvasX = canvas.width / 2 + x - me.x;
    const canvasY = canvas.height / 2 + y - me.y;

    context.save();
    context.translate(canvasX, canvasY);
    context.rotate(direction);
    context.drawImage(
        getAsset(skin),
        -radius,
        -radius,
        radius * 2,
        radius * 2,
    );
    context.restore();
}

function renderFood(me, food) {
    const {x, y, radius} = food;
    const canvasX = canvas.width / 2 + x - me.x;
    const canvasY = canvas.height / 2 + y - me.y;

    context.beginPath();
    context.arc(canvasX, canvasY, radius, 0, 2 * Math.PI, false);
    context.fillStyle = 'green';
    context.fill();
    context.stroke();
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
    const radiusCell = document.getElementById('radius');
    const radiusTextNode = document.createTextNode(player.radius);
    radiusCell.appendChild(radiusTextNode);
}

const mapCanvas = document.getElementById('map');
const mapContext = mapCanvas.getContext('2d');

function renderMeOnMap(me) {
    const canvasX = me.x / settings.MAP_SIZE * mapCanvas.width;
    const canvasY = me.y / settings.MAP_SIZE * mapCanvas.height;

    mapContext.clearRect(0, 0, mapCanvas.width, mapCanvas.height);
    mapContext.beginPath();
    mapContext.arc(canvasX, canvasY, 5, 0, 2 * Math.PI, false);
    mapContext.fillStyle = 'red';
    mapContext.fill();
    mapContext.stroke();
}