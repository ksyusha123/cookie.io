class GameObject {
    constructor(id, x, y, direction, speed, radius) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.speed = speed;
        this.radius = radius;
    }

    update(dt) {
        this.x += dt * this.speed * Math.sin(this.direction);
        this.y -= dt * this.speed * Math.cos(this.direction);
    }

    distanceTo(object) {
        const dx = this.x - object.x;
        const dy = this.y - object.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    setDirection(direction) {
        this.direction = direction;
    }

    serialize() {
        return {
            id: this.id,
            x: this.x,
            y: this.y,
            direction: this.direction,
        }
    }
}

module.exports = GameObject