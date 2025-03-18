class CollisionDetector {
  detectPlayerCollision(playerObj, objArr) {
    // Check the collision between the player and other objects. If there is a collision, 
    // the player bounces back.
    // TODO: Update it once the attack method of the boss has been implemented.
    return objArr.some(obj => this.detectCollision(playerObj, obj));
  }
 
  detectBulletEnemyCollision(bulletArr, enemyArr) {
    // Check the collision between bullets and enemies. If there is a collision, 
    // the bullet vanishes and causes damage to the enemy.
    enemyArr.forEach((enemyObj, enemyIndex) => {
      bulletArr.forEach((bulletObj, bulletIndex) => {
        if (this.detectCollisionWithBullet(bulletObj, enemyObj)) {
          enemyArr[enemyIndex].hp = max(0, enemyObj.hp - bulletObj.damage);

          hitSound.currentTime=0; //music 让音效从头播放
          hitSound.play();

          if(enemyArr[enemyIndex].hp === 0){
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
      if (this.isBulletHitWall(bulletObj)) bulletArr.splice(bulletIndex, 1);
      else if (obstacleArr.some(obstacleObj => this.detectCollisionWithBullet(bulletObj, obstacleObj))) {
        hitSound.currentTime = 0;
        hitSound.play();
        bulletArr.splice(bulletIndex, 1);
      }
    });
  }
  
  detectCollision(objA, objB) {
    /*
    * Detects collision between two objects that's not a bullet.
    * The collision is determined using:
    * - The bottom 1/3 of the object's height.
    * - The central 1/2 of the object's width.
    */
    const boundsA = this.#computeCollisionArea(objA);
    const boundsB = this.#computeCollisionArea(objB);
    return this.#isOverlapping(boundsA, boundsB);
  }

  #computeCollisionArea(obj) {
    return {
        left: obj.position.x + (obj.size.x * 0.25), // Center 1/2 width
        right: obj.position.x + (obj.size.x * 0.75),
        top: obj.position.y + (obj.size.y * (2 / 3)), // Bottom 1/3 height
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
    const isCollided = bulletObj.position.x < objB.position.x + objB.size.x && 
    bulletObj.position.x + bulletObj.size.x > objB.position.x &&
    bulletObj.position.y < objB.position.y + objB.size.y &&
    bulletObj.position.y + bulletObj.size.y > objB.position.y;
    return isCollided;
  }

  isHitBoundary(obj) {
    let x = obj.position.x + obj.velocity.x;
    let y = obj.position.y + obj.velocity.y;
    return x < leftBoundary || x > rightBoundary - obj.size.x || y < topBoundary || y > bottomBoundary - obj.size.y;
  }

  isBulletHitWall(bulletObj) {
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

