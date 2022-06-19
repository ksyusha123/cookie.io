const RENDER_DELAY = 100;
const gameUpdates = [];
const interpolatedKeys = new Set(['x', 'y', 'radius']);

let currentGameTime = 0;
let serverTimestamp = 0;

function getPreviousUpdateIndex() {
    const serverTime = getCurrentServerTime();

    for (let i = gameUpdates.length - 1; i > -1; i--) {
        if (gameUpdates[i].time <= serverTime) {
            return i;
        }
    }

    return -1;
}

function getCurrentServerTime() {
    return serverTimestamp + Date.now() - currentGameTime - RENDER_DELAY;
}

function interpolateGameObjectsArray(prevObjectsStates, nextObjectsStates, ratio) {
    return prevObjectsStates
        .map(o => interpolateGameObject(o, nextObjectsStates.find(o2 => o.id === o2.id), ratio));
}

function interpolateGameObject(prevObjState, nextObjState, ratio) {
    if (!nextObjState) {
        return prevObjState;
    }

    const interpolatedObject = {};

    for (const [key, value] of Object.entries(prevObjState)) {
        if (key in interpolatedKeys) {
            interpolatedObject[key] = interpolateValue(value, nextObjState[key], ratio);
        } else {
            interpolatedObject[key] = value;
        }
    }

    return interpolatedObject;
}

function interpolateValue(prevValue, nextValue, ratio) {
    return prevValue + (nextValue - prevValue) * ratio;
}

export function processGameUpdate(update) {
    if (!serverTimestamp) {
        serverTimestamp = update.time;
        currentGameTime = Date.now();
    }

    gameUpdates.push(update);
    const previousUpdateIndex = getPreviousUpdateIndex();

    if (previousUpdateIndex > 0) {
        gameUpdates.splice(0, previousUpdateIndex);
    }
}

export function getCurrentState() {
    if (!serverTimestamp) {
        return {};
    }

    const previousUpdateIndex = getPreviousUpdateIndex();
    const serverTime = getCurrentServerTime();

    if (previousUpdateIndex < 0 || previousUpdateIndex === gameUpdates.length - 1) {
        return gameUpdates[-1];
    }

    const previousUpdate = gameUpdates[previousUpdateIndex];
    const nextUpdate = gameUpdates[previousUpdateIndex + 1];
    const ratio = (serverTime - previousUpdate.time) / (nextUpdate.time - previousUpdate.time);

    return {
        me: interpolateGameObject(previousUpdate.me, nextUpdate.me, ratio),
        visible: interpolateGameObjectsArray(previousUpdate.visible, nextUpdate.visible, ratio),
        playersCoordinates: interpolateGameObjectsArray(previousUpdate.playersCoordinates,
            nextUpdate.playersCoordinates, ratio),
        food: previousUpdate.food,
        leaderboard: previousUpdate.leaderboard,
    };
}