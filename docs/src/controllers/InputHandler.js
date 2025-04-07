class InputHandler {
  constructor(roomObj, cooldownTime = 2000) {
    this.currentRoom = roomObj;
    this.collisionDetector = new CollisionDetector();
    this.coolDownTime = cooldownTime;
    this.lastLoadTime = millis();
    this.lastCollisionTime = millis();
  }

  update(playerObj) {
    this.currentRoom.update();
    playerObj.updateVelocity();
    playerObj.updatePosition();
    playerObj.updateBlinking(); // The player will blink for 2 seconds after being hit.
    const collideWithEnemies = this.collisionDetector.detectPlayerCollision(playerObj, this.currentRoom.enemies);
    const collideWithObstacles = this.collisionDetector.detectPlayerCollision(playerObj, this.currentRoom.obstacles);
    const playerHitBoundary = this.collisionDetector.isHitBoundary(playerObj);
    if (collideWithEnemies || collideWithObstacles || playerHitBoundary) {
      playerObj.revertPosition();
    }
    if (collideWithEnemies) this.decreasePlayerHp(playerObj);
    playerObj.resetVelocity();

    this.collisionDetector.handleEnemyCollision(this.currentRoom.enemies);
    this.collisionDetector.handleEnemyObstacleCollision(this.currentRoom.enemies, this.currentRoom.obstacles);

    this.updateBullets(playerObj);
    this.collisionDetector.detectBulletEnemyCollision(playerObj.bullets, this.currentRoom.enemies);
    this.collisionDetector.detectBulletObstacleCollision(playerObj.bullets, this.currentRoom.obstacles);
    this.removeEnemies(this.currentRoom.enemies);
    this.moveToNextRoom(playerObj);
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
    //     player.shoot(shootDirection);
    //     shootCooldown = 20; //reset cooldown (10 frames)
    //   }
    // }

    // if (shootCooldown > 0) {
    //   shootCooldown--;
    // }
    const direction = key.toLowerCase();
    if (direction === 'w' || direction === 'a' || direction === 's' || direction === 'd') {
      console.log("Bullet input detected!")
      playerObj.shoot(direction);
    }
  }

  updateBullets(playerObj) {
    playerObj.bullets.forEach(b => {
      b.update();
      b.display();
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

  moveToNextRoom(playerObj, tolerance = playerObj.size.x) {
    if (!this.currentRoom.checkClearCondition()) return;

    const playerMidX = playerObj.position.x + playerObj.size.x / 2;
    const playerMidY = playerObj.position.y + playerObj.size.y / 2;
    const doorX = this.currentRoom.door.position.x;
    const doorY = this.currentRoom.door.position.y + this.currentRoom.door.size.y / 2;

    if (dist(playerMidX, playerMidY, doorX, doorY) < tolerance) {
      console.log("Move to the next room!");
      this.lastLoadTime = millis();
      loadRoom();
      playerObj.resetInvincibleTimer();
    }
  }
}