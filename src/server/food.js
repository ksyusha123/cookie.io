const GameObject = require('./gameObject');
const settings = require('../settings');


class Food extends GameObject {
    constructor(x, y) {
        super(Date.now(), x, y, settings.FOOD_RADIUS);
    }

    static create() {
        return new Food(Math.getRandomIntFromInterval(0, settings.MAP_SIZE),
                        Math.getRandomIntFromInterval(0, settings.MAP_SIZE));
    }
}

module.exports = Food;