const GameObject = require('./gameObject');
const settings = require('../settings');

function _recalculateRadius(radius1, radius2) {
    return Math.sqrt(radius1 * radius1 + radius2 * radius2);
}

function _recalculateSpeed(start_speed, current_radius, start_radius) {
    return start_radius / current_radius * start_speed;
}

class Player extends GameObject {
    constructor(id, username, skin, x, y, socket) {
        super(id, x, y, settings.PLAYER_RADIUS);
        this.direction = Math.random() * 2 * Math.PI;
        this.username = username;
        this.skin = skin;
        this.socket = socket;
        this.speed = settings.PLAYER_SPEED;
        this.speedMultiplier = 1;
        this.eaten = false;
        this.startTime = Date.now();
    }

    update(dt) {
        const currentSpeed = this.speedMultiplier * this.speed;

        this.x += dt * currentSpeed * Math.sin(this.direction);
        this.y -= dt * currentSpeed * Math.cos(this.direction);

        this.x = Math.toClosestInInterval(this.x, 0, settings.MAP_SIZE);
        this.y = Math.toClosestInInterval(this.y, 0, settings.MAP_SIZE);
    }

    eat(object) {
        this.radius = _recalculateRadius(this.radius, object.radius);
        this.speed = _recalculateSpeed(settings.PLAYER_SPEED, this.radius, settings.PLAYER_RADIUS);
        object.eaten = true;
    }

    serialize() {
        return {
            ...(super.serialize()),
            skin: this.skin,
            direction: this.direction,
            username: this.username,
            time: Date.now() - this.startTime,
        };
    }

    static spawn(username, skin, socket) {
        const x = settings.MAP_SIZE * (0.25 + Math.random() * 0.5);
        const y = settings.MAP_SIZE * (0.25 + Math.random() * 0.5);
        return new Player(socket.id, username, skin, x, y, socket);
    }
}

module.exports = Player;