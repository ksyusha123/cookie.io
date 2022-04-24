export const play = (username) => socket.emit('join', username);
export const updateDirection = throttle((direction) => socket.emit('update', direction), 100);