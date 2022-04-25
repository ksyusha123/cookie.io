import {updateDirection} from "./public/client";

window.addEventListener('mousemove', (e) => {
    const direction = Math.atan2(e.y, e.x);
    updateDirection(direction);
})