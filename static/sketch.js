var cols, rows;
var w = 280; // width of each square
var canvas, canvasSize = 560, canvasPosX, canvasPosY;
var counter = 1; // counter for number of times a level has been played
var grid = [];
var stack = [];
var current; // the player's current cell
var currCellLoc = 0; // 1d representation of the current cell's index

// row and col of the final destination
var randRow = 0;
var lastCol = 0;

var level = 1;
var profIdx = 0; // current professor image

var synth = window.speechSynthesis;

var isMobile = detectMobileBrowser();

// get audio element
var successSound = document.querySelector('#success');
var failSound = document.querySelector("#fail");
var mobileFailSound = document.querySelector("#fail");
var nextLevelSound = document.querySelector('#nextlevel');
var ambientSound = document.querySelector('#ambient');

// Setup(): line pixel weight. Even numbers only
var lineWeight = 6;

var imgs = [];
var imgSit;
function preload() {
  imgs.push(loadImage(typeof stickmanPath !== 'undefined' ? stickmanPath : 'static/imgs/stickman.png'));
  imgSit = loadImage(typeof goalPath !== 'undefined' ? goalPath : 'static/imgs/goal.png');
}

function setup() { }

/*
function newMazeButton() {
  var button = createButton("New Maze");
  button.mousePressed(createNewMaze);
  button.position(width - 100, height - 50);
  button.size(100, 50);
  button.style('font-size : 20px; background-color: #555555; color:white');
  return;
}

function previousLevelButton() {
  var button = createButton("Previous Level");
  button.mousePressed(previousLevel);
  button.position(width - 210, height - 50);
  button.size(100, 50);
  button.style('font-size : 20px; background-color: #555555; color:white');
  return;
}

function playAgainButton() {
  var button = createButton("Play Again");
  button.position(width - 320, height - 50);
  button.size(100, 50);
  button.style('font-size : 20px; background-color: #555555; color:white');
  button.mousePressed(playAgain);
  return;
}
*/

function nextLevel() {
  if (counter % 3 === 0 && counter != 0) {
    w /= 2;
    level++;
    console.log("Level: " + level);
    counter = 1;
  } else {
    counter++;
  }
  console.log("Counter = " + counter);
  return;
}

function previousLevel() {
  if (level > 1) {
    w *= 2;
    level -= 1;
    counter = 1;
  }
  createNewMaze();
  return;
}

function playAgain() {
  var playAgainButton = document.getElementById("play-again")
  w = w * (Math.pow(2, level - 1));
  level = 1;
  counter = 1;
  createNewMaze();
  playAgainButton.style.visibility = "hidden";
  return;
}

// draw() loops forever until stopped. Set fps with frameRate(30)
// function draw() {}

function windowResized() {
  if (!checkCanvasScreenSize() && canPlay() && loaded) {
    resizeCanvas(canvasSize, canvasSize);
    canvas.position(canvasPosX, canvasPosY);
    createNewMaze();
  }
}

// Current cell goes back to the top left starting position.
function createNewMaze() {
  if (document.activeElement != document.body) document.activeElement.blur();
  var playAgainButton = document.getElementById("play-again")
  playAgainButton.style.visibility = "hidden";
  clear();
  grid = [];
  stack = [];
  currCellLoc = 0;

  // floor function makes sure that we are dealing with integers, no matter the canvas size
  cols = floor(width / w);
  rows = floor(height / w);

  // gets random row for endSquare
  randRow = randomNumber(0, rows - 1);

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

  if (successSound) adjustGoalSound();
  document.getElementById("level").innerHTML = `Level: ${level}`;
}

