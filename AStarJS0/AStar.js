// A*
// tutorial @ https://youtu.be/aKYlikFAV4k?t=32m31s

var xCols = 15;
var yRows = 15;
var grid = new Array(xCols);

var openNodes = [];
var closedNodes = [];
var start;
var end;
var path = [];
var currentNode;

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

	this.show = function(col) {
		fill(col);
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
	createCanvas(600,600);
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

	openNodes.push(start);


	console.log(openNodes.length, openNodes[0]);
}



function draw() {

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
			if(!closedNodes.includes(neighbour)) {
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
		noLoop();
	}



	// Find path
	path = [];
	var temp = currentNode;
	path.push(temp)
	while(temp.previous){
		path.push(temp.previous);
		temp = temp.previous;
	}


	// Show visuals
	background(255);

	for (var i = 0; i < xCols; i ++) {
		for (var j = 0; j < yRows; j ++) {
			grid[i][j].show(color(200));
		}
	}

	for (var i = 0; i < openNodes.length; i ++) {
		openNodes[i].show(color(0,200,0));
	}

	for (var i = 0; i < closedNodes.length; i ++) {
		closedNodes[i].show(color(200,0,0));
	}

	for (var i = 0; i < path.length; i ++) {
		path[i].show(color(0,0,200));
	}

	grid[end.i][end.j].show(color(20))

	grid[start.i][start.j].show(color(230))
}
