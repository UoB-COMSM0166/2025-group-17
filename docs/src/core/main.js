let menuDisplayed = true;
let isGamePaused = false;
let isBossStage = false;
let btnPause, btnResume, btnExit, btnContinue, btnNewGame;
let inputHandler = null;

let startTime;
let timeSpent = 0;

let savePointX = 300;
let savePointY = 200;
let currentLevel = 1;
let currentStage = 1;

let nearSavedPosition = false;
let lastSavedPosition = { xPos: null, yPos: null };
let minDistanceToSave = 50;

let player, savePoint;
let enemyCount = 5;
let obstacleCount = 5;

// Add variables and functions from feature_enemies_lyz_before0225
let enemies = [], obstacles = [];
let tutorialStep = 0, tutorialMessages = [
    "Clear all monsters and reach the exit to win!",
    "Use arrow keys to move and avoid obstacles & monsters.",
    "Use WSAD keys to shoot and attack monsters.",
    "You can start the game now!"
];

function generateObstacles() {
  obstacles = [];
  for (let i = 0; i < obstacleCount; i++) {
    let x = random(hPadding, width - hPadding);
    let y = random(vPadding, height - vPadding);
    obstacles.push(new Obstacle(x, y));
  }
}

function generateEnemies() {
  enemies = [];
  for (let i = 0; i < enemyCount; i++) {
    let x = random(hPadding, width - hPadding);
    let y = random(vPadding, height - vPadding);

    let hp = random([smallEnemyHp, largeEnemyHp]);
    enemies.push(new Enemy(x, y, hp));
  }
}

function updateObstacles() {
  obstacles.forEach(o => o.display());
}

function updateEnemies() {
  enemies.forEach(e => {
    e.update();
    e.display();
  });
}

// Add done.

function preload() {
  heart = loadImage('assets/icons/heart.svg');
  damagedHeart = loadImage('assets/icons/damagedHeart.svg');
}

function setup() {
  cnv = createCanvas(windowWidth, windowHeight);
  adjustCanvasWithAspectRatio();

  imageMode(CENTER);

  player = new Player(playerX, playerY);
  savePoint = new SavePoint(savePointX, savePointY);
  inputHandler = new InputHandler();

  setupMenu();
  setupPauseMenu();
  startTime = millis();
  generateObstacles();
  generateEnemies();
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
  } else if (isGameOver()) {
    drawGameOver();
  }
  else {
    drawUiHub();
    displayTutorial();
    updateObstacles();
    updateEnemies();
    
    inputHandler.update();
    savePoint.display();
    player.display();

    checkSavePoint();
    checkWinCondition();
  }
}

function keyPressed() {
  inputHandler.handlePlayerShooting();
}

let boss = {
  hp: 30,
  maxHp: 100
};