// More key presses for p5js can be found at https://p5js.org/reference/#/p5/keyPressed
function keyPressed() {
  if (!canPlay() || isMobile || !nextLevelSound.paused || spacePlayAgain) return;
  track.connect(panner).connect(audioContext.destination);

  // Reset panner position back to the center
  panner.positionX.value = originalPos.x;
  panner.positionY.value = originalPos.y;
  panner.positionZ.value = originalPos.z;

  if (keyCode == UP_ARROW) {
    moveUp();
  } else if (keyCode == RIGHT_ARROW) {
    moveRight();
  } else if (keyCode == DOWN_ARROW) {
    moveDown();
  } else if (keyCode == LEFT_ARROW) {
    moveLeft();
  } else if (keyCode == ENTER) {
    console.log("enter");
    createNewMaze();
    return;
  } else if (keyCode == SHIFT) { //previous level 
    console.log("shift: previous level");
    previousLevel();
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
      lastCol = (Math.sqrt(grid.length)) - 1;
      noStroke();
      fill(51, 153, 51); // dark green background
      image(imgSit, lastCol * w + (lineWeight / 2), randRow * w + (lineWeight / 2), w, w - lineWeight);
    }
  }

  // Draw a bit extra after erasing
  this.fillAfterErase = function (r, g, b) {
    var x = this.i * w;
    var y = this.j * w;
    noStroke();
    fill(r, g, b);
    rect(x + (w / 8), y + (w / 8), 3 * w / 4, 3 * w / 4);
  }

  //checks if current maze has been completed and goes to the next maze/level
  // depending on the counter's value 
  this.mazeCleared = function () {
    if (isFinalRowCol()) {
      console.log("same level: different maze");
      nextLevelSound.pause();
      nextLevelSound.currentTime = 0;
      nextLevelSound.play();

      profIdx++;
      profIdx = (profIdx > 11) ? 0 : profIdx;

      if (level === 4 && counter % 3 === 0) {
        //play "you win" sound
        var playAgainButton = document.getElementById("play-again")
        playAgainButton.style.visibility = "visible";
        let msg = new SpeechSynthesisUtterance("You win! The professors are home... Press the space bar to play again.");
        synth.speak(msg);
        spacePlayAgain = true;
      } else {
        nextLevel();
      }
    }
    console.log("entered maze cleared function");
    return;
  }

  // Specify an rgb value ranging from 0-255 for each
  this.highlightPlayer = function (r, g, b, erase) {
    var x = this.i * w;
    var y = this.j * w;
    noStroke();
    fill(r, g, b);
    (erase) ? rect(x + (w / 6), y + (w / 6), w / 1.5, w / 1.5) : image(imgs[0], x + (w / 4), y + (w / 4), w / 2, w / 2);
  }
}

nextLevelSound.addEventListener("ended", function () {
  if (!spacePlayAgain) {
    nextLevelSound.currentTime = 0;
    console.log("ended");
    createNewMaze();
    let msg = new SpeechSynthesisUtterance('Level ' + level);
    synth.speak(msg);
  }
});

function getCurrRow() {
  return floor(currCellLoc / cols);
}

function getCurrCol() {
  return (currCellLoc - (cols * getCurrRow()));
}

