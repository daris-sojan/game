var cols, rows;
var w = 200; // width of each square
var counter = 0; //counter for number of times a level has been played
var grid = [];
var stack = [];
var current; // the player's current cell
var currCellLoc = 0;
var randRow = 0;

// Setup(): line pixel weight. Even numbers only
var lineWeight = 6;

function setup() {
  createCanvas(1000, 1000);
  // frameRate(30);
  createNewMaze();
  button();
}

function button() {
    var button = createButton("Next Level");
    button.mousePressed(nextLevel);
    button.position(width-100, height-50);
    button.size(100, 50);
    button.style('font-size : 20px; background-color: #555555; color:white');
    /* if (levelCleared) {
        button.show();
        button.mousePressed(nextLevel);
        button.position(800, 850);
        button.size(100, 50);
        button.style('font-size : 20px; background-color: #555555; color:white');
    } else {
        button.hide();
    }
    */
    return;
}

function nextLevel() {
    if (counter % 3 === 0 &&  counter != 0) {
      w /= 2;
      counter = 0;
    }
    console.log("next level");
    createNewMaze();
    return;
}

// draw() loops forever until stopped. Set fps with frameRate(30)
// function draw() {}

// function windowResized() {
//   resizeCanvas(windowWidth, windowHeight);
//   createNewMaze();
// }

// Current cell goes back to the top left starting position.
function createNewMaze() {
  clear();
  grid = [];
  stack = [];
  currCellLoc = 0;

  // floor function makes sure that we are dealing with integers, no matter the canvas size
  cols = floor(width / w);
  rows = floor(height / w);

  // gets random row for endSquare
  randRow = randomNumber(0, rows-1);

  for (var j = 0; j < rows; j++) {
    for (var i = 0; i < cols; i++) {
      var cell = new Cell(i, j);
      grid.push(cell);
    }
  }

  current = grid[currCellLoc];
  while (true) {
    for (var i = 0; i < grid.length; i++) {
      grid[i].show();
    }

    current.visited = true;
    var next = current.checkNeighbors();

    if (next) {
      next.visited = true;
      stack.push(current);
      removeWalls(current, next);
      current = next;
    } else if (stack.length > 0) {
      current = stack.pop();
    }

    if (current == grid[0]) {
      console.log("maze created");
      current.highlightPlayer(0, 255, 0);
      break;
    }
  }

  // Draws a black border on the canvas
  strokeWeight(lineWeight);
  stroke(0);
  line(0, 0, 0, height);
  line(0, height, width, height);
  line(width, height, width, 0);
  line(width, 0, 0, 0);
}

// More key presses for p5js can be found at https://p5js.org/reference/#/p5/keyPressed
function keyPressed() {
  var next = undefined;
  if (keyCode == UP_ARROW) {
    console.log("up");
    if (!current.walls[0]) {
      currCellLoc -= cols;
      next = grid[currCellLoc];
    }
  } else if (keyCode == RIGHT_ARROW) {
    console.log("right");
    if (!current.walls[1]) {
      currCellLoc += 1;
      next = grid[currCellLoc];
    }
  } else if (keyCode == DOWN_ARROW) {
    console.log("down");
    if (!current.walls[2]) {
      currCellLoc += cols;
      next = grid[currCellLoc];
    }
  } else if (keyCode == LEFT_ARROW) {
    console.log("left");
    if (!current.walls[3]) {
      currCellLoc -= 1;
      next = grid[currCellLoc];
    }
  } else if (keyCode == ENTER) {
    console.log("enter");
    counter++;
    createNewMaze();
    return;
  } else if(keyCode == SHIFT) {
    console.log("next level");
    nextLevel();
  }

  if (next !== undefined) {
    // Erase so we're not drawing on top of a color
    erase();
    current.highlightPlayer(0, 0, 0, true);
    noErase();
    current.highlightPlayer(75, 156, 211, true);            //background color

    // Highlight the valid next position given by the user
    current = next;
    current.highlightPlayer(0, 255, 0, false);
  }
}

// Setup()
function index(i, j) {

  if (i < 0 || j < 0 || i > cols - 1 || j > rows - 1) {
    return -1;
  }
  // Turns 2D space into a 1D array of cells
  return i + j * cols;
}

function Cell(i, j) {
  this.i = i;
  this.j = j;
  this.walls = [true, true, true, true]; //top, right, bottom, left
  this.visited = false;

  // Setup(): Chooses wall positions based off cells already visited and randomization.
  this.checkNeighbors = function () {
    var neighbors = [];

    var top = grid[index(i, j - 1)];
    var right = grid[index(i + 1, j)];
    var bottom = grid[index(i, j + 1)];
    var left = grid[index(i - 1, j)];

    if (top && !top.visited) {
      neighbors.push(top);
    }
    if (right && !right.visited) {
      neighbors.push(right);
    }
    if (bottom && !bottom.visited) {
      neighbors.push(bottom);
    }
    if (left && !left.visited) {
      neighbors.push(left);
    }

    if (neighbors.length > 0) {
      var r = floor(random(0, neighbors.length));
      return neighbors[r];
    } else {
      return undefined;
    }
  }

  // Setup(): Creates lines to act as the walls of the maze.
  this.show = function () {
    var x = this.i * w;
    var y = this.j * w;

    strokeWeight(lineWeight);
    stroke(0);

    if (this.walls[0]) {
      line(x, y, x + w, y);
    }
    if (this.walls[1]) {
      line(x + w, y, x + w, y + w);
    }
    if (this.walls[2]) {
      line(x + w, y + w, x, y + w);
    }
    if (this.walls[3]) {
      line(x, y + w, x, y);
    }

    if (this.visited) {
      // Erase before drawing over a cell color
      noStroke();
      erase();
      fill(0, 0, 0);
      rect(x + (lineWeight / 2), y + (lineWeight / 2), w, w);
      noErase();
      // Draw (background color)
      fill(75, 156, 211); // TarHeel blue background
      rect(x + (lineWeight / 2), y + (lineWeight / 2), w, w);

      // Places endSquare on top
      let lastCol = (Math.sqrt(grid.length)) - 1;
      noStroke();
      fill(51, 153, 51); // TarHeel blue background
      rect(lastCol*w, randRow*w, w-5, w-5);
    }
  }

  // Specify an rgb value ranging from 0-255 for each
  this.highlightPlayer = function (r, g, b, erase) {
    var x = this.i * w;
    var y = this.j * w;
    noStroke();
    fill(r, g, b);
    (erase) ? rect(x + (w / 6), y + (w / 6), w / 1.5, w / 1.5) : rect(x + (w / 4), y + (w / 4), w / 2, w / 2);
  }
}

// Setup()
function removeWalls(a, b) {
  var x = a.i - b.i;
  if (x === 1) {
    a.walls[3] = false;
    b.walls[1] = false;
  } else if (x === -1) {
    a.walls[1] = false;
    b.walls[3] = false;
  }

  var y = a.j - b.j;
  if (y === 1) {
    a.walls[0] = false;
    b.walls[2] = false;
  } else if (y === -1) {
    a.walls[2] = false;
    b.walls[0] = false;
  }
}

// Gets random border tile to use as endSquare (min, max inclusive)
function randomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}