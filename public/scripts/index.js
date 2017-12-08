var socket = io();
var isTyping = false;

var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
  preload: preload,
  create: create,
  update: update
});

function preload() {
  game.load.image('player', 'player.png');
  game.load.image('user', 'user.png');
}

//Set Sprite Triangle
var triangle;
var clientId;
var message;

socket.emit("GetClientId");
socket.on("GetClientId" , function(data){
  clientId = data.id;
})

function create() {
  game.userMap = {};
  game.textMap = {};
  triangle = game.add.sprite(300, 300, 'player');
  triangle.angle = -90
  triangle.scale.setTo(0.1, 0.1);
  triangle.anchor.setTo(0.5, 0.5);
  game.physics.enable(triangle, Phaser.Physics.ARCADE);
  socket.emit('NewPlayer');

  this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  game.input.keyboard.addKeyCapture(Phaser.Keyboard.SPACEBAR);
  this.enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
  game.input.keyboard.addKeyCapture(Phaser.Keyboard.ENTER);

  //Load players
  socket.emit('LoadPlayers');
  socket.on('LoadPlayers', (data) => {
    data.players.forEach((player) => {
      if (player.socketId != clientId){
        game.userMap[player.socketId] = game.add.sprite(player.pos.x, player.pos.y, 'user');
        game.userMap[player.socketId].rotation = player.angle;
        game.userMap[player.socketId].scale.setTo(0.1, 0.1);
        game.userMap[player.socketId].anchor.setTo(0.5, 0.5);
        game.physics.enable(game.userMap[player.socketId], Phaser.Physics.ARCADE);
      }
    })
  })

  message = game.add.text(triangle.x - (triangle.width / 2), triangle.y - 40, "", {
    fill : '#ffffff',
    boundsAlignH: "center",
    wordWrapWidth : true, wordWrapWidth : 50
  })
  message.setTextBounds(50, 0, 50, 0);

}

function update() {

  message.x = triangle.x - (triangle.width / 2);
  message.y = triangle.y - 60;


//Player Movement
  //Have Triangle Look at mouse Pointer
  triangle.rotation = game.physics.arcade.angleToPointer(triangle);
  //Only move when SpaceBar is down
  if (this.spaceKey.isDown && !isTyping) {
    game.physics.arcade.moveToPointer(triangle, 220);
    //  if it's overlapping the mouse, don't move any more
    if (Phaser.Rectangle.contains(triangle.body, game.input.x, game.input.y)) {
      triangle.body.velocity.setTo(0, 0);
    }
  } else {
    triangle.body.velocity.setTo(0, 0);
  }

  //Send Player Pos and Angle Across All Clients
  socket.emit("UpdatePlayerPos", {angle : triangle.rotation, pos : {x : triangle.x, y: triangle.y}});

}

  //Chat Functions
    //When Player Presses Enter, Show textarea
    autosize($('textarea'));
    $(document).on('keydown', (e) =>{
      if(e.which == 13){
        if(!isTyping){
          $('textarea').css('display', 'inline-block');
          game.input.keyboard.removeKeyCapture(Phaser.Keyboard.SPACEBAR)
          $('textarea').focus();
          isTyping = true;
        }else{
          //On Submit
          $('textarea').css('display', 'none');
          isTyping = false;
          game.input.keyboard.addKeyCapture(Phaser.Keyboard.SPACEBAR)
          message.setText($('textarea').val());
          socket.emit('NewMessage', {message : $('textarea').val()});
          $('textarea').val('');
        }
      }
    });

    //When A New Player Joins, show Across all Clients
    socket.on("NewPlayer", (data) => {
      game.userMap[data.id] = game.add.sprite(300, 300, 'user');
      game.userMap[data.id].angle = -90;
      game.userMap[data.id].scale.setTo(0.1, 0.1);
      game.userMap[data.id].anchor.setTo(0.5, 0.5);
      game.physics.enable(game.userMap[data.id], Phaser.Physics.ARCADE);
    });

    socket.on("UpdatePlayerPos", (data) => {
      game.userMap[data.id].rotation = data.angle;
      game.userMap[data.id].x = data.pos.x;
      game.userMap[data.id].y = data.pos.y;
      if(game.textMap[data.id]){
        game.textMap[data.id].x = data.pos.x;
        game.textMap[data.id].y = data.pos.y - 40;
      }
    });

    //When a new message comes in
    socket.on('NewMessage', (data) => {
      sender = game.userMap[data.id];

      if(game.textMap[data.id]){
        game.textMap[data.id].setText(data.message);
      }else{
        game.textMap[data.id] = game.add.text(sender.x - (sender.width / 2), sender.y - 40, data.message , {
          fill : '#ffffff',
          boundsAlignH : "center",
          wordWrapWidth : true, wordWrapWidth : 50
        })
        game.textMap[data.id].setTextBounds(50, 0, 50, 0);
      }
    })

    //When Player Exits, Remove from All Clients
    socket.on('RemovePlayer', (data) => {
      game.userMap[data.id].destroy();
    });
