const GameObject = require('./gameObject');
const settings = require('../settings');

class Player extends GameObject {
    constructor(id, username, x, y, radius, socket) {
        super(id, x, y, Math.random() * 2 * Math.PI, 200);
        this.username = username;
        this.radius = radius;
        this.socket = socket;
    }

    get area() {
        return Math.PI * this.radius ** 2
    }

    update(dt) {
        super.update(dt);

        this.x = Math.max(0, Math.min(settings.MAP_SIZE, this.x));
        this.y = Math.max(0, Math.min(settings.MAP_SIZE, this.y));
    }

    serialize() {
        return {
            ...(super.serialize()),
            area: this.area,
        };
    }
}

module.exports = Player;