class Room {
  constructor() {
    this.savePoint = null;
    this.door = null;
    this.enemies = [];
    this.obstacles = [];
  }

  setup() {
    this.savePoint = new SavePoint(savePointParam.x, savePointParam.y);
    this.door = new Door();
    this.generateObstacles();
    this.generateEnemies();
    startTime = millis();
  }

  update() {
    image(officeRoomImg, 0, 0, widthInPixel, heightInPixel);
    this.savePoint.display();
    this.updateObstacles();
    this.updateEnemies();
    this.updateDoor();
    this.checkClearCondition();
  }
  
  generateObstacles() {
    this.obstacles = [];
    const maxEntitySize = heightInPixel / 8;
    for (let i = 0; i < obstacleCount; i++) {
      let x = random(leftBoundary, rightBoundary - maxEntitySize);
      let y = random(topBoundary, bottomBoundary - maxEntitySize);
      this.obstacles.push(new Obstacle(x, y));
    }
  }
  
  generateEnemies() {
    this.enemies = [];
    const maxEntitySize = heightInPixel / 8;
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
