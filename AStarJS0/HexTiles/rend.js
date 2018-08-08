var hexagons;
var file = 'out.json';


function setup () {
  loadJSON('out.json', gotData);
  createCanvas(windowWidth, windowHeight);
}


function draw () {
  background(100, 0, 120);
  translate(width/2, height/2);

  if(hexagons){
    console.log("Data loaded.");
    noLoop();

    // ==== Define size to draw hexagons (size is a function of how many rings exist) ====
    var rings = hexagons.details.max_ring;  // the largest cube coordinate
                                            // defines the distance from origin in rings
    var w = width/((rings*2)+1)
    var h = Math.sqrt(3)/2 * w;

    // Draw grid
    for (var i = -rings*2; i <= rings*2; i ++) {
      var col = [100, 0, 120]
      stroke(50, 0, 50);
      if (Math.abs(i % 2) == 0) {  // even columns
        for (var j = -rings*2; j <= rings*2; j ++) {
          drawHexagon(.75*w*i, h*j, w, col);
        }
      } else {  // odd columns
          for (var j = -rings*2; j <= rings*2; j ++) {
            drawHexagon(0.75*w*i, (.5*h)+(h*j), w, col);
        }
      }
    }

    // ==== Draw outbound path ====
    var pathOut = hexagons.outbound_path

    for (var i = 0; i < pathOut.length; i++) {
      noStroke();
      var currentHexagon = pathOut[i];
      if( i == pathOut.length-1) {
        var col = [100, 200, 100]
      } else if(i == 0) {
        var col = [100, 100, 100]
      } else {
        var col = [200, 100, 200];
      }
      // offset of 1/2 verticle unit for drawing odd columns
      if (currentHexagon[0] % 2 == 0) {
        drawHexagon(currentHexagon[0]*0.75*w, currentHexagon[1]*h, w, col);
      } else {
        drawHexagon(currentHexagon[0]*0.75*w, (currentHexagon[1]*h)+(.5*h), w, col);
      }
    }

    // ==== Draw open nodes, closed nodes, and inbound (shortest) path ====
    var shortestPath = hexagons.shortest_path;

    for (var i = 0; i < shortestPath.length; i++) {
      noStroke();
      var currentHexagon = shortestPath[i];
      if( i == pathOut.length-1) {
        var col = [120, 20, 120]
      } else if(i == 0) {
        var col = [100, 200, 100]
      } else {
        var col = [200, 200, 100];
      }
      // offset of 1/2 verticle unit for drawing odd columns
      if (currentHexagon[0] % 2 == 0) {
        drawHexagon(currentHexagon[0]*0.75*w, currentHexagon[1]*h, w, col)
      } else {
        drawHexagon(currentHexagon[0]*0.75*w, (currentHexagon[1]*h)+(.5*h), w, col)
      }
    }

    console.log("The shortest path (in yellow) is: ", shortestPath);
    console.log("Its %s nodes long.", shortestPath.length);
    console.log("The original path (in pink) was: ", pathOut);
    console.log("Its %s nodes long.", pathOut.length);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function gotData(input){
  hexagons = input;
  console.log("Waiting for data...");
}
