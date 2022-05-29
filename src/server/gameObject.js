const settings = require('../settings');

class GameObject {
    constructor(id, x, y, radius) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.radius = radius;
    }

    get area() {
        return Math.PI * this.radius ** 2;
    }

    distanceTo(object) {
        const dx = this.x - object.x;
        const dy = this.y - object.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    collides(object) {
        return this.distanceTo(object) < settings.CRITICAL_DISTANCE_BORDER * (this.radius + object.radius);
    }

    isBiggerWithDiff(object) {
        return object.isSmallerWithDiff(this);
    }

    isSmallerWithDiff(object) {
        return this.area <= settings.CRITICAL_AREA_DIFF * object.area;
    }

    serialize() {
        return {
            id: this.id,
            x: this.x,
            y: this.y,
        };
    }
}

module.exports = GameObject;