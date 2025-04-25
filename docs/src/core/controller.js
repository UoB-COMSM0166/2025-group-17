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

  localStorage.setItem('currentRoomDataId', room.getRoomDataId());
  localStorage.setItem('lastSavePointX', JSON.stringify(room.savePoint.position.x));
  localStorage.setItem('lastSavePointY', JSON.stringify(room.savePoint.position.y));
  localStorage.setItem('playerHp', JSON.stringify(player.hp));
  localStorage.setItem('timeSpent', JSON.stringify(timeSpent));
  lastSavedPosition.xPos = room.savePoint.position.x;
  lastSavedPosition.yPos = room.savePoint.position.y;
  console.log("Game Saved!");
}

