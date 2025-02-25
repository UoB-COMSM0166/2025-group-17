let tempPlayerHp;
let lastCollisionTime = 0; 
let collisionOccurred = false;


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

// Add from feature_enemies_lyz_before0225
function checkWinCondition() {
  // 当所有敌人被消灭，且玩家位于画布上方（yPos < 10）且血量大于 0 时，认为达成胜利条件
  if (enemies.length === 0 && player.yPos < 10 && player.hp > 0) {
    tutorialStep = 3;
  }
}

function checkPlayerEnemyCollision() {
  // // 遍历所有敌人，检测玩家与敌人之间的距离是否小于双方半径之和（假设 enemy 对象中存在 size 属性）
  // enemies.forEach(enemy => {
  //   let d = dist(player.xPos, player.yPos, enemy.xPos, enemy.yPos);
  //   if (d < enemy.size / 2 + playerSize / 2) {
  //     tempPlayerHp = player.hp - 1;
  //     player.hp = max(0, tempPlayerHp); // 防止血量低于 0
  //   }
  // });
  if (millis() - lastCollisionTime < 3000) {
    return;
  }
  collisionOccurred = false;
  enemies.forEach(enemy => {
    let d = dist(player.xPos, player.yPos, enemy.xPos, enemy.yPos);
    if (d < enemy.size / 2 + playerSize / 2) {
      player.hp = max(0, player.hp - 1);
      collisionOccurred = true;
    }
  });
  
  if (collisionOccurred) {
    lastCollisionTime = millis();
  }
}

function checkGameOver() {
  // 当玩家血量耗尽时，在画布正中央显示 Game Over，并停止 draw 循环
  if (player.hp <= 0) {
    fill(255, 0, 0);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("Game Over", width / 2, height / 2);
    noLoop();
  }
}

