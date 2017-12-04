function playerMovement(){
    triangle.rotation = game.physics.arcade.angleToPointer(triangle);
    //  only move when you click
    if (this.spaceKey.isDown) {
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
