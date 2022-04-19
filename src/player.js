const GameObject = require('./gameObject')

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
}