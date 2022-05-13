const GameObject = require('./gameObject');
const settings = require('../settings');
const getRandomIntFromRange = require('./utils');


class Food extends GameObject {
    constructor() {
        const id = Date.now();
        const x = getRandomIntFromRange(0, settings.MAP_SIZE);
        const y = getRandomIntFromRange(0, settings.MAP_SIZE);
        super(id, x, y, settings.FOOD_RADIUS);
    }
}

module.exports = Food;