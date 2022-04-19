const settings = require('settings');
const Player = require('player');

class Game {
    constructor() {
        this.players = {};
        this.lastUpdateTime = Date.now();
    }

    addPlayer(socket, username) {
        const x = settings.MAP_SIZE * (0.25 + Math.random() * 0.5);
        const y = settings.MAP_SIZE * (0.25 + Math.random() * 0.5);
        this.players[socket.id] = new Player(socket.id, username, x, y, settings.START_RADIUS, socket);
    }

    removePlayer(socket) {
        delete this.players[socket.id];
    }

    update() {
        const now = Date.now();
        const dt = (now - this.lastUpdateTime) / 1000;
        this.lastUpdateTime = now;


        //todo: handle update
    }


    get leaderBoard() {
        return this.players
            .sort((player1, player2) => player1.area > player2.area)
            .slice(0, 10)
            .map(player => ({username: player.username, area: player.area}));
    }

    _serialize(player, closePlayers) {
        return {
            time: Date.now(),
            me: player.serialize(),
            others: closePlayers.map(p => p.serialize()),
            leaderboard: this.leaderBoard,
        };
    }
}

module.exports = Game;