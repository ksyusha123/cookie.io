const settings = require('../settings');
const Player = require('./player');
const Food = require('./food');

const VISIBLE_MAP_RADIUS = settings.MAP_SIZE / 2;
const DESIRED_FRAMERATE = 60;
const INTERVAL_SIZE = 1000 / DESIRED_FRAMERATE;
const FOOD_COUNT = 250;


class Game {
    constructor() {
        this.players = {};
        this.food = new Set();
        this.lastUpdateTime = Date.now();
        this.shouldSendUpdate = false;

        this._generateFood(FOOD_COUNT);
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
        this._generateFood(FOOD_COUNT - this.food.size);
        this._removeLosersAndNotify();

        if (this.shouldSendUpdate) {
            this._sendInfo();
        }

        this.shouldSendUpdate = !this.shouldSendUpdate;
    }

    get leaderBoard() {
        return Object.values(this.players)
            .sort((player1, player2) => player2.radius - player1.radius)
            .slice(0, settings.TOP_COUNT)
            .map(player => ({username: player.username, radius: player.radius, id: player.id}));
    }

    findClosePlayersInRadius(player, radius) {
        return Object.values(this.players)
            .filter(p => p !== player && p.distanceTo(player) <= radius);
    }

    findCloseFoodInRadius(player, radius) {
        return Array.from(this.food)
            .filter(f => f.distanceTo(player) <= radius);
    }

    makeUpdate(player, leaderboard) {
        const closePlayers = this.findClosePlayersInRadius(player, VISIBLE_MAP_RADIUS);
        const closeFood = this.findCloseFoodInRadius(player, VISIBLE_MAP_RADIUS);
        return {
            time: Date.now(),
            me: player.serialize(),
            visible: closePlayers.map(p => p.serialize()),
            food: closeFood.map(f => f.serialize()),
            leaderboard: leaderboard,
            players: Object.values(this.players).map(p => ({x: p.x, y: p.y})),
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
        const eatenPlayers = [];

        for (const player of Object.values(this.players)) {
            if (player.eaten) {
                player.socket.emit(settings.MESSAGES.GAME_OVER, player.serialize());
                console.log('Game over', player.id);
                eatenPlayers.push(player.id);
            }
        }

        for (const eatenPlayer of eatenPlayers) {
            this.removePlayer(eatenPlayer);
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