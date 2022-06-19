const settings = require("../settings");
const GameObject = require("./gameObject");

const MAX_SIMPLE_ROTATION_ANGLE = Math.PI / 256;
const MAX_ABRUPT_ROTATION_ANGLE = Math.PI / 16;
const SIMPLE_ROTATION_PROBABILITY = 0.4;
const ABRUPT_ROTATION_PROBABILITY = 0.05;

class Monster extends GameObject {
    constructor(id, x, y) {
        super(id, x, y, settings.MONSTER_RADIUS);
        this.direction = Math.PI / 2;
        this.speed = settings.MONSTER_SPEED;
    }

    update(dt) {
        const randomFraction = Math.random();

        if (randomFraction <= SIMPLE_ROTATION_PROBABILITY) {
            this.direction += Math.getRandomFromInterval(-MAX_SIMPLE_ROTATION_ANGLE, MAX_SIMPLE_ROTATION_ANGLE);
        } else if (randomFraction <= SIMPLE_ROTATION_PROBABILITY + ABRUPT_ROTATION_PROBABILITY) {
            this.direction += Math.getRandomFromInterval(-MAX_ABRUPT_ROTATION_ANGLE, MAX_ABRUPT_ROTATION_ANGLE);
        }

        this.x += dt * this.speed * Math.sin(this.direction);
        this.y -= dt * this.speed * Math.cos(this.direction);

        this.x = Math.toClosestInInterval(this.x, 0, settings.MAP_SIZE);
        this.y = Math.toClosestInInterval(this.y, 0, settings.MAP_SIZE);
    }

    eat(object) {
        if (object.radius > settings.FOOD_RADIUS) {
            object.radius /= 2;
            object.direction *= -1;
            object.update(2);
        }
    }

    serialize() {
        return {
            ...(super.serialize()),
            direction: this.direction,
        };
    }

    static spawn() {
        const x = settings.MAP_SIZE * (0.25 + Math.random() * 0.5);
        const y = settings.MAP_SIZE * (0.25 + Math.random() * 0.5);
        return new Monster(Date.now(), x, y);
    }
}

module.exports = Monster;