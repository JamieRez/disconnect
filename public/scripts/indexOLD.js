$(document).ready( () => {
  //Mouse held down bool with mouse coords
  var held = false;
  var mouseX;
  var mouseY;
  //Create Canvas
  const canvas = new fabric.Canvas('canvas');
  //Create User Triangle with Shadow
  var triangle = new fabric.Triangle({
    width: 30, height: 45, fill: 'red', left: 500, top: 250,
    originX: 'center', originY: 'center',
  });
  triangle.setShadow({
    color : 'rgba(175,175,175,0.8)',
    blur : 45,
    offsetX: 0,
    offsetY: 2
  });
  canvas.add(triangle);
  canvas.renderAll();

  //Have Triangle Rotate towards Mouse Cursor at all Times
  canvas.on('mouse:move', function(options) {
    triCent = triangle.getCenterPoint();
    if(held){
      mouseX = options.e.clientX;
      mouseY = options.e.clientY;
      if(mouseX > triCent.x){
        var topOffset = (mouseY > triCent.y ? 2 : -2)
        triangle.set({left : triangle.left + 2, top : triangle.top + topOffset});
      }else if(mouseX < triCent.x){
        var topOffset = (mouseY > triCent.y ? 2 : -2)
        triangle.set({left : triangle.left - 2, top : triangle.top + topOffset});
      }
    }
    var angle = Math.atan2(options.e.clientX - triCent.x, - (options.e.clientY - triCent.y) )*(180/Math.PI);
    triangle.set({angle : angle});
    canvas.renderAll();
  });

  //Have Triangle Move in Direction of Mouse Cursor On Held Click
  canvas.on('mouse:down', (options) => {
    held = true;
    mouseX = options.e.clientX;
    mouseY = options.e.clientY;
    // if(held){
    //   if(mouseX > triCent.x){
    //     triangle.animate('left', '=+10', {
    //       onChange : canvas.renderAll.bind(canvas)
    //     })
    //   }
    // }
  });
  canvas.on('mouse:up', (options) => {
    held = false;
  })

});
