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
    // Load room configuration
    this.currentRoomData = roomData;
    // Load room configuration

    this.currentRoomData = roomData; // Store room data
    this.generateObstacles(this.currentRoomData.id);
    this.generateEnemies(this.currentRoomData.id);
    this.backgroundImg = roomData.backgroundImg;
    this.door = new Door();
    this.door.close();
    this.savePoint = new SavePoint(roomData.savePoint.x, roomData.savePoint.y);
    this.setGameTime(this.currentRoomData.id);

    // 只有普通关卡生成障碍物（排除 id 4、5、6）
  if (![4, 5, 6].includes(roomData.id)) {
    this.generateObstacles(this.obsCount);
  } else {
    this.obstacles = [];
  }
    
    // 按房间 ID 指定不同的生成逻辑
  if (roomData.id === 4) {
    this.generateChaser();
  } else if (roomData.id === 5) {
    this.generateShooter();
  } else if (roomData.id === 6) {
    this.generateFinalBossRoom(); // 2 chasers + 1 shooter
  } else {
    this.generateEnemies();
  }

  }

  update() {
    // Use corresponding backgroundImg for current level
    image(this.backgroundImg, 0, 0, this.size.width, this.size.height);
    this.savePoint.display();    
    this.updateObstacles();

   // 分别处理三种房间
  if (this.currentRoomData.id === 4) {
    this.updateChaser();
  } else if (this.currentRoomData.id === 5) {
    this.updateShooter();
  } else if (this.currentRoomData.id === 6) {
    this.updateChaser();
    this.updateShooter();
    this.resolveBossCollision(); // ✅ 加上怪物间物理阻挡
  } else {
    this.updateEnemies();
  }

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
    this.chaser.push(new Chaser(300, 250));
    this.chaser.push(new Chaser(500, 350));
    this.shooter.push(new Shooter(400, 400));
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
