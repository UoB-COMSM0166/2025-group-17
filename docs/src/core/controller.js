function checkSavePoint() {
  // Save when player crosses the target position
  if (!nearSavedPosition && dist(player.xPos, player.yPos, door.xPos, door.yPos) < playerSize / 2) {
    saveGameData();
    nearSavedPosition = true;
  }
  if (nearSavedPosition && dist(player.xPos, player.yPos, lastSavedPosition.xPos, lastSavedPosition.yPos) > minDistanceToSave) {
    console.log("Can be saved again!");
    nearSavedPosition = false;
  }
}

function saveGameData() {
  if (nearSavedPosition) return;
  
  let gameState = {
    xPos: door.xPos,
    yPos: door.yPos
  };

  localStorage.setItem('gameState', JSON.stringify(gameState));
  lastSavedPosition.xPos = gameState.xPos;
  lastSavedPosition.yPos = gameState.yPos;
  console.log("Game Saved!");
}

function loadGameData() {
  let savedGame = localStorage.getItem('gameState');
  if (!savedGame) {
    console.log("No save data found; starting from scratch...");
    return startNewGame();
  }

  savedGame = JSON.parse(savedGame);
  player.xPos = savedGame.xPos;
  player.yPos = savedGame.yPos;
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
  player.xPos = playerX;
  player.yPos = playerY;
  console.log("Coordinates are reset!")
  startTime = millis();
}
