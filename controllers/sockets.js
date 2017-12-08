const Player = require('../models/player');
module.exports = (io) => {

  io.on('connection', (socket) => {

    socket.on("GetClientId", () => {
      socket.emit("GetClientId", {id : socket.id});
    });

    var newPlayer = new Player({socketId : socket.id});
    newPlayer.save();

    socket.on('LoadPlayers', (data) => {
      Player.find({}, function(err,players){
        socket.emit("LoadPlayers", {players : players});
      })
    })

    socket.on('UpdatePlayerPos', (data) => {
      socket.broadcast.emit("UpdatePlayerPos", {id : socket.id, angle : data.angle, pos : data.pos});
      Player.findOne({socketId : socket.id}, (err, player) => {
        player.angle = data.angle;
        player.pos = data.pos;
        player.save();
      })
    })

    socket.on('NewPlayer', () => {
      socket.broadcast.emit("NewPlayer", {id : socket.id});
    })

    socket.on('NewMessage', (data) => {
      socket.broadcast.emit('NewMessage', {id : socket.id, message : data.message});
    });

    socket.on('disconnect', () => {
      Player.findOne({socketId : socket.id}, (err, player) => {
        if(err) throw err;
        player.remove();
        socket.broadcast.emit('RemovePlayer', {id : socket.id});
      });
    })

  });

}
