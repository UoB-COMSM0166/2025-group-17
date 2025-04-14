const rooms = [
  {
    id: 1,
    background: 'assets/background/L1_TutorialRoom.png',
    savePoint: { x: savePointParam.x, y: savePointParam.y, w: savePointParam.w, h: savePointParam.h }
    // Call generation functions to generate enemies and obstacles
    // enemies: [],
    // obstacles: []
  },
  {
    id: 2,
    background: 'assets/background/L1_room1.png',
    savePoint: { x: savePointParam.x, y: savePointParam.y, w: savePointParam.w, h: savePointParam.h }

  },
  {
    id: 3,
    background: 'assets/background/L1_room5.png',
    savePoint: { x: savePointParam.x, y: savePointParam.y, w: savePointParam.w, h: savePointParam.h }
  }
];
let currentRoomIndex = 0;

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

  localStorage.setItem('currentRoomIndex', currentRoomIndex);
  localStorage.setItem('lastSavePointX', JSON.stringify(room.savePoint.position.x));
  localStorage.setItem('lastSavePointY', JSON.stringify(room.savePoint.position.y));
  localStorage.setItem('playerHp', JSON.stringify(player.hp));
  localStorage.setItem('timeSpent', JSON.stringify(timeSpent));
  lastSavedPosition.xPos = room.savePoint.position.x;
  lastSavedPosition.yPos = room.savePoint.position.y;
  console.log("Game Saved!");
}

function loadGameData() {
  const savedRoomIndex = localStorage.getItem('currentRoomIndex');
  if (savedRoomIndex) currentRoomIndex = parseInt(savedRoomIndex);
  room.setup(rooms[currentRoomIndex]);

  const savedXData = localStorage.getItem('lastSavePointX');
  const savedYData = localStorage.getItem('lastSavePointY');
  const savedPlayerHp = localStorage.getItem('playerHp');
  const savedTimeSpent = localStorage.getItem('timeSpent');
  if (!savedXData || !savedYData || !savedPlayerHp || !savedTimeSpent) {
    console.log("Parts of save data missing; starting from scratch...");
    return startNewGame();
  }

  // 销毁旧角色
  if (player) player.destroy();

  const savedPositionX = JSON.parse(savedXData);
  const savedPositionY = JSON.parse(savedYData);
  const savedPosition = new SavePoint(savedPositionX, savedPositionY);
  player = new Player(savedPosition.position.x, savedPosition.position.y);
  player.hp = JSON.parse(savedPlayerHp);
  startTime = millis() - JSON.parse(savedTimeSpent);
  inputHandler.lastLoadTime = millis();
  player.resetInvincibleTimer();

  console.log("Game Loaded!");

  mainMenuDisplayed = false;
  menuDrawer.toggleStartButtons();
  menuDrawer.toggleGameOverButtons();
}

function startNewGame() {
  console.log("New Game Start!");
  resetGame();
  menuDrawer.toggleStartButtons();
  menuDrawer.toggleGameOverButtons();
}

function pauseGame() {
  pauseTime = millis();
  isGamePaused = true;
  console.log("Game pause!");

  if (pauseSound) {
    pauseSound.play();
  }

  // 可选：停止动画
  if (player) player.sprite.animation.stop();

  menuDrawer.showResumeButtons();
}

function resumeGame() {
  isGamePaused = false;
  console.log("Game resume!");

  // 可选：恢复动画
  if (player) player.sprite.animation.play();

  menuDrawer.toggleResumeButtons();
  startTime += millis() - pauseTime;
}

function exitToMenu() {
  console.log("Exit to the start menu!")
  isGamePaused = false;
  menuDrawer.drawMenu();
  menuDrawer.showStartButtons();
  menuDrawer.toggleGameOverButtons();
  mainMenuDisplayed = true;
}

function resetGame() {
  mainMenuDisplayed = false;
  isGamePaused = false;
  isGameCompleted = false;

  currentRoomIndex = 0;

  // ✅ 销毁旧角色
  if (player) player.destroy();

  player = new Player(playerX, playerY);
  room.setup(rooms[currentRoomIndex]); // reset to the initial room
  inputHandler = new InputHandler(room);
  console.log("Game is reset!");
}


function loadRoom() {
  currentRoomIndex++;

  if (currentRoomIndex >= rooms.length) {
    isGameCompleted = true;
    console.log("✅ Game Completed!");

    if (player) player.destroy();
    return;
  }

  console.log("🟦 Loading Room Index:", currentRoomIndex);
  console.log("🟦 Room Data:", rooms[currentRoomIndex]);

  const prevHp = player.hp;

  if (player) player.destroy();

  player = new Player(playerX, playerY);
  player.hp = prevHp;
  room.setup(rooms[currentRoomIndex]);
}

