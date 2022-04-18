const express = require('express')
const { Server } = require('socket.io')
const app = express()
const port = 3000

app.use('/static', express.static('public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

server = app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

const io = new Server(server);
io.on('connection', socket => {
    console.log('Player connected!', socket.id);
});
