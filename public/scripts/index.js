var socket = io();

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
function create() {
  this.userMap = {};
  socket.emit('NewPlayer');
  triangle = game.add.sprite(300, 300, 'player');
  triangle.angle = -90
  triangle.scale.setTo(0.1, 0.1);
  triangle.anchor.setTo(0.5, 0.5);
  game.physics.enable(triangle, Phaser.Physics.ARCADE);
  this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  game.input.keyboard.addKeyCapture(Phaser.Keyboard.SPACEBAR);
}

function update() {
  triangle.rotation = game.physics.arcade.angleToPointer(triangle);
  //Only move when SpaceBar is down
  if (this.spaceKey.isDown) {
    game.physics.arcade.moveToPointer(triangle, 220);
    //  if it's overlapping the mouse, don't move any more
    if (Phaser.Rectangle.contains(triangle.body, game.input.x, game.input.y)) {
      triangle.body.velocity.setTo(0, 0);
    }
  } else {
    triangle.body.velocity.setTo(0, 0);
  }

  //When A New Player Joins, show Across all Clients
  socket.on("NewPlayer", (data) => {
    this.userMap[data.id] = game.add.sprite(300, 300, 'user');
    this.userMap[data.id].angle = -90;
    this.userMap[data.id].scale.setTo(0.1, 0.1);
    this.userMap[data.id].anchor.setTo(0.5, 0.5);
    game.physics.enable(this.userMap[data.id], Phaser.Physics.ARCADE);
  });

  //Send Player Pos and Angle Across All Clients
  socket.emit("UpdatePlayerPos", {angle : triangle.rotation, pos : {x : triangle.x, y: triangle.y}});
  socket.on("UpdatePlayerPos", (data) => {
    this.userMap[7].rotation = data.angle;
    this.userMap[7].x = data.pos.x;
    this.userMap[7].y = data.pos.y;
  });

}
