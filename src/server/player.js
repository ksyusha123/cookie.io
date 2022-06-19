const GameObject = require('./gameObject');
const settings = require('../settings');

function _recalculateRadius(radius1, radius2) {
    return Math.sqrt(radius1 * radius1 + radius2 * radius2);
}

class Player extends GameObject {
    constructor(id, username, skin, x, y, socket) {
        super(id, x, y, settings.PLAYER_RADIUS);
        this.direction = Math.random() * 2 * Math.PI;
        this.username = username;
        this.skin = skin;
        this.socket = socket;
        this.speedMultiplier = 1;
        this.eaten = false;
        this.startTime = Date.now();
        this.partsCount = 1;
    }

    get speed() {
        return this.speedMultiplier * settings.PLAYER_RADIUS / this.radius * settings.PLAYER_SPEED  * this.partsCount;
    }

    update(dt) {
        const currentSpeed = this.speed;
        console.log(this.speed);
        this.x += dt * currentSpeed * Math.sin(this.direction);
        this.y -= dt * currentSpeed * Math.cos(this.direction);

        this.x = Math.toClosestInInterval(this.x, 0, settings.MAP_SIZE);
        this.y = Math.toClosestInInterval(this.y, 0, settings.MAP_SIZE);
    }

    eat(object) {
        this.radius = _recalculateRadius(this.radius, object.radius);
        object.eaten = true;
    }

    serialize() {
        return {
            ...(super.serialize()),
            skin: this.skin,
            direction: this.direction,
            username: this.username,
            time: Date.now() - this.startTime,
            partsCount: this.partsCount,
        };
    }

    static spawn(username, skin, socket) {
        const x = settings.MAP_SIZE * (0.25 + Math.random() * 0.5);
        const y = settings.MAP_SIZE * (0.25 + Math.random() * 0.5);
        return new Player(socket.id, username, skin, x, y, socket);
    }

    split() {
        if (this.radius < settings.PLAYER_RADIUS * (this.partsCount + 1))
           return;
        this.partsCount++;
    }
}

module.exports = Player;