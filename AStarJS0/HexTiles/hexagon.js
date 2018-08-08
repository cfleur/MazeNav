drawHexagon = function(x, y, xSize, col=color(200,100,200)) {
  var angle = PI/3;
  beginShape();
  for (var a = 0; a < TWO_PI; a += angle) {
    this.x = x + cos(a) * (xSize/2);
    this.y = y + sin(a) * (xSize/2);
    vertex(this.x, this.y);
    endShape(CLOSE);
    fill(col);
  }
}
