const Player = require('../models/player');
module.exports = (io) => {

  io.on('connection', (socket) => {
    // var newPlayer = new Player()

    socket.on('UpdatePlayerPos', (data) => {
      socket.broadcast.emit("UpdatePlayerPos", data);
    })

    socket.on('NewPlayer', () => {
      socket.broadcast.emit("NewPlayer", {id : 7});
    })

    socket.on('disconnect', () => {
      socket.
    })

  });

}
