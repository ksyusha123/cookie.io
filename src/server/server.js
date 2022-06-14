const express = require('express');
const socketio = require('socket.io');

const Game = require('./game');
const settings = require('../settings');
const addPrototypes = require('../utils');

addPrototypes();

const app = express();
app.use(express.static(__dirname + '/../client'));
app.use(express.static(__dirname + '/../../dist'));

const port = process.env.PORT || 3000;
const server = app.listen(port);
console.log(`Server listening on port ${port}`);

const io = socketio(server);

io.on('connection', socket => {
    console.log('Player connected!', socket.id);

    socket.on(settings.MESSAGES.JOIN, joinGame);
    socket.on(settings.MESSAGES.INPUT, handleInput);
    socket.on(settings.MESSAGES.DISCONNECT, onDisconnect);
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