const express = require('express');
const { Server } = require('socket.io');
const app = express();
const port = 3000;

const Game = require('./game');

app.use('/static', express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

server = app.listen(port, () => {
    console.log(`Cookie.io listening on port ${port}`)
});

const game = new Game();

const io = new Server(server);
io.on('connection', socket => {
    console.log('Player connected!', socket.id);

    socket.on('join', (username) => {
        game.addPlayer(socket, username);
        console.log('join');
    });
    socket.on('update', (direction) => game.handleUpdate(socket, direction));
    socket.on('disconnect', () => {
        console.log('Player disconnected', socket.id);
    });
});
