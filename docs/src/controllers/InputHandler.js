class InputHandler {
  constructor(roomObj, cooldownTime = 2000) {
    this.currentRoom = roomObj;
    this.collisionDetector = new CollisionDetector();
    this.collisionCoolDownTime = cooldownTime;
    this.lastCollisionTime = millis();
  }

  update() {
    this.currentRoom.update();
    player.updateVelocity();
    player.updatePosition();
    player.updateBlinking(); // The player will blink for 2 seconds after being hit.
    const collideWithEnemies = this.collisionDetector.detectPlayerCollision(player, this.currentRoom.enemies);
    const collideWithObstacles = this.collisionDetector.detectPlayerCollision(player, this.currentRoom.obstacles);
    const playerHitBoundary = this.collisionDetector.isHitBoundary(player);
    if (collideWithEnemies || collideWithObstacles || playerHitBoundary) {
      player.revertPosition();
    }
    if (collideWithEnemies) {
      this.decreasePlayerHp();

    };
    player.resetVelocity();

    // // laser
    // const direction = key.toLowerCase();
    // if (direction === 'w' || direction === 'a' || direction === 's' || direction === 'd') {
    //   player.shoot(direction);
    // }
    this.updateBullets();
    this.collisionDetector.detectBulletEnemyCollision(player.bullets, this.currentRoom.enemies);
    this.collisionDetector.detectBulletObstacleCollision(player.bullets, this.currentRoom.obstacles);
    this.removeEnemies(this.currentRoom.enemies);
    this.moveToNextRoom();
  }

  handlePlayerShooting() {
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
      player.shoot(direction);
    }
  }

  updateBullets() {
    player.bullets.forEach(b => {
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

  decreasePlayerHp() {
    // The player will not receive any damage in the future 2 seconds.
    if (millis() - this.lastCollisionTime < this.collisionCoolDownTime) {
      return;
    }

    player.updateBlinking(); // The player will blink for 2 seconds after being hit.
    player.updateHp(player.hp - 1);
    this.lastCollisionTime = millis();


    hurtSound.currentTime = 0;
    hurtSound.play();
  }

  moveToNextRoom(tolerance = player.size.x) {
    if (!this.currentRoom.checkClearCondition()) return;

    const playerMidX = player.position.x + player.size.x / 2;
    const playerMidY = player.position.y + player.size.y / 2;
    const doorX = this.currentRoom.door.position.x;
    const doorY = this.currentRoom.door.position.y + this.currentRoom.door.size.y / 2;

    if (dist(playerMidX, playerMidY, doorX, doorY) < tolerance) {
      console.log("Move to the next room!");
      loadRoom();
    }
  }
}