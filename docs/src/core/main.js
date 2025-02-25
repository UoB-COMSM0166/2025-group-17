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

// Add variables and functions from feature_enemies_lyz_before0225
let bullets = [], enemies = [], obstacles = [], gameState = 0;
let spawnRate = 1.2, playerHP = 10000;
let tutorialStep = 0, tutorialMessages = [
    "Clear all monsters and reach the exit to win!",
    "Use arrow keys to move and avoid obstacles & monsters.",
    "Use WSAD keys to shoot and attack monsters.",
    "You can start the game now!"
];

function generateObstacles() {
  for (let i = 0; i < 3; i++) {
    let x = random(100, width - 100);
    let y = random(100, height - 100);
    obstacles.push(new Obstacle(x, y));
  }
}

function generateEnemies() {
  // Pass in appropriate parameters as needed
  enemies.push(new Enemy(50, 50, 50));
  enemies.push(new Enemy(700, 500, 100));
}

function updateObstacles() {
  obstacles.forEach(o => o.show());
}

function updateBullets() {
  bullets.forEach(b => {
    b.update();
    b.show();
  });
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
    // Add from feature_enemies_lyz_before0225
    displayTutorial();
    updateObstacles();
    updateBullets();
    updateEnemies();
    checkPlayerEnemyCollision();
    checkWinCondition();
    checkGameOver();
    
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

// Add from feature_enemies_lyz_before0225
function keyPressed() {
  // 方向键控制移动
  if ([UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW].includes(keyCode)) {
    player.move(keyCode);
    if (tutorialStep === 1) tutorialStep++;
  }
  // WSAD 键控制射击
  if ([87, 65, 83, 68].includes(keyCode)) {
    player.shoot(keyCode);
    if (tutorialStep === 2) tutorialStep++;
  }
}

function keyReleased() {
  if ([UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW].includes(keyCode)) {
    player.stop();
  }
}

// Add done.
