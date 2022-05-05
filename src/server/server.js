const express = require('express');
const socketio = require('socket.io');

const Game = require('./game');
const settings = require('../settings');


const app = express();
app.use(express.static('../client'));
app.use(express.static('../../dist'));

const port = process.env.PORT || 3000;
const server = app.listen(port);
console.log(`Server listening on port ${port}`);

const io = socketio(server);

io.on('connection', socket => {
    console.log('Player connected!', socket.id);

    socket.on(settings.MESSAGES.JOIN, joinGame);
    socket.on(settings.MESSAGES.INPUT, handleInput);
    socket.on('disconnect', onDisconnect);
});

const game = new Game();

function joinGame(username) {
    game.addPlayer(this, username);
    console.log('Player joined the game!', this.id);
}

function handleInput(direction) {
    game.handleInput(this, direction);
    console.log('Player updated direction', this.id);
}

function onDisconnect() {
    game.removePlayer(this);
    console.log('Player left the game', this.id);
}