const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
require('dotenv').config();

const path = require('path');
app.set('view engine' , 'jade');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/scripts')));
app.use(express.static(__dirname + 'views'));

mongoose.connect(process.env.MONGO_URL, (err) => {
  if(err) throw err;

  console.log("Connected To Disconnect DataBase.")
})

require('./controllers/sockets')(io);

app.get('/', (req,res) => {
  res.render('index');
});

server.listen(port, (req,res) => {
  console.log("listening on port " + port);
});


// ES5 -6 consistency
// index.js controller
// sockets.js => sockets/index.js, players.js ??? how to make socket code modular
// components => vendor
// modularize phaser client code

// new features on branches
