var mongoose = require('mongoose');

var playerSchema = mongoose.Schema({
  socketId : String,
  angle : String,
  pos : {
    x : {type : Number, default : 300},
    y : {type : Number, default : 300},
  }
});
var Player = mongoose.model("Player" , playerSchema);

module.exports = Player;
