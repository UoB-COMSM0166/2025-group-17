function checkSavePoint() {
  // Save when player crosses the target position
  const nearSavePoint = player.position.x < room.savePoint.position.x + room.savePoint.size.x &&
  player.position.x + player.size.x > room.savePoint.position.x &&
  player.position.y < room.savePoint.position.y + room.savePoint.size.y &&
  player.position.y + player.size.y > room.savePoint.position.y;
  if (!room.savePoint.isChecked && nearSavePoint) {
    saveGameData();
    room.savePoint.checked();
  }
}

function saveGameData() {
  if (room.savePoint.isChecked) return;
  console.log("Can be saved again!");

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

  if (currentRoomIndex === 6) {
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
  if (currentRoomIndex === 1) {
    const randomRoomId = random([1, 2, 3, 4, 5, 6]);
    room.setup(rooms[randomRoomId]);
    currentRoomIndex = 1;
  } else if (currentRoomIndex === 2) {
    room.setup(rooms[8]);
    currentRoomIndex = 2;
  }
  else if (currentRoomIndex === 3) {
    room.setup(rooms[7]);
    currentRoomIndex = 3;
  } else if (currentRoomIndex === 4) {
    room.setup(rooms[9]);
    currentRoomIndex = 4;
  } else if (currentRoomIndex === 5) {
    room.setup(rooms[10]);
    currentRoomIndex = 5;
  }
  
}

