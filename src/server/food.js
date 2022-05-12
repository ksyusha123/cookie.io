const GameObject = require('./gameObject');
const settings = require('../settings');

import {generateId} from "./utils";


export class Food extends GameObject {
    constructor() {
        const id = generateId();
        const x = settings.MAP_SIZE * Math.random();
        const y = settings.MAP_SIZE * Math.random();
        super(id, x, y, settings.FOOD_RADIUS);
    }
}