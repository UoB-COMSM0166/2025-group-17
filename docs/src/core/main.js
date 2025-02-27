let pauseSound = new Audio("assets/music/Pause.mp3");
let hitSound = new Audio("assets/music/Enemy_Hurt.mp3");
let deathSound = new Audio("assets/music.Enemy_Death.mp3");
let shootSound = new Audio("assets/music/Player_Shoot.mp3");
let hurtSound = new Audio("assets/music/Player_Hurt.mp3");
let deathSound2 = new Audio("assets/music/Player_Death.mp3");
let walkSound = new Audio("assets/music/Player_Walk.mp3");
walkSound.loop = true;

function generateObstacles() {
  obstacles = [];
  for (let i = 0; i < obstacleCount; i++) {
    let x = random(hPadding, widthInPixel - hPadding);
    let y = random(vPadding, heightInPixel - vPadding);
    obstacles.push(new Obstacle(x, y));
  }
}

function generateEnemies() {
  enemies = [];
  for (let i = 0; i < enemyCount; i++) {
    let x = random(hPadding, widthInPixel - hPadding);
    let y = random(vPadding, heightInPixel - vPadding);

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

function preload() {
  heart = loadImage('assets/icons/heart.svg');
  damagedHeart = loadImage('assets/icons/damagedHeart.svg');
}

function setup() {
  cnv = createCanvas(windowWidth, windowHeight);
  adjustCanvasWithAspectRatio();
  player = new Player(playerX, playerY);
  savePoint = new SavePoint(savePointX, savePointY);
  inputHandler = new InputHandler();

  setupMenu();
  setupPauseMenu();
  startTime = millis();
  generateObstacles();
  generateEnemies();
}

function draw() {
  // push();
  adjustCanvasWithAspectRatio();
  background(220);
  if (menuDisplayed) {
    drawMenu();
  } else if (isGamePaused) {
    drawPauseMenu();
  } else if (isGameOver()) {
    drawGameOver();
  }
  else {
    displayTutorial();
    updateObstacles();
    updateEnemies();
    
    inputHandler.update();
    savePoint.display();
    player.display();
    drawUiHub();

    checkSavePoint();
    checkWinCondition();
  }
  // pop();
}

function keyPressed() {
  inputHandler.handlePlayerShooting();
}

let boss = {
  hp: 30,
  maxHp: 100
};
