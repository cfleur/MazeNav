// A*
// tutorial @ https://youtu.be/aKYlikFAV4k?t=32m31s

var xCols = 25;
var yRows = 25;
var grid = new Array(xCols);

var openNodes = [];
var closedNodes = [];
var start;
var end;
var path = [];
var currentNode;
var noSolution = false;

var w, h;

function removeNode(nodeArray_, node_){
	for (var i = nodeArray_.length-1; i >= 0; i--) {
		if (nodeArray_[i] == node_) {
			nodeArray_.splice(i, 1);
		}
	}
}

// Manhattan distance
function heuristic(a, b) {
	var d = abs(a.i - b.i) + abs(a.j - b.j);
	return d;
}

// // Euclidean distance
// function heuristic(a, b) {
// 	var d = dist(a.i, b.i, a.j, b.j);
// 	return d;
// }

function Node(i,j) {
	this.i = i;
	this.j = j;
	this.f = 0;
	this.g = 0;
	this.h = 0;
	this.neighbours = [];
	this.previous = undefined;
	this.wall = false;

	if (random(1) < 0.4) {
		this.wall = true;
	}

	this.show = function(col) {
		fill(col);
		if (this.wall) {
			fill(20);
		}
		noStroke();
		rect(this.i * w, this.j * h, w - 1, h - 1);
	}

	this.addNeighbours = function(grid) {
		var i = this.i;
		var j = this.j;
		if (i < xCols - 1) {
			this.neighbours.push(grid[i + 1][j])
		}
		if (i > 0) {
			this.neighbours.push(grid[i - 1][j])
		}
		if (j < yRows - 1) {
			this.neighbours.push(grid[i][j + 1])
		}
		if (j > 0) {
			this.neighbours.push(grid[i][j - 1])
		}
	}
}



function setup() {
	createCanvas(400,400);
	console.log("----- A* p5.js implementation -----");

	w = width/xCols;
	h = height/yRows;

	for (var i = 0; i < xCols; i ++) {
		grid[i] = new Array(yRows);
	}

	for (var i = 0; i < xCols; i ++) {
		for (var j = 0; j < yRows; j ++) {
			grid[i][j] = new Node(i,j);
		}
	}

	for (var i = 0; i < xCols; i ++) {
		for (var j = 0; j < yRows; j ++) {
			grid[i][j].addNeighbours(grid);
		}
	}

	start = grid[1][2]; // start position
	end = grid[yRows-4][xCols-9]; // end position
	start.wall = false;
	end.wall = false;

	openNodes.push(start);


	console.log(openNodes.length, openNodes[0]);
}



function draw() {

	// Algorithm
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
			console.log("Maze solved.");
		}


		removeNode(openNodes, currentNode);
		closedNodes.push(currentNode);

		var neighbours = currentNode.neighbours;

		for(var i = 0; i < neighbours.length; i++) {
			var neighbour = neighbours[i];
			if(!closedNodes.includes(neighbour) && !neighbour.wall) {
				var tempG = currentNode.g + 1;  // + 1 == distance between neighbour and current

				if(openNodes.includes(neighbour)){
					if(tempG < neighbour.g){
						neighbour.g = tempG;
					}
				} else {
					neighbour.g = tempG;
					openNodes.push(neighbour);
				}

				neighbour.h = heuristic(neighbour, end);
				neighbour.f = neighbour.g + neighbour.h
				neighbour.previous = currentNode;
			}
		}

	} else {
		// no soloution
		console.log("No solution");
		noSolution = true;
		noLoop();
	}



	// Find path
	if (!noSolution) {
		path = [];
		var temp = currentNode;
		path.push(temp)
		while(temp.previous){
			path.push(temp.previous);
			temp = temp.previous;
		}
	}


	// Show visuals

	// Color of gridlines
	background(255);

	// Show grid
	for (var i = 0; i < xCols; i ++) {
		for (var j = 0; j < yRows; j ++) {
			grid[i][j].show(color(200));
		}
	}

	// Show open nodes (green)
	for (var i = 0; i < openNodes.length; i ++) {
		openNodes[i].show(color(0,200,0));
	}

	// Show closed nodes (red)
	for (var i = 0; i < closedNodes.length; i ++) {
		closedNodes[i].show(color(200,0,0));
	}

	// Show traversed nodes (path; blue)
	for (var i = 0; i < path.length; i ++) {
		path[i].show(color(0,0,200));
	}

	// Show start node (yellow)
	grid[start.i][start.j].show(color(200,200,0))

	// Show end node (purple)
	grid[end.i][end.j].show(color(200,0,200))

}
