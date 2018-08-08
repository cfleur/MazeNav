var rowsAndcols = 10;  // Assuming square grid) (goes from -num to +num, real length is 2x)
var w, h;  // Size of hexagon in x(w) and y(h) direction
var sca = rowsAndcols/5;
var cells = new Array(rowsAndcols);
var openNodes = [];
var closedNodes = [];
var start;
var end;
var path = [];
var currentNode;
var seconds;  // length of time to find path

function removeNode(nodeArray_, node_){
  for (var i = nodeArray_.length-1; i >= 0; i--) {
    if (nodeArray_[i] == node_) {
      nodeArray_.splice(i, 1);
    }
  }
}

function heuristic(a, b) {
  return d = abs(a.q - b.q) + abs(a.r - b.r);
}

findPath = function(cells) {
  if (openNodes.length > 0) {
    var cheapest = 0;

    for (var i = 0; i < openNodes.length; i ++) {
      if (openNodes[i].f < openNodes[cheapest].f) {
        cheapest = i;
      }
    }
      currentNode = openNodes[cheapest];

    if (currentNode == end) {
      noLoop();
      console.log("Maze solved.", seconds.toFixed(3), " seconds.");
			console.log("Path:", path);
			return;
    }

    removeNode(openNodes, currentNode);
    closedNodes.push(currentNode);

    var neighbours = currentNode.neighbours;

    for(var i = 0; i < neighbours.length; i++) {
      var neighbour = neighbours[i];
      if(!closedNodes.includes(neighbour)) {
        var tempG = currentNode.g + 1;  // + 1 == distance between neighbour and current

        var newPath = false;
        if(openNodes.includes(neighbour)){
          if(tempG < neighbour.g){
            neighbour.g = tempG;
            newPath = true;
          }
        } else {
          neighbour.g = tempG;
          openNodes.push(neighbour);
          newPath = true;
        }

        if (newPath) {
          neighbour.h = heuristic(neighbour, end);
          neighbour.f = neighbour.g + neighbour.h
          neighbour.previous = currentNode;
        }
      }
    }

  } else {
    // no soloution
		console.log("Closed nodes:", closedNodes)
    console.log("No solution", seconds.toFixed(3), " seconds.");
    noLoop();
    return;
  }

  // Find path
    path = [];
    var trail = currentNode;
    path.push(trail)
    while(trail.previous){
      path.push(trail.previous);
      trail = trail.previous;
    }
}

Hexagon = function(q, r) {
  // Location on cube coordinate system
  this.q = q;
  this.r = r;
  this.s = - q - r;  // q + r + s = 0 !!
  // Cost variables
  this.f = 0;
  this.g = 0;
  this.h = 0;
  this.neighbours = [];
  // Previous hexagon in path
  this.previous = undefined;

  // Functions
  this.addNeighbours = function(cells) {
    var maxPos = (cells.length-1);
    var q = this.q;
    var r = this.r;

    if (q > -maxPos && r > -maxPos) {
      this.neighbours.push(cells[q-1][r-1]);  // NW
    }

    if (q < maxPos) {
      this.neighbours.push(cells[q+1][r]);  // NE
    }

    if (r > -maxPos) {
      this.neighbours.push(cells[q][r-1]);  // N
    }

    if (r < maxPos) {
      this.neighbours.push(cells[q][r+1]);  // S
    }

    if (q > -maxPos) {
      this.neighbours.push(cells[q-1][r]);  // SW
    }

    if (q < maxPos && r < maxPos) {
      this.neighbours.push(cells[q+1][r+1]);  // SE
    }
  }

  this.drawHex = function(x, y, xSize, col) {
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
}

function setup() {
  createCanvas(400, 400);
  w = width/rowsAndcols/sca;
  h = Math.sqrt(3)/2 * w;  // equalateral hexagons
  seconds = millis()/1000;

  // Initialize cells
  for (var i = -rowsAndcols; i <= rowsAndcols; i ++) {
    cells[i] = new Array(rowsAndcols);
  }

  for (var i = -rowsAndcols; i <= rowsAndcols; i ++) {
    for (var j = -rowsAndcols; j <= rowsAndcols; j ++) {
      cells[i][j] = new Hexagon(i, j);
    }
  }

  for (var i = -rowsAndcols; i <= rowsAndcols; i ++) {
    for (var j = -rowsAndcols; j <= rowsAndcols; j ++) {
      cells[i][j].addNeighbours(cells);
    }
  }

  start = cells[-10][-5];
  end = cells[0][0];

  openNodes.push(start);
	console.log("Opened nodes:", openNodes.length, openNodes);
}

function draw() {
  findPath(cells);
  background(100, 0, 100);
  translate(width/2, height/2);

  // Draw grid
  for (var i = -rowsAndcols; i <= rowsAndcols; i ++) {
    if (i % 2 == 0) {  // even columns
      for (var j = -rowsAndcols; j <= rowsAndcols; j ++) {
        cells[i][j].drawHex(.75*w*i, h*j, w, color(200));
      }
    } else {  // odd columns
        for (var j = -rowsAndcols; j <= rowsAndcols; j ++) {
          cells[i][j].drawHex(0.75*w*i, (.5*h)+(h*j), w, color(100));
      }
    }
  }

  // Draw open nodes
  for (var i = 0; i < openNodes.length; i ++) {
    var i_ = openNodes[i].q;
    var j_ = openNodes[i].r;

    if (i_ % 2 == 0) {
      openNodes[i].drawHex(.75*w*i_, h*j_, w, color(0,200,0));
    } else {
      openNodes[i].drawHex(.75*w*i_, (.5*h)+(h*j_), w, color(0,200,0));
    }
  }

  // Draw closed nodes
  for (var i = 0; i < closedNodes.length; i ++) {
    var i_ = closedNodes[i].q;
    var j_ = closedNodes[i].r;

    if (i_ % 2 == 0) {
      closedNodes[i].drawHex(.75*w*i_, h*j_, w, color(200,0,0));
    } else {
      closedNodes[i].drawHex(.75*w*i_, (.5*h)+(h*j_), w, color(200,0,0));
    }
  }

  // Show traversed nodes (path; yellow)
  for (var i = 0; i < path.length; i ++) {
    var i_ = path[i].q;
    var j_ = path[i].r;

    if (i_ % 2 == 0) {
      path[i].drawHex(.75*w*i_, h*j_, w, color(255,255,0));
    } else {
      path[i].drawHex(.75*w*i_, (.5*h)+(h*j_), w, color(255,255,0));
    }
  }

  // Show start node (yellow)
  if (start.q % 2 == 0) {
    cells[start.q][start.r].drawHex(.75*w*start.q, h*start.r, w, color(255));
  } else {
    cells[start.q][start.r].drawHex(.75*w*start.q, (.5*h)+(h*start.r), w, color(255));
  }

  // Show end node (blue)
  if (end.q % 2 == 0) {
    cells[end.q][end.r].drawHex(.75*w*end.q, h*end.r, w, color(0,0,200));
  } else {
    cells[end.q][end.r].drawHex(.75*w*end.q, (.5*h)+(h*end.r), w, color(200,0,200));
  }
}
