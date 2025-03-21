class Room {
  constructor() {
    this.savePoint = null;
    this.door = null;
    this.enemies = [];
    this.obstacles = [];
    this.obsCount = obstacleCount;

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
    this.generateObstacles(this.obsCount);
    this.generateEnemies();
    this.backgroundImg = roomData.backgroundImg;
    this.door = new Door();
    this.door.close();

    this.currentRoomData = roomData; // Store room data
    this.savePoint = new SavePoint(roomData.savePoint.x, roomData.savePoint.y);

    if (roomData.id == 1) {
      startTime = millis();
    }
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

  generateObstacles(obsCount) {
    this.obstacles = [];

    // TODO: obstacleCount不同关卡设为不一样的数值。根据难度或者其他条件
    for (let i = 0; i < obsCount; i++) {
      let newObstacle;
      do {
        const x = random(savePointParam.x + player.size.x, rightBoundary - maxObstacleSize - player.size.x);
        const y = random(topBoundary + player.size.y, bottomBoundary - maxObstacleSize - player.size.y);
        newObstacle = new Obstacle(x, y);
      } while (this.obstacles.some(obstacle => this.collisionDetector.detectCollision(newObstacle, obstacle)));
      this.obstacles.push(newObstacle);
    }
  }

  generateEnemies() {
    this.enemies = [];
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
}
