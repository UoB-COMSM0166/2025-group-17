class CollisionDetector {
  detectPlayerCollision(playerObj, objArr) {
    // Check the collision between the player and other objects. If there is a collision, 
    // the player bounces back.
    // TODO: Update it once the attack method of the boss has been implemented.
    return objArr.some(obj => this.detectCollision(playerObj, obj));
  }

  handleEnemyCollision(enemyArr) {
    for (let i = 0; i < enemyArr.length; i++) {
      for (let j = i + 1; j < enemyArr.length; j++) {
        if (this.detectCollision(enemyArr[i], enemyArr[j])) {
          enemyArr[i].collide(enemyArr[j]);
        }
      }
    }
  }

  handleEnemyObstacleCollision(enemyArr, obstacleArr) {
    enemyArr.forEach(enemy => {
      obstacleArr.forEach(obstacle => {
        if (this.detectCollision(enemy, obstacle)) {
          enemy.collide(obstacle);
        }
      });
    });
  }

  detectBulletEnemyCollision(bulletArr, enemyArr) {
    // Check the collision between bullets and enemies. If there is a collision, 
    // the bullet vanishes and causes damage to the enemy.
    enemyArr.forEach((enemyObj, enemyIndex) => {
      bulletArr.forEach((bulletObj, bulletIndex) => {
        if (this.detectCollisionWithBullet(bulletObj, enemyObj)) {
          enemyArr[enemyIndex].hp = max(0, enemyObj.hp - bulletObj.damage);

          hitSound.currentTime = 0;
          hitSound.play();

          if (enemyArr[enemyIndex].hp === 0) {
            deathSound.currentTime = 0;
            deathSound.play();
          }
          bulletArr.splice(bulletIndex, 1);
        }
      });
    });
  }

  detectBulletObstacleCollision(bulletArr, obstacleArr) {
    // Check the collision between bullets, walls and obstacles. If there is a collision, 
    // the bullet vanishes.
    bulletArr.forEach((bulletObj, bulletIndex) => {
      if (this.#isBulletHitWall(bulletObj)) {
        bulletArr.splice(bulletIndex, 1);
      } else if (obstacleArr.some(obstacleObj => this.detectCollisionWithBullet(bulletObj, obstacleObj))) {
        hitSound.currentTime = 0;
        hitSound.play();
        bulletArr.splice(bulletIndex, 1);
      }
    });
  }

  detectCollision(objA, objB) {
    /*
    * Detects collision between two objects that's not a bullet.
    * Now uses full rectangular area for accurate collision detection.
    */
    const boundsA = this.#computeCollisionArea(objA);
    const boundsB = this.#computeCollisionArea(objB);
    return this.#isOverlapping(boundsA, boundsB);
  }

  // 检测中间 & 底部
  #computeCollisionArea(obj) {
    return {
      // left: obj.position.x,
      // right: obj.position.x + obj.size.x,
      // top: obj.position.y,
      // bottom: obj.position.y + obj.size.y
      left: obj.position.x + obj.size.x * 0.25,
      right: obj.position.x + obj.size.x * 0.75,
      top: obj.position.y + obj.size.y * (2 / 3),
      bottom: obj.position.y + obj.size.y
    };
  }

  #isOverlapping(boundsA, boundsB) {
    return (
      boundsA.left < boundsB.right &&
      boundsA.right > boundsB.left &&
      boundsA.top < boundsB.bottom &&
      boundsA.bottom > boundsB.top
    );
  }

  detectCollisionWithBullet(bulletObj, objB) {
    // Detect the collision between bullet object and another.
    const isCollided =
      bulletObj.position.x < objB.position.x + objB.size.x &&
      bulletObj.position.x + bulletObj.size.x > objB.position.x &&
      bulletObj.position.y < objB.position.y + objB.size.y &&
      bulletObj.position.y + bulletObj.size.y > objB.position.y;
    return isCollided;
  }

  isHitBoundary(obj) {
    const bounds = this.#computeCollisionArea(obj);
    
    // Compute new position after moving
    const newLeft = bounds.left + obj.velocity.x;
    const newRight = bounds.right + obj.velocity.x;
    const newTop = bounds.top + obj.velocity.y;
    const newBottom = bounds.bottom + obj.velocity.y;

    // Check if it exceeds the boundary
    return (
      newLeft < leftBoundary ||
      newRight > rightBoundary ||
      newTop < topBoundary ||
      newBottom > bottomBoundary
    );
  }

  #isBulletHitWall(bulletObj) {
    const wallMarginX = boundaryInPixel.w / 3;
    const wallMarginY = boundaryInPixel.h / 3;
    const { x, y } = bulletObj.position;
    const { x: bulletWidth, y: bulletHeight } = bulletObj.size;

    return (
      x < leftBoundary - wallMarginX ||
      x > rightBoundary - bulletWidth + wallMarginX ||
      y < topBoundary - wallMarginY ||
      y > bottomBoundary - bulletHeight + wallMarginY
    );
  }
}
