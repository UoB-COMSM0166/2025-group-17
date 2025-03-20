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
    this.backgroundImg = roomData.backgroundImg;

    this.door = new Door();
    this.generateObstacles();
    if (roomData.id === 3){
      this.generateBoss();
    } else {
      this.generateEnemies();
    }
    // this.generateEnemies();

    this.currentRoomData = roomData; // Store room data
    this.savePoint = new SavePoint(roomData.savePoint.x, roomData.savePoint.y);

    if (roomData.id == 1) {
      startTime = millis();
    }
  }

  update(roomData) {
    // Use corresponding backgroundImg for current level
    image(this.backgroundImg, 0, 0, this.size.width, this.size.height);
    
    this.savePoint.display();    
    this.updateObstacles();
    if (roomData.id === 3){
      this.updateBoss();
    } else {
      this.updateEnemies();
    }
   // this.updateEnemies();
    this.updateDoor();
    this.checkClearCondition();
  }

  generateObstacles() {
    this.obstacles = [];
    const maxObstacleSize = heightInPixel / 12;

    // TODO: obstacleCount不同关卡设为不一样的数值。根据难度或者其他条件
    for (let i = 0; i < obstacleCount; i++) {
      let newObstacle;
      do {
        const x = random(savePointParam.x, widthInPixel - maxObstacleSize - savePointParam.x);
        const y = random(savePointParam.y, heightInPixel - maxObstacleSize - savePointParam.y);
        newObstacle = new Obstacle(x, y);
      } while (this.obstacles.some(obstacle => this.collisionDetector.detectCollision(newObstacle, obstacle)));
      this.obstacles.push(newObstacle);
    }
  }

  generateEnemies() {
    this.enemies = [];
    const maxEntitySize = heightInPixel / 8;
    // TODO: enemyCount不同关卡设为不一样的数值。根据难度或者其他条件
    for (let i = 0; i < enemyCount; i++) {
      let x = random(savePointParam.x, widthInPixel - maxEntitySize - savePointParam.x);
      let y = random(savePointParam.y, heightInPixel - maxEntitySize - savePointParam.y);
      let hp = random([smallEnemyHp, largeEnemyHp]);
      this.enemies.push(new Enemy(x, y, hp));
    }
  }

  generateBoss() {
    this.boss = [];
    const maxEntitySize = heightInPixel / 8;
    for (let i = 0; i < enemyCount; i++) {
      let x = random(savePointParam.x, widthInPixel - maxEntitySize - savePointParam.x);
      let y = random(savePointParam.y, heightInPixel - maxEntitySize - savePointParam.y);
      let hp = random([smallEnemyHp, largeEnemyHp]);
      this.boss.push(new Boss(x, y, hp));
    }
  }


  updateObstacles() {
    this.obstacles.forEach(o => o.display());
  }


  updateBoss() {
    this.boss.forEach(e => {
      e.update();
      e.display();
    });
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
