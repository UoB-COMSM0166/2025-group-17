let menuDisplayed = true;
let isGamePaused = false;
let isBossStage = false;
let btnPause, btnResume, btnExit, btnContinue, btnNewGame;

let startTime;
let timeSpent = 0;

let playerX = 50;
let playerY = 50;
let currentLevel = 1;
let currentStage = 1;

let nearSavedPosition = false;
let lastSavedPosition = { xPos: null, yPos: null };
let minDistanceToSave = 50;

let player = new Player(playerX, playerY);
let door = new Door(300, 200);

function preload() {
  heart = loadImage('assets/icons/heart.svg');
  damagedHeart = loadImage('assets/icons/damagedHeart.svg');
}

function setup() {
  cnv = createCanvas(windowWidth, windowHeight);
  adjustCanvasWithAspectRatio();
  setupMenu();
  setupPauseMenu();
  startTime = millis();
}

function windowResized() {
  adjustCanvasWithAspectRatio();
}

function draw() {
  background(220);
  if (menuDisplayed) {
    drawMenu();
  } else if (isGamePaused) {
    drawPauseMenu();     
  }
  else {
    drawUiHub();
    door.display();
    player.update();
    player.display();
    checkSavePoint();
  }
}

let boss = {
  hp: 30,
  maxHp: 100
};
