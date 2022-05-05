const settings = require('../settings');
const Player = require('./player');

class Game {
    constructor() {
        this.players = {};
        this.lastUpdateTime = Date.now();
        this.shouldSendUpdate = false;
        setInterval(this.update.bind(this), 1000 / 60);
    }

    addPlayer(socket, username) {
        const x = settings.MAP_SIZE * (0.25 + Math.random() * 0.5);
        const y = settings.MAP_SIZE * (0.25 + Math.random() * 0.5);
        this.players[socket.id] = new Player(socket.id, username, x, y, settings.START_RADIUS, socket);
    }

    removePlayer(playerId) {
        delete this.players[playerId];
    }

    handleInput(socket, direction) {
        this.players[socket.id].setDirection(direction);
    }

    update() {
        const now = Date.now();
        const dt = (now - this.lastUpdateTime) / 1000;
        this.lastUpdateTime = now;

        for (const playerId of Object.keys(this.players)){
            const player = this.players[playerId];
            player.update(dt);
        }

        // todo: handle collisions

        for (const playerId of Object.keys(this.players)){
            const player = this.players[playerId];
            if (player.radius === 0){
                player.socket.emit(settings.MESSAGES.GAME_OVER);
                this.removePlayer(playerId);
            }
        }

        if (this.shouldSendUpdate){
            const fixedLeaderBoard = this.leaderBoard;
            for (const playerId of Object.keys(this.players)){
                const player = this.players[playerId];
                const playerUpdate = this.makeUpdate(player, fixedLeaderBoard);
                player.socket.emit(settings.MESSAGES.GAME_UPDATE, playerUpdate);
            }
            this.shouldSendUpdate = false;
        } else {
            this.shouldSendUpdate = true;
        }
    }


    get leaderBoard() {
        return this.players
            .sort((player1, player2) => player1.area > player2.area)
            .slice(0, 10)
            .map(player => ({username: player.username, area: player.area}));
    }

    findClosePlayers(player){
        return Object.values(this.players).filter(
            p => p !== player && p.distanceTo(player) <= settings.MAP_SIZE / 2
        );
    }

    makeUpdate(player, leaderBoard) {
        const closePlayers = this.findClosePlayers(player);
        return {
            time: Date.now(),
            me: player.serialize(),
            others: closePlayers.map(p => p.serialize()),
            leaderboard: leaderBoard,
        };
    }
}

module.exports = Game;