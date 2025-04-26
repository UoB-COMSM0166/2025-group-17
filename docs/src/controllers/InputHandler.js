class InputHandler {
  #currentRoom;
  constructor(roomObj, cooldownTime = 2000) {
    this.#currentRoom = roomObj;
    this.collisionDetector = new CollisionDetector();
    this.coolDownTime = cooldownTime;
    this.lastLoadTime = millis();
    this.lastCollisionTime = millis();
  }

  update(playerObj) {
    this.#currentRoom.update();
    this.#currentRoom.display(playerObj);
    playerObj.updateVelocity();

    // 预测下一步的位置
    const nextX = playerObj.position.x + playerObj.velocity.x;
    const nextY = playerObj.position.y + playerObj.velocity.y;

    // 构造临时对象用于碰撞判断（必须包含 velocity 否则报错）
    const tempPlayer = {
      position: createVector(nextX, nextY),
      size: playerObj.size,
      velocity: playerObj.velocity
    };

    // 使用预测位置检测碰撞
    const collideWithEnemies = this.collisionDetector.detectPlayerCollision(tempPlayer, this.#currentRoom.enemies);
    const collideWithObstacles = this.collisionDetector.detectPlayerCollision(tempPlayer, this.#currentRoom.obstacles);
    const playerHitBoundary = this.collisionDetector.isHitBoundary(tempPlayer);

    if (!collideWithEnemies && !collideWithObstacles && !playerHitBoundary) {
      playerObj.updatePosition();
    } else {
      playerObj.resetVelocity();

      // Player loses health when colliding with the enemies
      if (collideWithEnemies && playerObj.invincibleTimer <= 0) {
        playerObj.updateHp(playerObj.hp - 1, 90);
        hurtSound.currentTime = 0;
        hurtSound.play();
      }
    }

    this.collisionDetector.handleEnemyCollision(this.#currentRoom.enemies);
    this.collisionDetector.handleEnemyObstacleCollision(this.#currentRoom.enemies, this.#currentRoom.obstacles);

    this.updateBullets(playerObj);
    this.collisionDetector.detectBulletEnemyCollision(playerObj.bullets, this.#currentRoom.enemies);
    this.collisionDetector.detectBulletObstacleCollision(playerObj.bullets, this.#currentRoom.obstacles);
    this.removeEnemies(this.#currentRoom.enemies);
    this.#moveToNextRoom(playerObj);
  }

  handlePlayerShooting(playerObj) {
    // let shootDirection = createVector(0, 0);
    // if (keyIsDown(87)) shootDirection.y = -1; // W
    // if (keyIsDown(83)) shootDirection.y = 1; // S
    // if (keyIsDown(65)) shootDirection.x = -1; // A
    // if (keyIsDown(68)) shootDirection.x = 1; // D

    // if (shootDirection.mag() > 0) {
    //   shootDirection.normalize();
    //   if (shootCooldown <= 0) {
    //     playerObj.shoot(shootDirection);
    //     shootCooldown = 20; //reset cooldown (10 frames)
    //   }
    // }

    // if (shootCooldown > 0) {
    //   shootCooldown--;
    // }
    const direction = key.toLowerCase();
    if (direction === 'w' || direction === 'a' || direction === 's' || direction === 'd') {
      console.log("Bullet input detected!");
      playerObj.shoot(direction);
    }
  }

  updateBullets(playerObj) {
    playerObj.bullets.forEach((b, bIndex) => {
      b.update();
      if (b.shouldBeRemoved()) playerObj.bullets.splice(bIndex, 1);
      else b.display();
    });
  }

  removeEnemies(enemyArray) {
    enemyArray.forEach((enemyObj, enemyIndex) => {
      if (enemyObj.hp <= 0) {
        enemyArray.splice(enemyIndex, 1);
      }
    });
  }

  decreasePlayerHp(playerObj) {
    // The player will not receive any damage 2 seconds after loading or entering the new room.
    if (millis() - this.lastLoadTime < this.coolDownTime) return;

    // The player will not receive any damage 2 seconds after the collision.
    if (millis() - this.lastCollisionTime < this.coolDownTime) return;
    playerObj.updateBlinking(); // The player will blink for 2 seconds after being hit.
    playerObj.decreaseHp();
    this.lastCollisionTime = millis();

    hurtSound.currentTime = 0;
    hurtSound.play();
  }

  #moveToNextRoom(playerObj, tolerance = playerObj.size.x) {
    if (!this.#currentRoom.checkClearCondition()) return;

    const playerMidX = playerObj.position.x + playerObj.size.x / 2;
    const playerMidY = playerObj.position.y + playerObj.size.y / 2;
    const doorX = this.#currentRoom.door.position.x;
    const doorY = this.#currentRoom.door.position.y + this.#currentRoom.door.size.y / 2;

    if (dist(playerMidX, playerMidY, doorX, doorY) < tolerance) {
      console.log("Move to the next room!");
      this.lastLoadTime = millis();
      this.#loadRoom();
      playerObj.resetInvincibleTimer();
    }
  }

  #loadRoom() {
    if (this.isGameCompleted()) {
      console.log("Game Completed!");
      return;
    }
    // Keep play hp (need or not)
    // TODO: 在player类中设置resetStatus函数，在除了宝箱房外的房间内调用
    // Reset status of player (keep HP)
    // player.resetStatus()
    const prevHp = player.hp;

    const nextRoomId = this.#currentRoom.getCurrentRoomId() + 1;
    player = new Player();
    // Only reset player HP after the tutorial
    if (nextRoomId !== 1) player.hp = prevHp;
  
    // Load room
    if (nextRoomId === 1) {
      const randomRoomId = random([1, 2, 3, 4, 5, 6]);
      room.setup(roomData[randomRoomId]);
    } else if (nextRoomId === 2) {
      room.setup(roomData[8]);
    }
    else if (nextRoomId === 3) {
      room.setup(roomData[7]);
    } else if (nextRoomId === 4) {
      room.setup(roomData[9]);
    } else if (nextRoomId === 5) {
      room.setup(roomData[10]);
    }
  }

  getCurrentRoomId() { return this.#currentRoom.getCurrentRoomId(); }

  isGameCompleted() {
    console.log(`Current room: ${this.#currentRoom.getCurrentRoomId()}`);
    const maxCurrentRoomId = this.#getMaxCurrentRoomId(rawRoomData);
    
    if (this.#currentRoom.getCurrentRoomId() >= maxCurrentRoomId && this.#currentRoom.checkClearCondition()) {
      return true;
    }
    return false;
  }

  #getMaxCurrentRoomId(rawRoomData) {
    let maxRoomId = -Infinity;
    for (const room of rawRoomData.rooms) {
        if (room.currentRoomId > maxRoomId) {
            maxRoomId = room.currentRoomId;
        }
    }
    return maxRoomId;
  }
}
