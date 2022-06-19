const express = require('express');
const socketio = require('socket.io');
const fs = require('fs');

const Game = require('./game');
const settings = require('../settings');
const {addPrototypes} = require('../utils');

addPrototypes();

const app = express();
app.use(express.static(__dirname + '/../client'));
app.use(express.static(__dirname + '/../../dist'));

app.get('/listassets/person', getDirectoryFilesForRequestSelector('/../client/assets/person/'));
app.get('/listassets/food', getDirectoryFilesForRequestSelector('/../client/assets/food/'));
app.get('/listassets/other', getDirectoryFilesForRequestSelector('/../client/assets/other/'));

const port = process.env.PORT || 3000;
const server = app.listen(port);
console.log(`Server listening on port ${port}`);

const io = socketio(server);

io.on('connection', socket => {
    console.log('Player connected!', socket.id);

    socket.on(settings.MESSAGES.JOIN, joinGame);
    socket.on(settings.MESSAGES.INPUT, handleInput);
    socket.on(settings.MESSAGES.DISCONNECT, onDisconnect);
    socket.on(settings.MESSAGES.PLAYER_SPLIT, onPlayerSplit);
});

const game = new Game();

function joinGame(username, skin) {
    game.addPlayer(this, username, skin);
    console.log('Player joined the game!', this.id);
}

function handleInput(direction, speedMultiplier) {
    game.handleInput(this.id, direction, speedMultiplier);
}

function onDisconnect() {
    game.removePlayer(this.id);
    console.log('Player left the game', this.id);
}


function onPlayerSplit() {
    game.splitPlayer(this.id);
}

function getDirectoryFilesForRequestSelector(relativePath) {
    return function (req, res) {
        res.send(fs.readdirSync(__dirname + relativePath));
    };
}