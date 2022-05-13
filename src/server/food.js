const GameObject = require('./gameObject');
const settings = require('../settings');
const getRandomIntFromRange = require('./utils');


class Food extends GameObject {
    constructor(x, y) {
        const id = Date.now();
        super(id, x, y, settings.FOOD_RADIUS);
    }

    static create() {
        return new Food(getRandomIntFromRange(0, settings.MAP_SIZE), getRandomIntFromRange(0, settings.MAP_SIZE));
    }
}

module.exports = Food;