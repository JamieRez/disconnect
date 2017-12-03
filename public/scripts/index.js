var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
  preload: preload,
  create: create,
  update: update
});

var triGraphics;
function preload() {
  game.load.image('triangle', 'triangle.png');
}

var triangle;
function create() {
  triangle = game.add.sprite(300, 300, 'triangle');
  triangle.angle = -90
  triangle.scale.setTo(0.1, 0.1);
  triangle.anchor.setTo(0.5, 0.5);
  game.physics.enable(triangle, Phaser.Physics.ARCADE);
}

function update() {
  triangle.rotation = game.physics.arcade.angleToPointer(triangle);
  //  only move when you click
  if (game.input.mousePointer.isDown) {
    //  400 is the speed it will move towards the mouse
    game.physics.arcade.moveToPointer(triangle, 220);

    //  if it's overlapping the mouse, don't move any more
    if (Phaser.Rectangle.contains(triangle.body, game.input.x, game.input.y)) {
      triangle.body.velocity.setTo(0, 0);
    }
  } else {
    triangle.body.velocity.setTo(0, 0);
  }

}
