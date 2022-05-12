const GameObject = require('./gameObject');
const settings = require('../settings');


class Food extends GameObject {
    constructor() {
        const id = Date.now();
        const x = settings.MAP_SIZE * Math.random();
        const y = settings.MAP_SIZE * Math.random();
        super(id, x, y, settings.FOOD_RADIUS);
    }
}

module.exports = Food;