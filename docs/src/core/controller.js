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
  },
  {
    id: 4,
    background: 'assets/background/L1_room1.png',
    savePoint: { x: savePointParam.x, y: savePointParam.y, w: savePointParam.w, h: savePointParam.h }
  },
  {
    id: 5,
    background: 'assets/background/L1_room1.png',
    savePoint: { x: savePointParam.x, y: savePointParam.y, w: savePointParam.w, h: savePointParam.h }
  },
  {
    id: 6,
    background: 'assets/background/L1_room1.png',
    savePoint: { x: savePointParam.x, y: savePointParam.y, w: savePointParam.w, h: savePointParam.h }
  }  
];

function checkSavePoint() {
  // Save when player crosses the target position
  const distanceX = abs(player.position.x - room.savePoint.position.x);
  const distanceY = abs(player.position.y - room.savePoint.position.y);
  if (!nearSavedPosition && distanceX < player.size.x && distanceY < player.size.y) {
    saveGameData();
    room.savePoint.checked();
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

function loadRoom() {
  currentRoomIndex++;

  if (currentRoomIndex >= rooms.length) {
    isGameCompleted = true;
    console.log("Game Completed!");
    return;
  }

  // Keep play hp (need or not)
  // TODO: 在player类中设置resetStatus函数，在除了宝箱房外的房间内调用
  // Reset status of player (keep HP)
  // player.resetStatus()
  const prevHp = player.hp;

  // // 如果 currentRoomIndex 是 1，不继承血量
  // if (currentRoomIndex === 1) {
  //   player = new Player(playerX, playerY);
  // } else {
  player = new Player(playerX, playerY);
  player.hp = prevHp; // 继承血量
  // }

  // Load room
  room.setup(rooms[currentRoomIndex]);
}

