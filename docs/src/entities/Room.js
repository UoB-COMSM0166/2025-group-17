class Room {
  constructor() {
    this.savePoint = null;
    this.door = null;
    this.enemies = [];
    this.chasers = [];
    this.shooters = [];
    this.obstacles = [];

    this.currentRoomData = null;
    this.backgroundImg = null;
    this.clearTime = null;
    this.size = {
      width: widthInPixel,
      height: heightInPixel
    };
    this.collisionDetector = new CollisionDetector();
  }

  setup(roomData) {
    this.enemies = [];
    this.chasers = [];
    this.shooters = [];
    this.obstacles = [];
    this.clearTime = null;
    this.currentRoomData = roomData; // Store room data
    this.generateObstacles(this.currentRoomData);
    this.generateEnemies(this.currentRoomData);
    this.backgroundImg = roomData.backgroundImg;
    this.door = new Door();
    this.door.close();
    this.savePoint = new SavePoint(roomData.savePoint.x, roomData.savePoint.y);
    this.setGameTime(currentRoomIndex);
    gameStateManager?.playBGMForRoom?.(currentRoomIndex); // 进入房间后自动播放对应 BGM
  }

  update() {
    // Treat three types of rooms separately
    if (this.currentRoomData.type === 1) {
      this.updateChaser();
    } else if (this.currentRoomData.type === 2) {
      this.updateShooter();
    } else if (this.currentRoomData.type === 3) {
      this.updateChaser();
      this.updateShooter();
      this.resolveBossCollision(); // Add physical barriers between monsters
    } else {
      this.updateEnemies();
    }
    this.updateAfterClear();
  }

  display(playerObj) {
    // Use corresponding backgroundImg for current level
    image(this.backgroundImg, 0, 0, this.size.width, this.size.height);
    this.savePoint.display();
    this.door.display();
    const allEntities = [...this.obstacles, ...this.enemies, ...this.chasers, ...this.shooters, playerObj];
    allEntities.sort((a, b) => a.position.y - b.position.y);
    allEntities.forEach(entity => { entity.display(); });
    if (this.currentRoomData.id === 0 && this.enemies.length === 0) {
      const clearText = "Tutorial complete! Your HP and runtime will reset in the next room.";
      displayInstruction(clearText, this.clearTime);
    }
    if (this.chasers.length === 1) drawBossStatus(this.chasers[0]);
    if (this.shooters.length === 1) drawBossStatus(this.shooters[0]);
  }

  generateObstacles(currentRoomData) {
    this.obstacles = [];
    this.setObstacleCount(currentRoomData);
    if (obstacleCount === 1) {
      const obsData = currentRoomData.obstacles[0];
      this.generateTutorialObs(obsData);
      return;
    }
    console.log(currentRoomData.id);
    if (obstacleCount === 0) { // No obstacles in Boss level
      return;
    }

    for(let i = 0; i < currentRoomData.obstacles.length; i++) {
      let newObstacle;
      do {
        const obsData = currentRoomData.obstacles[i];
      newObstacle = new Obstacle(obsData.x, obsData.y, obsData.img);
      } while (this.obstacles.some(obstacle => this.collisionDetector.detectCollision(newObstacle, obstacle)));
      this.obstacles.push(newObstacle);
      
    }

    // for (let i = 0; i < obstacleCount; i++) {
    //   let newObstacle;
    //   do {
    //     const x = random(savePointParam.x + player.size.x, rightBoundary - maxObstacleSize - player.size.x);
    //     const y = random(topBoundary + player.size.y, bottomBoundary - maxObstacleSize - player.size.y);
    //     newObstacle = new Obstacle(x, y);
    //   } while (this.obstacles.some(obstacle => this.collisionDetector.detectCollision(newObstacle, obstacle)));
    //   this.obstacles.push(newObstacle);
    // }
  }

  generateEnemies(currentRoomData) {
    this.enemies = [];
    if (currentRoomData.type === 0) {
      this.setEnemyCount(currentRoomData);
    }
    
    // Specify different enemy generation logic by room ID
    if (currentRoomData.type === 1) {
      this.generateChaser();
      return;
    } else if (currentRoomData.type === 2) {
      this.generateShooter();
      return;
    } else if (currentRoomData.type === 3) {
      this.generateFinalBossRoom(); // 2 chasers + 1 shooter
      return;
    }
    
    for(let i = 0; i < currentRoomData.enemies.length; i++) {
      let newEnemy;
      do {
        const enemiesData = currentRoomData.enemies[i];
      let hp = random([smallEnemyHp, largeEnemyHp]);
      newEnemy = new Enemy(enemiesData.x, enemiesData.y, hp, enemiesData.img);
      } while (this.collisionDetector.detectCollision(player, newEnemy));
      
      this.enemies.push(newEnemy);
    }
  }

  generateChaser() {
    this.chasers = [];
    this.chasers.push(new Chaser(400, 300));
  }

  generateShooter() {
    this.shooters = [];
    this.shooters.push(new Shooter(400, 300));
  }

  generateFinalBossRoom() {
    this.chasers = [];
    this.shooters = [];
  
    const minX = widthInPixel / 2 + 50; // 右半边稍微往内
    const maxX = widthInPixel - 100;    // 留点边距
    const minY = 150;
    const maxY = heightInPixel - 150;
  
    const randomPos = () => {
      const x = random(minX, maxX);
      const y = random(minY, maxY);
      return { x, y };
    };
  
    let pos1 = randomPos();
    let pos2 = randomPos();
    let shooterPos = randomPos();
  
    this.chasers.push(new Chaser(pos1.x, pos1.y));
    this.chasers.push(new Chaser(pos2.x, pos2.y));
    this.shooters.push(new Shooter(shooterPos.x, shooterPos.y));
  }

  updateEnemies() {
    this.enemies.forEach(e => {
      if (!this.collisionDetector.isHitBoundary(e)) e.update();
      else {
        // Add some randomness to prevent perfect oscillation
        const direction = p5.Vector.mult(e.velocity.copy(), -1);
        const randomness = p5.Vector.random2D().mult(0.2);
        direction.add(randomness).normalize();
        e.velocity = direction.mult(e.velocity.mag());
        e.position.add(direction);
      }
    });
  }

  updateChaser() {
    this.chasers = this.chasers.filter(c => c.hp > 0);
    this.chasers.forEach(c => {
      c.update();
      c.detectBulletCollision(player.bullets);
      //if (this.collisionDetector.detectCollision(player, c)) {
       // inputHandler.decreasePlayerHp();
      //}
    });
  }

  updateShooter() {
    this.shooters = this.shooters.filter(s => s.hp > 0);
    this.shooters.forEach(s => {
      s.update();
      s.detectBulletCollision(player.bullets);
      s.detectPlayerCollision();
    });
  }
  
  updateAfterClear() {
    if (this.checkClearCondition()) {
      this.door.open();
      if (this.clearTime === null) this.clearTime = millis();
    }
    else this.door.close();
    this.door.display();
  }

  checkClearCondition() {
    const noEnemies = this.enemies.length === 0;
    const noChaser = this.chasers.length === 0;
    const noShooter = this.shooters.length === 0;
  
    return noEnemies && noChaser && noShooter && player.hp > 0;
  }
  
  resolveBossCollision() {
    const bosses = [...this.chasers, ...this.shooters];
  
    for (let i = 0; i < bosses.length; i++) {
      for (let j = i + 1; j < bosses.length; j++) {
        const b1 = bosses[i];
        const b2 = bosses[j];
  
        if (this.collisionDetector.detectCollision(b1, b2)) {
          const push = p5.Vector.sub(b1.position, b2.position).normalize().mult(2);
          b1.position.add(push);
          b2.position.sub(push);
        }
      }
    }
  }

  setEnemyCount(currentRoomData) {
    if (currentRoomData.id === 0) {
      enemyCount = 1;
    } else {
      enemyCount = 4;
    }
  }

  setObstacleCount(currentRoomData) {
    if (currentRoomData.id === 0) {
      obstacleCount = 1;
      return;
    } 
    if (currentRoomData.type === 0) {
      obstacleCount = 5;
    } else {
      obstacleCount = 0;
    }
  }

  generateTutorialObs(obsData) {
    let newObstacle;
    const x = savePointParam.x + player.size.x + widthInPixel / 3 - 40;
    const y = topBoundary + player.size.y + heightInPixel / 3 + 100;
    newObstacle = new Obstacle(x, y, obsData.img);
    this.obstacles.push(newObstacle);
  }

  setGameTime(currentRoomIndex) {
    if (currentRoomIndex === 0) {
      startTime = millis();
    }
    if (currentRoomIndex === 1) {
      startTime = millis();
    }
  }

}
