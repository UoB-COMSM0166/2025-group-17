class Room {
  constructor() {
    this.savePoint = null;
    this.door = null;
    this.enemies = [];
    this.obstacles = [];
    
    this.currentRoomData = null;
    this.backgroundImg = null;
    this.size = null;
  }

  setup(roomData) {
    // // Clear old objects, (need or not)
    // this.enemies = [];
    // this.obstacles = [];
    
    // Load room configuration
    this.backgroundImg = roomData.backgroundImg;
    this.size = {
      width: widthInPixel,
      height: heightInPixel
    };
    
    this.door = new Door();
    this.generateObstacles();
    this.generateEnemies();
    
    this.currentRoomData = roomData; // Store room data
    this.savePoint = new SavePoint(roomData.savePoint.x, roomData.savePoint.y);
    
    if(roomData.id == 1) {
      startTime = millis();
    }
    

  }

  update() {
    // Use corresponding backgroundImg for current level
    image(this.backgroundImg, 0, 0, this.size.width, this.size.height);
    //image(officeRoomImg, 0, 0, widthInPixel, heightInPixel);
    
    this.savePoint.display();
    this.updateObstacles();
    this.updateEnemies();
    this.updateDoor();
    this.checkClearCondition();

    
  }
  
  generateObstacles() {
    this.obstacles = [];
    const maxEntitySize = heightInPixel / 8;
    // TODO: obstacleCount不同关卡设为不一样的数值。根据难度或者其他条件
    for (let i = 0; i < obstacleCount; i++) {
      let x = random(leftBoundary, rightBoundary - maxEntitySize);
      let y = random(topBoundary, bottomBoundary - maxEntitySize);
      this.obstacles.push(new Obstacle(x, y));
    }
  }
  
  generateEnemies() {
    this.enemies = [];
    const maxEntitySize = heightInPixel / 8;
    // TODO: enemyCount不同关卡设为不一样的数值。根据难度或者其他条件
    for (let i = 0; i < enemyCount; i++) {
      let x = random(leftBoundary, rightBoundary - maxEntitySize);
      let y = random(topBoundary, bottomBoundary - maxEntitySize);
      let hp = random([smallEnemyHp, largeEnemyHp]);
      this.enemies.push(new Enemy(x, y, hp));
    }
  }

  updateObstacles() {
    this.obstacles.forEach(o => o.display());
  }
  
  updateEnemies() {
    this.enemies.forEach(e => {
      e.update();
      e.display();
    });
  }

  updateDoor() {
    if (this.checkClearCondition()) this.door.open();
    this.door.display();
  }

  checkClearCondition() {
    return (this.enemies.length === 0 && player.hp > 0);
  }
}
