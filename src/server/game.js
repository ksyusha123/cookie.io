const settings = require('../settings');
const Player = require('./player');
const Food = require('./food');


class Game {
    constructor() {
        this.players = {};
        this.food = new Set();
        this._generateFood(settings.FOOD_COUNT);
        this.lastUpdateTime = Date.now();
        this.shouldSendUpdate = false;
        setInterval(this.update.bind(this), 1000 / 60);
    }

    addPlayer(socket, username) {
        const x = settings.MAP_SIZE * (0.25 + Math.random() * 0.5);
        const y = settings.MAP_SIZE * (0.25 + Math.random() * 0.5);
        this.players[socket.id] = new Player(socket.id, username, x, y, socket);
    }

    _generateFood(count) {
        for (let i = 0; i < count; i++) {
            this.food.add(new Food());
        }
    }

    removePlayer(playerId) {
        delete this.players[playerId];
    }

    handleInput(socket, direction) {
        this.players[socket.id].direction = direction;
    }

    update() {
        const now = Date.now();
        const dt = (now - this.lastUpdateTime) / 1000;
        this.lastUpdateTime = now;

        for (const player of Object.values(this.players)){
            player.update(dt);
        }

        this._handleCollisions();

        this._generateFood(settings.FOOD_COUNT - this.food.length);

        for (const [playerId, player] in this.players){
            if (player.radius === 0){
                player.socket.emit(settings.MESSAGES.GAME_OVER);
                this.removePlayer(playerId);
            }
        }

        const foodCopy = new Set(this.food);
        for (const food of foodCopy) {
            if (food.radius === 0){
                this.food.delete(food);
            }
        }

        if (this.shouldSendUpdate){
            const fixedLeaderBoard = this.leaderBoard;
            for (const player of Object.values(this.players)){
                const playerUpdate = this.makeUpdate(player, fixedLeaderBoard);
                player.socket.emit(settings.MESSAGES.GAME_UPDATE, playerUpdate);
            }
            this.shouldSendUpdate = false;
        } else {
            this.shouldSendUpdate = true;
        }
    }

    _handleCollisions(){
        const players = Object.values(this.players);

        for (let i = 0; i < this.players.length - 1; i++){
            for (let j = i + 1; j < this.players.length; j++){
                if (players[i].distanceTo(players[j]) < settings.CRITICAL_DISTANCE_BORDER * (players[i].radius + players[j].radius)) {
                    if (players[i].area <= settings.CRITICAL_AREA_DIFF * players[j].area) {
                        this._updateRadii(players[j], players[i]);
                    } else if (players[j].area <= settings.CRITICAL_AREA_DIFF * players[i].area) {
                        this._updateRadii(players[i], players[j]);
                    }
                }
            }
        }

        for (const player of Object.values(this.players)){
            for (const food of Object.values(this.food)){
                if (player.distanceTo(food) < settings.CRITICAL_DISTANCE_BORDER * (player.radius + food.radius)){
                    this._updateRadii(player, food);
                }
            }
        }
    }

    _updateRadii(winner, loser){
        winner.radius = this._recalculateRadius(winner.radius, loser.radius);
        loser.radius = 0;
    }

    _recalculateRadius(radius1, radius2){
        return Math.sqrt(radius1 * radius1 + radius2 * radius2);
    }

    get leaderBoard() {
        return Object.values(this.players)
            .sort((player1, player2) => player2.area - player1.area)
            .slice(0, 10)
            .map(player => ({username: player.username, area: player.area}));
    }

    findClosePlayers(player){
        return Object.values(this.players).filter(
            p => p !== player && p.distanceTo(player) <= settings.MAP_SIZE / 2
        );
    }

    findCloseFood(player){
        return Object.values(this.food).filter(f => f.distanceTo(player) <= settings.MAP_SIZE / 2);
    }

    makeUpdate(player, leaderBoard) {
        const closePlayers = this.findClosePlayers(player);
        const closeFood = this.findCloseFood(player);
        return {
            time: Date.now(),
            me: player.serialize(),
            others: closePlayers.map(p => p.serialize()),
            food: closeFood.map(f => f.serialize()),
            leaderboard: leaderBoard,
        };
    }
}

module.exports = Game;