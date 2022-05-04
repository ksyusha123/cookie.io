const express = require('express');
// const webpack = require('webpack');
// const webpackDevMiddleware = require('webpack-dev-middleware');
const socketio = require('socket.io');
// const webpackConfig = require('../../webpack.config.js');

const Game = require('./game');

const app = express();
app.use(express.static('../client'));
// const compiler = webpack(webpackConfig);
// app.use(webpackDevMiddleware(compiler));
// app.use(express.static('server'));
app.use(express.static('../../dist'));

const port = process.env.PORT || 3000;
const server = app.listen(port);
console.log(`Server listening on port ${port}`);

const io = socketio(server);

io.on('connection', socket => {
    console.log('Player connected!', socket.id);

    socket.on('join', joinGame);
    socket.on('disconnect', onDisconnect);
});

const game = new Game();

function joinGame(username) {
    game.addPlayer(this, username);

}

function onDisconnect() {
    game.removePlayer(this);
}