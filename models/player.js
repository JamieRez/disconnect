var mongoose = require('mongoose');

var playerSchema = mongoose.Schema({
  socketId : String,
  angle : String,
  pos : {
    x : Number,
    y : Number
  }
});
var Player = mongoose.model("Player" , playerSchema);

module.exports = player;
