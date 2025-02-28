function checkSavePoint() {
  // Save when player crosses the target position
  const distanceX = abs(player.position.x - room.savePoint.position.x);
  const distanceY = abs(player.position.y - room.savePoint.position.y);
  if (!nearSavedPosition && distanceX < player.size.x && distanceY < player.size.y) {
    saveGameData();
    nearSavedPosition = true;
  }

  const moveDistance = dist(player.position.x, player.position.y, lastSavedPosition.xPos, lastSavedPosition.yPos);
  if (nearSavedPosition && moveDistance > minDistanceToSave) {
    console.log("Can be saved again!");
    nearSavedPosition = false;
  }
}

function saveGameData() {
  if (nearSavedPosition) return;

  localStorage.setItem('lastSavePoint', JSON.stringify(room.savePoint));
  localStorage.setItem('playerHp', JSON.stringify(player.hp));
  lastSavedPosition.xPos = room.savePoint.position.x;
  lastSavedPosition.yPos = room.savePoint.position.y;
  console.log("Game Saved!");
}

function loadGameData() {
  room.generateEnemies();
  room.generateObstacles();
  let savedPosition = localStorage.getItem('lastSavePoint');
  let playerHp = localStorage.getItem('playerHp');
  if (!savedPosition || !playerHp) {
    console.log("No save data found; starting from scratch...");
    return startNewGame();
  }

  savedPosition = JSON.parse(savedPosition);
  player.position.x = savedPosition.position.x;
  player.position.y = savedPosition.position.y;
  player.hp = JSON.parse(playerHp);
  console.log("Game Loaded!");
  
  menuDisplayed = false;
  toggleButtons();
}

function startNewGame() {
  console.log("New Game Start!");
  resetGame();
  menuDisplayed = false;
  toggleButtons();
}

// Hide the buttons once they are clicked on the start menu
function toggleButtons() {
  btnContinue.hide();
  btnNewGame.hide();
  btnPause.show();
}

function pauseGame() {
  pauseTime = millis();
  console.log("Game pause!");

  if (pauseSound) {
    pauseSound.play();
  }
  isGamePaused = true;
  btnPause.hide();
  btnResume.show();
  btnExit.show();
}

function resumeGame() {
  console.log("Game resume!")
  isGamePaused = false;
  btnResume.hide();
  btnExit.hide();
  btnPause.show();
  startTime += millis() - pauseTime;
}

function exitGame() {
  console.log("Exit to the start menu!")
  isGamePaused = false;
  drawMenu();
  btnPause.hide();
  btnResume.hide();
  btnExit.hide();
  btnNewGame.show();
  btnContinue.show();
  menuDisplayed = true;
}

function resetGame() {
  menuDisplayed = false;
  isGamePaused = false;
  gameOver = false;
  
  player = new Player(playerX, playerY);
  room = new Room();
  room.setup();
  inputHandler = new InputHandler(room);
  console.log("Game is reset!")
}

function isGameOver() {
  return player.hp <= 0;
}

function loadRoom() {
  
}

