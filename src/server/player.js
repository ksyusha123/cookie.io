const GameObject = require('./gameObject');
const settings = require('../settings');

class Player extends GameObject {
    constructor(id, username, skin, x, y, socket) {
        super(id, x, y, settings.START_RADIUS);
        this.direction = Math.random() * 2 * Math.PI;
        this.username = username;
        this.skin = skin;
        this.socket = socket;
        this.speed = settings.PLAYER_SPEED;
    }

    update(dt) {
        this.x += dt * this.speed * Math.sin(this.direction);
        this.y -= dt * this.speed * Math.cos(this.direction);

        this.x = Math.max(0, Math.min(settings.MAP_SIZE, this.x));
        this.y = Math.max(0, Math.min(settings.MAP_SIZE, this.y));
    }

    serialize() {
        return {
            ...(super.serialize()),
            skin: this.skin,
            direction: this.direction,
            area: this.area,
        };
    }
}

module.exports = Player;