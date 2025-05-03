class Room {
  #currentRoomData;
  #obstacleCount;
  #startTime;
  #clearTime;
  #items;

  constructor() {
    this.savePoint = null;
    this.door = null;
    this.enemies = [];
    this.chaser = [];
    this.shooter = [];
    this.pigEnemies = []; // TODO: Add pig enemy
    this.obstacles = [];
    this.#items = [];
    this.#obstacleCount = 0;

    this.#currentRoomData = null;
    this.backgroundImg = null;
    this.#startTime = millis();
    this.#clearTime = null;
    this.size = {
      width: widthInPixel,
      height: heightInPixel
    };
    this.collisionDetector = new CollisionDetector();
  }

  setup(data) {
    this.enemies = [];
    this.chaser = [];
    this.shooter = [];
    //TODO：建立猪猪敌人
    this.pigEnemies = [];
    this.obstacles = [];
    this.#items = [];
    this.#startTime = millis();
    this.#clearTime = null;
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
  getCurrentLevelId() { return this.#currentRoomData.levelId; }
  getCurrentRoomNo() { return this.#currentRoomData.roomNo; }
  // getCurrentRoomData() { return this.#currentRoomData; }

  update(playerObj) {
    // Treat three types of rooms separately
    if (this.#currentRoomData.type === 1) { // Chaser房(第一关Boss房)类型 === 1
      this.updateChaser();
    } else if (this.#currentRoomData.type === 2) { // Shooter房(第二关Boss房)类型 === 2
      this.updateShooter();
    } else if (this.#currentRoomData.type === 3) { // 第三关Boss房类型 === 3
      this.updateChaser();
      this.updateShooter();
      this.resolveBossCollision(); // Add physical barriers between monsters
    } else if(this.#currentRoomData.type === 0){ // 所有小怪房类型 === 0
      this.updateEnemies();
      this.updatePigEnemies(); // TODO: 加上pig的update方法
    }
    this.updateAfterClear();
    this.#handleItemBulletsCollision(playerObj.bullets, this.#items);
    this.#handleItemPicking(playerObj);
    if (this.#items.length !== 0) this.#items.forEach(i => i.update());
  }

  #handleItemPicking(playerObj) {
    const collidedItems = this.#items.filter(item =>
      this.collisionDetector.detectCollision(playerObj, item)
    );
    if (collidedItems.length > 0) {
      collidedItems.forEach(item => {
        item.applyEffect(playerObj);
        itemPickSound.play();
      });

      // Remove collided item
      this.#items = this.#items.filter(
        roomItem => !collidedItems.includes(roomItem)
      );
    }
  }

  #handleItemBulletsCollision(bulletArr, itemArr) {
    bulletArr.forEach((bulletObj, bulletIndex) => {
      if (itemArr.some(itemObj => this.collisionDetector.detectCollisionWithBullet(bulletObj, itemObj))) {
        bulletArr[bulletIndex].markAsHit();
      }
    });
  }

  display(playerObj) {
    // Use corresponding backgroundImg for current level
    image(this.backgroundImg, 0, 0, this.size.width, this.size.height);
    this.savePoint.display();
    this.door.display();
    // 加上PigEnemies
    const allEntities = [...this.obstacles, ...this.pigEnemies, ...this.enemies, ...this.chaser, ...this.shooter, playerObj];
    allEntities.sort((a, b) => a.position.y - b.position.y);
    allEntities.forEach(entity => { entity.display(); });
    this.#displayInstructions();
    this.#displayBossStatus();
    if (this.#items.length !== 0) this.#items.forEach(i => i.display());
  }

  #displayInstructions() {
    if (this.getCurrentRoomId() === 0 && this.enemies.length === 0) {
      const clearText = "Tutorial complete! Your HP and runtime will reset in the next room.";
      InstructionDisplayer.display(clearText, this.#clearTime);
    }
    if (this.getCurrentLevelId() === 1 && this.getCurrentRoomNo() === 1) {
      const randomText = `Dice rolled...Room #${this.getRoomDataId()} reveals itself.`;
      InstructionDisplayer.display(randomText, this.#startTime);
    }
    if (this.getCurrentLevelId() === 2 && this.getCurrentRoomNo() === 1) {
      const suitMap = { 1: '♠', 2: '♣', 3: '♥', 4: '♦' };
      const suitSymbol = suitMap[this.getRoomDataId() - 8] || '?';
      const randomText = `Card dealt...Suit ${suitSymbol} guides your way.`;
      InstructionDisplayer.display(randomText, this.#startTime);
    }
  }

  #displayBossStatus() {
    if (this.getCurrentLevelId() === 1 && this.getCurrentRoomNo() === 3) {
      if (this.chaser.length === 1) BossStatusDisplayer.display(this.chaser[0], bossHpBarImg, bossHpImg);
    }
    if (this.shooter.length === 1) BossStatusDisplayer.display(this.shooter[0], bossHpBarImg, bossHpImg);
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

    for (let i = 0; i < currentRoomData.obstacles.length; i++) {
      let newObstacle;
      do {
        const obsData = currentRoomData.obstacles[i];
        newObstacle = new Obstacle(obsData.x, obsData.y, obsData.img);
      } while (this.obstacles.some(obstacle => this.collisionDetector.detectCollision(newObstacle, obstacle)));
      this.obstacles.push(newObstacle);

    }
  }

  generateEnemies(currentRoomData) {
    this.enemies = [];

    // 类型为 1、2、3 的特殊房间走专用生成逻辑
    if (currentRoomData.type === 1) {
      this.generateChaser();
      return;
    } else if (currentRoomData.type === 2) {
      this.generateShooter();
      return;
    } else if (currentRoomData.type === 3) {
      this.generateFinalBossRoom();
      return;
    }

    // 普通敌人房间
    const levelId = this.getCurrentLevelId(); // 0, 1, 2...
    const levelKey = `level${levelId}`;

    for (let i = 0; i < currentRoomData.enemies.length; i++) {
      let newEnemy;
      const smallEnemyHp = 50;
      const largeEnemyHp = 150;
      const hp = random([smallEnemyHp, largeEnemyHp]);
      const enemiesData = currentRoomData.enemies[i];

      const sizeKey = (hp === smallEnemyHp) ? 'small' : 'large';
      const frames = window.enemyAnimations?.[levelKey]?.[sizeKey] || [];

      do {
        newEnemy = new Enemy(enemiesData.x, enemiesData.y, hp, enemiesData.img, levelId);
      } while (this.collisionDetector.detectCollision(player, newEnemy));

      this.enemies.push(newEnemy);
    }

    if(currentRoomData.pigEnemies.length === 0) return;
    // 生成两个PigEnemies
    for (let i = 0; i < currentRoomData.pigEnemies.length; i++) {
      let newEnemy;
      const smallEnemyHp = 50;
      const largeEnemyHp = 150;
      const hp = random([smallEnemyHp, largeEnemyHp]);
      const pigEnemiesData = currentRoomData.pigEnemies[i];

      const sizeKey = (hp === smallEnemyHp) ? 'small' : 'large';
      const frames = window.enemyAnimations?.[levelKey]?.[sizeKey] || [];

      do {
        newEnemy = new Pig(pigEnemiesData.x, pigEnemiesData.y, pigEnemiesData.img);
      } while (this.collisionDetector.detectCollision(player, newEnemy));

      this.pigEnemies.push(newEnemy);
    }

  }

  generateChaser() {
    this.chaser = [];

    const isLevel3 = this.getCurrentLevelId && this.getCurrentLevelId() === 3;

    if (isLevel3) {
      window.chaserFrames = window.chaserFramesL3;
    } else {
      window.chaserFrames = window.chaserFramesDefault;
    }

    this.chaser.push(new Chaser(600, 300));
  }

  //generateShooter() {
  //  this.shooter = [];
  //  this.shooter.push(new Shooter(400, 300));
  //}

  generateShooter() {   // type = 2 的普通 shooter 关
    this.shooter = [];

    const isLevel3 = this.getCurrentLevelId && this.getCurrentLevelId() === 3;

    if (isLevel3) {
      window.shooterFrames = window.shooterFramesL3;
    } else {
      window.shooterFrames = window.shooterFramesDefault;
    }

    //this.shooter.push(new ShooterFourDir(400, 300));
    this.shooter.push(new ShooterFourDir(400, 300, this.collisionDetector));
  }

  generateFinalBossRoom() {
    this.chaser = [];
    this.shooter = [];

    window.chaserFrames = window.chaserFramesL3;
    window.shooterFrames = window.shooterFramesL3;

    // Shooter 和 Chaser 的 sprite 高度是 heightInPixel / 4
    const entitySize = heightInPixel / 4;

    // 固定 shooter 位置（画布中央偏右）
    const shooterX = widthInPixel * 0.6;
    const shooterY = heightInPixel * 0.5;
    ///this.shooter.push(new Shooter(shooterX, shooterY));
    //this.shooter.push(new ShooterEightDir(shooterX, shooterY));
    this.shooter.push(new ShooterEightDir(shooterX, shooterY, this.collisionDetector));


    // ✅ 固定 chaser 位置（右上和右下）
    this.chaser.push(new Chaser(widthInPixel * 0.75, heightInPixel * 0.3));
    this.chaser.push(new Chaser(widthInPixel * 0.75, heightInPixel * 0.7));
  }


  updateEnemies() {
    this.enemies.forEach(e => {
      if (e.hp <= 0) enemyDeathSound.play();
      else if (!this.collisionDetector.isHitBoundary(e)) e.update();
      else {
        // Add some randomness to prevent perfect oscillation
        const direction = p5.Vector.mult(e.velocity.copy(), -1);
        const randomness = p5.Vector.random2D().mult(0.2);
        direction.add(randomness).normalize();
        e.velocity = direction.mult(e.velocity.mag());
        e.position.add(direction);
      }
    });
    this.enemies = this.enemies.filter(e => e.hp > 0);
  }

  updatePigEnemies() {
    this.pigEnemies.forEach(e => {
      if (e.hp <= 0) enemyDeathSound.play();
      else if (!this.collisionDetector.isHitBoundary(e)) e.update();
      else {
        // Add some randomness to prevent perfect oscillation
        const direction = p5.Vector.mult(e.velocity.copy(), -1);
        const randomness = p5.Vector.random2D().mult(0.2);
        direction.add(randomness).normalize();
        e.velocity = direction.mult(e.velocity.mag());
        e.position.add(direction);
      }
    });
    this.pigEnemies = this.pigEnemies.filter(e => e.hp > 0);

  }

  updateChaser() {
    // 添加互相推开逻辑
    for (let i = 0; i < this.chaser.length; i++) {
      for (let j = i + 1; j < this.chaser.length; j++) {
        const c1 = this.chaser[i];
        const c2 = this.chaser[j];
        const dist = p5.Vector.dist(c1.position, c2.position);

        if (dist < 60) { // 设置最小间距
          const repel = p5.Vector.sub(c1.position, c2.position).normalize().mult(1.5);
          c1.position.add(repel);
          c2.position.sub(repel);
        }
      }
    }

    // 更新 + 子弹检测
    this.chaser.forEach(c => {
      c.update();
      c.detectBulletCollision(player.bullets);
    });
    this.chaser = this.chaser.filter(c => !c.shouldBeRemoved());
  }


  updateShooter() {
    this.shooter.forEach(s => {
      s.update();
      s.detectBulletCollision(player.bullets);
      //s.detectPlayerCollision();
    });
    this.shooter = this.shooter.filter(s => this.#shouldDropItemAndRemove(s));
  }

  #shouldDropItemAndRemove(bossObj) {
    if (bossObj.shouldBeRemoved()) {
      const pos = bossObj.getPosition();
      const size = bossObj.getSize();
      // Compute the middle position
      const itemX = pos.x + size.x / 2;
      const itemY = pos.y + size.y / 2;
      const bossBtm = pos.y + size.y;
      // Drop the item
      this.#dropItemFromBossType(bossObj, itemX, itemY, bossBtm);
      return false;
    }
    return true;
  }

  #dropItemFromBossType(bossObj, itemX, itemY, bossBtm) {
    if (bossObj instanceof ShooterFourDir) {
      const itemType = Math.random() < 0.5 ? "health" : "powerup";
      this.#items.push(new Item(itemX, itemY, bossBtm, itemType));
    } else if (bossObj instanceof ShooterEightDir) {
      this.#items.push(new Item(itemX, itemY, bossBtm, "photo"));
    }
  }

  updateAfterClear() {
    if (this.checkClearCondition()) {
      this.door.open();
      if (this.#clearTime === null) this.#clearTime = millis();
    }
    else this.door.close();
    this.door.display();
  }

  checkClearCondition() {
    const noEnemies = this.enemies.length === 0;
    const noChaser = this.chaser.length === 0;
    const noShooter = this.shooter.length === 0;
    const photoInRoom = this.#items.some(i => i.getType() === "photo");

    return noEnemies && noChaser && noShooter && !photoInRoom && player.hp > 0;
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
    const y = topBoundary + player.size.y + heightInPixel / 3 + 70;
    newObstacle = new Obstacle(x, y, obsData.img);
    this.obstacles.push(newObstacle);
  }

  #setGameTime(currentRoomId) {
    if (currentRoomId === 0) startTime = millis();
    if (currentRoomId === 1) startTime = millis();
  }

}
