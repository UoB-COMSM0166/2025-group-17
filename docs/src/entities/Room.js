class Room {
  constructor() {
    this.savePoint = null;
    this.door = null;
    this.enemies = [];
    this.chaser = [];
    this.shooter = [];
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
    this.enemies = [];
    this.chaser = [];
    this.shooter = [];
    this.obstacles = [];
    this.currentRoomData = roomData; // Store room data
    this.generateObstacles(this.currentRoomData);
    this.generateEnemies(this.currentRoomData);
    this.backgroundImg = roomData.backgroundImg;
    this.door = new Door();
    this.door.close();
    this.savePoint = new SavePoint(roomData.savePoint.x, roomData.savePoint.y);
    this.setGameTime(currentRoomIndex);

  }

  update() {
    // Use corresponding backgroundImg for current level
    image(this.backgroundImg, 0, 0, this.size.width, this.size.height);
    this.savePoint.display();    
    this.updateObstacles();

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

    this.updateDoor();
    this.checkClearCondition();
  }

  generateObstacles(currentRoomData) {
    this.obstacles = [];
    this.setObstacleCount(currentRoomData);
    if (obstacleCount === 1) {
      const obsData = currentRoomData.obstacles[0];
      this.generateTutorialObs(obsData);
      return;
    }
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
      this.setEnemyCount(currentRoomData.id);
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

    // for (let i = 0; i < enemyCount; i++) {
    //   let newEnemy;
    //   do {
    //     let x = random(savePointParam.x, widthInPixel - maxEntitySize - savePointParam.x);
    //     let y = random(player.size.y, heightInPixel - maxEntitySize - player.size.y);
    //     let hp = random([smallEnemyHp, largeEnemyHp]);
    //     newEnemy = new Enemy(x, y, hp);
    //   } while (this.collisionDetector.detectCollision(player, newEnemy));
    //   this.enemies.push(newEnemy);
    // }
  }

  generateChaser() {
    this.chaser = [];
    this.chaser.push(new Chaser(400, 300));
  }

  generateShooter() {
    this.shooter = [];
    this.shooter.push(new Shooter(400, 300));
  }

  generateFinalBossRoom() {
    this.chaser = [];
    this.shooter = [];
  
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
  
    this.chaser.push(new Chaser(pos1.x, pos1.y));
    this.chaser.push(new Chaser(pos2.x, pos2.y));
    this.shooter.push(new Shooter(shooterPos.x, shooterPos.y));
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

  updateChaser() {
    this.chaser = this.chaser.filter(c => c.hp > 0);
    this.chaser.forEach(c => {
      c.update();
      c.display();
      c.detectBulletCollision(player.bullets);
      //if (this.collisionDetector.detectCollision(player, c)) {
       // inputHandler.decreasePlayerHp();
      //}
    });
  }

  updateShooter() {
    this.shooter = this.shooter.filter(s => s.hp > 0);
    this.shooter.forEach(s => {
      s.update();
      s.display();
      s.detectBulletCollision(player.bullets);
      s.detectPlayerCollision();
    });
  }
  
  updateDoor() {
    if (this.checkClearCondition()) this.door.open();
    else this.door.close();
    this.door.display();
  }

  checkClearCondition() {
    const noEnemies = this.enemies.length === 0;
    const noChaser = this.chaser.length === 0;
    const noShooter = this.shooter.length === 0;
  
    return noEnemies && noChaser && noShooter && player.hp > 0;
  }
  
  resolveBossCollision() {
    const bosses = [...this.chaser, ...this.shooter];
  
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

  setEnemyCount(currentRoomId) {
    if (currentRoomId === 0) {
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
    const x = savePointParam.x + player.size.x + widthInPixel / 4;
    const y = topBoundary + player.size.y + heightInPixel / 4;
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
