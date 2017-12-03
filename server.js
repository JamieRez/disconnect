var express = require('express');
var app = express();

const path = require('path');
app.set('view engine' , 'jade');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/scripts')));
app.use(express.static(__dirname + 'views'));


app.get('/', (req,res) => {
  res.render('index');
});

app.listen('3000', (req,res) => {
  console.log("listening on port 3000");
});
