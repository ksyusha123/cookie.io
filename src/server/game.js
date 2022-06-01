const settings = require('../settings');
const Player = require('./player');
const Food = require('./food');

const VISIBLE_MAP_RADIUS = settings.MAP_SIZE / 2;
const DESIRED_FRAMERATE = 60;
const INTERVAL_SIZE = 1000 / DESIRED_FRAMERATE;


class Game {
    constructor() {
        this.players = {};
        this.food = new Set();
        this.lastUpdateTime = Date.now();
        this.shouldSendUpdate = false;

        this._generateFood(settings.FOOD_COUNT);
        setInterval(this.update.bind(this), INTERVAL_SIZE);
    }

    addPlayer(socket, username, skin) {
        this.players[socket.id] = Player.spawn(username, skin, socket);
    }

    removePlayer(playerId) {
        delete this.players[playerId];
    }

    handleInput(playerId, direction) {
        if (playerId in this.players)
            this.players[playerId].direction = direction;
    }

    update() {
        this._updatePositions();
        this._handleCollisions();
        this._generateFood(settings.FOOD_COUNT - this.food.size);
        this._removeLosersAndNotify();

        if (this.shouldSendUpdate) {
            this._sendInfo();
        }

        this.shouldSendUpdate = !this.shouldSendUpdate;
    }

    get leaderBoard() {
        return Object.values(this.players)
            .sort((player1, player2) => player2.area - player1.area)
            .slice(0, 10)
            .map(player => ({username: player.username, area: player.area}));
    }

    findClosePlayersInRadius(player, radius) {
        return Object.values(this.players)
            .filter(p => p !== player && p.distanceTo(player) <= radius);
    }

    findCloseFoodInRadius(player, radius) {
        return Array.from(this.food)
            .filter(f => f.distanceTo(player) <= radius);
    }

    makeUpdate(player, leaderBoard) {
        const closePlayers = this.findClosePlayersInRadius(player, VISIBLE_MAP_RADIUS);
        const closeFood = this.findCloseFoodInRadius(player, VISIBLE_MAP_RADIUS);
        return {
            time: Date.now(),
            me: player.serialize(),
            others: closePlayers.map(p => p.serialize()),
            food: closeFood.map(f => f.serialize()),
            leaderboard: leaderBoard,
        };
    }

    _updatePositions() {
        const now = Date.now();
        const dt = (now - this.lastUpdateTime) / 1000;

        Object.values(this.players).forEach(player => player.update(dt));

        this.lastUpdateTime = now;
    }

    _handleCollisions() {
        const players = Object.values(this.players);
        const foodCopy = new Set(this.food);

        for (const player of players) {
            for (const food of foodCopy) {
                if (player.collides(food)) {
                    player.eat(food);
                    this.food.delete(food);
                }
            }
        }

        const playersCount = Object.keys(this.players).length;

        for (let i = 0; i < playersCount - 1; i++) {
            for (let j = i + 1; j < playersCount; j++) {
                if (players[i].collides(players[j])) {
                    if (players[j].isBiggerWithDiff(players[i])) {
                        players[j].eat(players[i]);
                    } else if (players[i].isBiggerWithDiff(players[j])) {
                        players[i].eat(players[j]);
                    }
                }
            }
        }
    }

    _generateFood(count) {
        for (let i = 0; i < count; i++) {
            this.food.add(Food.create());
        }
    }

    _removeLosersAndNotify() {
        for (const [playerId, player] in this.players) {
            if (player.radius === 0) {
                player.socket.emit(settings.MESSAGES.GAME_OVER);
                this.removePlayer(playerId);
            }
        }
    }

    _sendInfo() {
        const fixedLeaderBoard = this.leaderBoard;
        for (const player of Object.values(this.players)) {
            const playerUpdate = this.makeUpdate(player, fixedLeaderBoard);
            player.socket.emit(settings.MESSAGES.GAME_UPDATE, playerUpdate);
        }
    }
}

module.exports = Game;