function isFinalRowCol() {
  return (getCurrRow() === randRow && getCurrCol() === lastCol);
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

function moveUp() {
  if (!nextLevelSound.paused || spacePlayAgain) return;

  if (!isMobile) {
    track.connect(panner).connect(audioContext.destination);
    // Reset panner position back to the center
    panner.positionX.value = originalPos.x;
    panner.positionY.value = originalPos.y;
    panner.positionZ.value = originalPos.z;
  }
  console.log("up");
  let next = undefined;
  if (!current.walls[0]) {
    console.log("SUCCESS!")
    currCellLoc -= cols;
    next = grid[currCellLoc];
    stopAndPlaySound();
    var upArrow = document.getElementById("upArrow");
    if (upArrow) upArrow.focus();
  } else {
    console.log("hit a wall...")
    if (!isMobile) {
      panner.positionY.value += 5000;
      failSound.play()
    } else {
      mobileFailSound.play();
    }
  }
  var upArrow = document.getElementById("upArrow");
  if (upArrow) {
    upArrow.style.backgroundColor = "green";
    setTimeout(function () {
      upArrow.style.backgroundColor = "#4B9CD3";
    }, 200);
  }
  movePlayer(next);
}

function moveDown() {
  if (!nextLevelSound.paused || spacePlayAgain) return;

  if (!isMobile) {
    track.connect(panner).connect(audioContext.destination);

    // Reset panner position back to the center
    panner.positionX.value = originalPos.x;
    panner.positionY.value = originalPos.y;
    panner.positionZ.value = originalPos.z;
  }
  let next = undefined;
  console.log("down");
  // audioContext.close()

  console.log("down");
  if (!current.walls[2]) {
    console.log("SUCCESS!")
    currCellLoc += cols;
    next = grid[currCellLoc];
    stopAndPlaySound();
    var downArrow = document.getElementById("downArrow");
    if (downArrow) downArrow.focus();
  } else {
    console.log("hit a wall...")
    if (!isMobile) {
      panner.positionY.value -= 5000;
      failSound.play()
    } else {
      mobileFailSound.play();
    }
  }
  var downArrow = document.getElementById("downArrow");
  if (downArrow) {
    downArrow.style.backgroundColor = "green";
    setTimeout(function () {
      downArrow.style.backgroundColor = "#4B9CD3";
    }, 200);
  }
  movePlayer(next);
}

function moveLeft() {
  if (!nextLevelSound.paused || spacePlayAgain) return;

  if (!isMobile) {
    track.connect(panner).connect(audioContext.destination);
    // Reset panner position back to the center
    panner.positionX.value = originalPos.x;
    panner.positionY.value = originalPos.y;
    panner.positionZ.value = originalPos.z;
  }
  let next = undefined;
  console.log("left");
  if (!current.walls[3]) {
    console.log("SUCCESS!")
    currCellLoc -= 1;
    next = grid[currCellLoc];
    stopAndPlaySound();
    var leftArrow = document.getElementById("leftArrow");
    if (leftArrow) leftArrow.focus();
  } else {
    console.log("hit a wall...")
    if (!isMobile) {
      panner.positionX.value -= 5000;
      failSound.play()
    } else {
      mobileFailSound.play();
    }
  }
  var leftArrow = document.getElementById("leftArrow");
  if (leftArrow) {
    leftArrow.style.backgroundColor = "green";
    setTimeout(function () {
      leftArrow.style.backgroundColor = "#4B9CD3";
    }, 200);
  }
  movePlayer(next);
}

function moveRight() {
  if (!nextLevelSound.paused || spacePlayAgain) return;

  if (!isMobile) {
    track.connect(panner).connect(audioContext.destination);

    // Reset panner position back to the center
    panner.positionX.value = originalPos.x;
    panner.positionY.value = originalPos.y;
    panner.positionZ.value = originalPos.z;
  }

  console.log("right");
  let next = undefined;
  if (!current.walls[1]) {
    console.log("SUCCESS!")
    currCellLoc += 1;
    next = grid[currCellLoc];
    stopAndPlaySound();
    var rightArrow = document.getElementById("rightArrow");
    if (rightArrow) rightArrow.focus();
  } else {
    console.log("hit a wall...")
    if (!isMobile) {
      panner.positionX.value += 5000;
      failSound.play()
    } else {
      mobileFailSound.play();
    }
  }
  var rightArrow = document.getElementById("rightArrow");
  if (rightArrow) {
    rightArrow.style.backgroundColor = "green";
    setTimeout(function () {
      rightArrow.style.backgroundColor = "#4B9CD3";
    }, 200);
  }
  movePlayer(next);
}

function movePlayer(next) {
  // place a new cell   
  if (next !== undefined) {
    // Erase so we're not drawing on top of a color
    erase();
    current.highlightPlayer(0, 0, 0, true);
    noErase();
    current.fillAfterErase(75, 156, 211);

    // Highlight the valid next position given by the user
    current = next;
    current.highlightPlayer(0, 255, 0, false);
    current.mazeCleared();

    adjustGoalSound();
  }
}

function stopAndPlaySound() {
  if (!isFinalRowCol()) {
    successSound.pause();
    successSound.currentTime = 0;
    successSound.play();
  }
}

// logarithmic volume from the player to the destination point (i.e. Sitterson)
function adjustGoalSound() {
  let audioSrcVolPercentage = 0.25; // max volume percentage of the audio source
  audioSrcVolPercentage *= 2; // adjust for volume when 1 row or col away from the final point

  let rowDiff = abs(randRow - getCurrRow());
  let colDiff = abs(lastCol - getCurrCol());
  let cellDiff = rowDiff + colDiff;

  let maxCellDistance = rows + cols - 2; // from one corner to the opposite corner

  let multiplier = Math.pow(2, maxCellDistance - cellDiff) / Math.pow(2, maxCellDistance);
  multiplier *= audioSrcVolPercentage;

  console.log('plaisted volume: ' + multiplier);

  if (!isMobile) {
    document.getElementById("ambient").volume = multiplier;
  }
  //else {
  //  mobileAmbientSound.volume = multiplier;
  //}
}

// Global vars for audio
var track, audioContext, panner, originalPos;
var pannerAmbient, ambientCurrPos, ambientOriginalPos;
// var mobileAmbientSound;
function createSound() {
  // establish audio context
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  audioContext = new AudioContext;

  // Unfortunately, iOS and other mobile platforms don't allow for volume control. Removing goal sound
  // mobileAmbientSound = document.querySelector('#ambient');
  // mobileAmbientSound = new Audio("sounds/plaisted.mp3");

  if (isMobile) {
    // mobileAmbientSound.play();
    // mobileAmbientSound.loop = true;
  } else {
    // pass track into audio context
    track = audioContext.createMediaElementSource(failSound);
    trackAmbient = audioContext.createMediaElementSource(ambientSound);
    // connect track to context
    // track.connect(audioContext.destination);

    // listener for the specific context
    let listener = audioContext.listener;


    // set in the center of the screen
    const posX = window.innerWidth / 2;
    const posY = window.innerHeight / 2;
    const posZ = 300;
    originalPos = { x: posX, y: posY, z: posZ - 5 };

    listener.forwardX.value = 0;
    listener.forwardY.value = 0;
    listener.upZ.value = 0;

    // situate the listener object
    listener.positionX.value = originalPos.x;
    listener.positionY.value = originalPos.y;
    listener.positionZ.value = originalPos.z;


    const pannerModel = 'HRTF';
    const innerCone = 60;
    const outerCone = 90;
    const outerGain = 0.3;
    const distanceModel = 'linear';
    const maxDistance = 10000;
    const refDistance = 1;
    const rollOff = 10;
    const positionX = posX;
    const positionY = posY;
    const positionZ = posZ;
    const orientationX = 0.0;
    const orientationY = 0.0;
    const orientationZ = -1.0;


    panner = new PannerNode(audioContext, {
      panningModel: pannerModel,
      distanceModel: distanceModel,
      positionX: positionX,
      positionY: positionY,
      positionZ: positionZ,
      orientationX: orientationX,
      orientationY: orientationY,
      orientationZ: orientationZ,
      refDistance: refDistance,
      maxDistance: maxDistance,
      rolloffFactor: rollOff,
      coneInnerAngle: innerCone,
      coneOuterAngle: outerCone,
      coneOuterGain: outerGain
    })

    const ambientInnerCone = 30;
    const ambientOuterCone = 45;
    const ambientOuterGain = 0.15;

    pannerAmbient = new PannerNode(audioContext, {
      panningModel: pannerModel,
      distanceModel: distanceModel,
      positionX: positionX,
      positionY: positionY,
      positionZ: positionZ,
      orientationX: orientationX,
      orientationY: orientationY,
      orientationZ: orientationZ,
      refDistance: refDistance,
      maxDistance: maxDistance,
      rolloffFactor: rollOff,
      coneInnerAngle: ambientInnerCone,
      coneOuterAngle: ambientOuterCone,
      coneOuterGain: ambientOuterGain
    })

    ambientCurrPos = { x: posX, y: posY, z: posZ - 5 + 9000 };
    ambientOriginalPos = ambientCurrPos;

    trackAmbient.connect(pannerAmbient).connect(audioContext.destination);
    ambientSound.play();
    document.getElementById("ambient").loop = true;
    adjustGoalSound();
  }
}

function loadGame() {
  if (loaded) {
    synth.cancel();
    checkCanvasScreenSize();
    canvas = createCanvas(canvasSize, canvasSize);
    canvas.position(canvasPosX, canvasPosY);
    document.getElementById("intro").style.display = 'none';
    document.getElementById("startGameBtn").style.display = 'none';
    document.getElementById("buttons").style.display = 'block';

    // nextLevelSound = document.querySelector('#nextlevel')
    // nextLevelSound.play();

    createNewMaze();
    createSound();
  }
}

function checkCanvasScreenSize() {
  let tempSize = canvasSize;
  if (window.innerWidth < 1250) {
    w = 240 / level;
    canvasSize = 480;
    canvasPosX = 5;
    canvasPosY = 100;
  } else {
    w = 280 / level;
    canvasSize = 560;
    canvasPosX = 50;
    canvasPosY = 100;
  }
  return tempSize == canvasSize;
}

function canPlay() {
  return document.getElementById("intro").style.display == "none";
}

function detectMobileBrowser() {
  return (navigator.userAgent.match(/Android/i)
    || navigator.userAgent.match(/webOS/i)
    || navigator.userAgent.match(/iPhone/i)
    || navigator.userAgent.match(/iPad/i)
    || navigator.userAgent.match(/iPod/i)
    || navigator.userAgent.match(/BlackBerry/i)
    || navigator.userAgent.match(/Windows Phone/i));
}

/// Listeners
var loaded = false;
window.addEventListener('load', function () {
  // set interval
  var tid = setInterval(mycode, 100);
  function mycode() {
    var element = document.getElementById("defaultCanvas0");
    if (element) abortTimer(tid);
    console.log('hello');
  }
  function abortTimer() {
    clearInterval(tid);
    loaded = true;
  }
  document.getElementById("level").innerHTML = `Level: ${level}`;
})

document.documentElement.addEventListener(
  "mousedown", function () {
    if (window.Tone) {
      if (window.Tone.context.state !== 'running') {
        Tone.context.resume();
      }
    }
  })

var spaceLoad = false;
var spacePlayAgain = false;
document.body.onkeyup = function (e) {
  if (e.keyCode == 32) {
    if (!spaceLoad) {
      spaceLoad = true;
      let msg = new SpeechSynthesisUtterance('Level one');
      synth.speak(msg);
      loadGame();
    } else if (spacePlayAgain) {
      level = 1;
      counter = 1;
      synth.cancel();
      let msg = new SpeechSynthesisUtterance('Level ' + level);
      synth.speak(msg);
      createNewMaze();
      spacePlayAgain = false;
    }
  } else if (e.keyCode == 9 && !spaceLoad) { // tab
    if (synth.speaking) synth.cancel();
    let msg = new SpeechSynthesisUtterance(document.getElementById("intro").textContent);
    synth.speak(msg);
  }
}