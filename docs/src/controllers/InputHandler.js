class InputHandler {
  constructor(cooldownTime = 2000, bulletDmg = 50) {
    this.collisionDetector = new CollisionDetector();
    this.collisionCoolDownTime = cooldownTime;
    this.bulletDamage = bulletDmg;
    this.lastCollisionTime = millis();
  }
  
  update() {
    player.updateVelocity();
    player.updatePosition();
    const collideWithEnemies = this.collisionDetector.detectPlayerCollision(player, enemies);
    const collideWithObstacles = this.collisionDetector.detectPlayerCollision(player, obstacles);
    const playerHitBoundary = this.collisionDetector.hitBoundary(player);
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
    this.collisionDetector.detectBulletEnemyCollision(player.bullets, enemies);
    this.removeEnemies(enemies);
  }
  
  handlePlayerShooting() {
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
    player.updateHp(player.hp - 1);
    this.lastCollisionTime = millis();

    hurtSound.currentTime = 0;
    hurtSound.play();
  }
}