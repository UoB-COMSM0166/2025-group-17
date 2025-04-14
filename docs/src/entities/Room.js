class Room {
  constructor() {
    this.savePoint = null;
    this.door = null;
    this.enemies = [];
    this.obstacles = [];

    this.currentRoomData = null;
    this.backgroundImg = null;
    this.size = {
      width: widthInPixel,
      height: heightInPixel
    };
    this.collisionDetector = new CollisionDetector();
  }

  setup(roomData) {
    // Load room configuration
    this.currentRoomData = roomData; // Store room data
    this.generateObstacles(this.currentRoomData.id);
    this.generateEnemies(this.currentRoomData.id);
    this.backgroundImg = roomData.backgroundImg;
    this.door = new Door();
    this.door.close();
    this.savePoint = new SavePoint(roomData.savePoint.x, roomData.savePoint.y);
    this.setGameTime(this.currentRoomData.id);
  }

  update() {
    // Use corresponding backgroundImg for current level
    image(this.backgroundImg, 0, 0, this.size.width, this.size.height);
    this.savePoint.display();    
    this.updateObstacles();
    this.updateEnemies();
    this.updateDoor();
    this.checkClearCondition();
  }

  generateObstacles(currentRoomId) {
    this.setObstacleCount(currentRoomId);
    this.obstacles = [];
    // TODO: obstacleCount不同关卡设为不一样的数值。根据难度或者其他条件
    if (obstacleCount === 1) {
      this.generateTutorialObs();
      return;
    }
    for (let i = 0; i < obstacleCount; i++) {
      let newObstacle;
      do {
        const x = random(savePointParam.x + player.size.x, rightBoundary - maxObstacleSize - player.size.x);
        const y = random(topBoundary + player.size.y, bottomBoundary - maxObstacleSize - player.size.y);
        newObstacle = new Obstacle(x, y);
      } while (this.obstacles.some(obstacle => this.collisionDetector.detectCollision(newObstacle, obstacle)));
      this.obstacles.push(newObstacle);
    }
  }

  generateEnemies(currentRoomId) {
    this.enemies = [];
    this.setEnemyCount(currentRoomId);
    // TODO: enemyCount不同关卡设为不一样的数值。根据难度或者其他条件
    for (let i = 0; i < enemyCount; i++) {
      let newEnemy;
      do {
        let x = random(savePointParam.x, widthInPixel - maxEntitySize - savePointParam.x);
        let y = random(player.size.y, heightInPixel - maxEntitySize - player.size.y);
        let hp = random([smallEnemyHp, largeEnemyHp]);
        newEnemy = new Enemy(x, y, hp);
      } while (this.collisionDetector.detectCollision(player, newEnemy));
      this.enemies.push(newEnemy);
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
    else this.door.close();
    this.door.display();
  }

  checkClearCondition() {
    return (this.enemies.length === 0 && player.hp > 0);
  }

  setEnemyCount(currentRoomId) {
    if (currentRoomId === 1) {
      enemyCount = 1;
    } else if (currentRoomId === 2) {
      enemyCount = 4;
    }
  }

  setObstacleCount(currentRoomId) {
    if (currentRoomId === 1) {
      obstacleCount = 1;

    } else if (currentRoomId === 2) {
      obstacleCount = 5;
    }
  }

  generateTutorialObs() {
    let newObstacle;
    const x = savePointParam.x + player.size.x + widthInPixel / 4;
    const y = topBoundary + player.size.y + heightInPixel / 4;
    newObstacle = new Obstacle(x, y);
    this.obstacles.push(newObstacle);
  }

  setGameTime(currentRoomId) {
    if (currentRoomId === 1) {
      startTime = millis();
    }
    if (currentRoomId === 2) {
      startTime = millis();
    }
  }

}
