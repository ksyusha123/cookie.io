const io = require("socket.io-client").io;
const Constants = require('../shared/constants.js');


const socket = io(`ws://${window.location.host}`);
const connectedPromise = new Promise(resolve => {
    socket.on('connect', () => {
        console.log('Connected to server!');
        resolve();
    });
});

const connect = onGameOver => (
    connectedPromise.then(() => {
        // Register callbacks
        socket.on(Constants.settings.MSG_TYPES.GAME_UPDATE, processGameUpdate);
        socket.on(Constants.settings.MSG_TYPES.GAME_OVER, onGameOver);
    })
);

module.exports.connect = connect;


