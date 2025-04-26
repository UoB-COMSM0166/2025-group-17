class Room {
  #currentRoomData;
  #obstacleCount;
  // #enemyCount;
  
  constructor() {
    this.savePoint = null;
    this.door = null;
    this.enemies = [];
    this.chasers = [];
    this.shooters = [];
    this.obstacles = [];
    this.#obstacleCount = 0;
    // this.#enemyCount = 0;

    this.#currentRoomData = null;
    this.backgroundImg = null;
    this.clearTime = null;
    this.size = {
      width: widthInPixel,
      height: heightInPixel
    };
    this.collisionDetector = new CollisionDetector();
  }

  setup(data) {
    this.enemies = [];
    this.chasers = [];
    this.shooters = [];
    this.obstacles = [];
    this.clearTime = null;
    this.#currentRoomData = data; // Store room data
    this.backgroundImg = data.backgroundImg;
    this.door = new Door();
    this.door.close();
    this.savePoint = new SavePoint(data.savePoint.x, data.savePoint.y);
    this.generateObstacles(this.#currentRoomData);
    this.generateEnemies(this.#currentRoomData);
    this.#setGameTime(this.#currentRoomData.currentRoomId);
  }

  getRoomDataId() { return this.#currentRoomData.dataId; }
  getCurrentRoomId() { return this.#currentRoomData.currentRoomId; }

  update() {
    // Treat three types of rooms separately
    if (this.#currentRoomData.type === 1) {
      this.updateChaser();
    } else if (this.#currentRoomData.type === 2) {
      this.updateShooter();
    } else if (this.#currentRoomData.type === 3) {
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
    if (this.#currentRoomData.currentRoomId === 0 && this.enemies.length === 0) {
      const clearText = "Tutorial complete! Your HP and runtime will reset in the next room.";
      InstructionDisplayer.display(clearText, this.clearTime);
    }
    if (this.chasers.length === 1) BossStatusDisplayer.display(this.chasers[0], bossHpBarImg, bossHpImg);
    if (this.shooters.length === 1) BossStatusDisplayer.display(this.shooters[0], bossHpBarImg, bossHpImg);
  }

  generateObstacles(currentRoomData) {
    this.obstacles = [];
    this.setObstacleCount(currentRoomData);
    if (this.#obstacleCount === 1) {
      const obsData = currentRoomData.obstacles[0];
      this.generateTutorialObs(obsData);
      return;
    }
    if (this.#obstacleCount === 0) { // No obstacles in Boss level
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

    // for (let i = 0; i < this.#obstacleCount; i++) {
    //   let newObstacle;
    //   const maxObstacleSize = heightInPixel / 12;
    //   do {
    //     const x = random(this.savePoint.position.x + player.size.x, rightBoundary - maxObstacleSize - player.size.x);
    //     const y = random(topBoundary + player.size.y, bottomBoundary - maxObstacleSize - player.size.y);
    //     newObstacle = new Obstacle(x, y);
    //   } while (this.obstacles.some(obstacle => this.collisionDetector.detectCollision(newObstacle, obstacle)));
    //   this.obstacles.push(newObstacle);
    // }
  }

  generateEnemies(currentRoomData) {
    this.enemies = [];
    // if (currentRoomData.type === 0) {
    //   this.setEnemyCount(currentRoomData);
    // }
    
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
      const smallEnemyHp = 50;
      const largeEnemyHp = 100;
      let hp = random([smallEnemyHp, largeEnemyHp]);
      do {
        const enemiesData = currentRoomData.enemies[i];
      console.log(`Generating an enemy with HP: ${hp}`);
      console.log(`Generating an enemy with img: ${enemiesData.img.width},  ${enemiesData.img.height}`);
      newEnemy = new Enemy(enemiesData.x, enemiesData.y, hp, enemiesData.img);
      } while (this.collisionDetector.detectCollision(player, newEnemy));
      
      this.enemies.push(newEnemy);
    }
  }

  generateChaser() {
    this.chasers = [];
    this.chasers.push(new Chaser(600, 300));
  }

  generateShooter() {
    this.shooters = [];
    this.shooters.push(new Shooter(400, 300));
  }

  generateFinalBossRoom() {
    this.chasers = [];
    this.shooters = [];
  
    // Shooter 和 Chaser 的 sprite 高度是 heightInPixel / 4
    const entitySize = heightInPixel / 4;
  
    // ✅ 固定 shooter 位置（画布中央偏右）
    const shooterX = widthInPixel * 0.6;
    const shooterY = heightInPixel * 0.5;
    this.shooters.push(new Shooter(shooterX, shooterY));
  
    // ✅ 固定 chaser 位置（右上和右下）
    this.chasers.push(new Chaser(widthInPixel * 0.75, heightInPixel * 0.3));
    this.chasers.push(new Chaser(widthInPixel * 0.75, heightInPixel * 0.7));
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
  
    // 添加互相推开逻辑
    for (let i = 0; i < this.chasers.length; i++) {
      for (let j = i + 1; j < this.chasers.length; j++) {
        const c1 = this.chasers[i];
        const c2 = this.chasers[j];
        const dist = p5.Vector.dist(c1.position, c2.position);
  
        if (dist < 60) { // 设置最小间距
          const repel = p5.Vector.sub(c1.position, c2.position).normalize().mult(1.5);
          c1.position.add(repel);
          c2.position.sub(repel);
        }
      }
    }
  
    // 更新 + 子弹检测
    this.chasers.forEach(c => {
      c.update();
      c.detectBulletCollision(player.bullets);
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

  // setEnemyCount(currentRoomData) {
  //   if (currentRoomData.currentRoomId === 0) {
  //     this.#enemyCount = 1;
  //   } else {
  //     this.#enemyCount = 4;
  //   }
  // }

  setObstacleCount(currentRoomData) {
    if (currentRoomData.currentRoomId === 0) {
      this.#obstacleCount = 1;
      return;
    } 
    if (currentRoomData.type === 0) {
      this.#obstacleCount = 5;
    } else {
      this.#obstacleCount = 0;
    }
  }

  generateTutorialObs(obsData) {
    let newObstacle;
    const x = this.savePoint.position.x + player.size.x + widthInPixel / 3 - 40;
    const y = topBoundary + player.size.y + heightInPixel / 3 + 100;
    newObstacle = new Obstacle(x, y, obsData.img);
    this.obstacles.push(newObstacle);
  }

  #setGameTime(currentRoomId) {
    if (currentRoomId === 0) startTime = millis();
    if (currentRoomId === 1) startTime = millis();
  }

}
