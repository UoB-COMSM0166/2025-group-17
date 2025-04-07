class CollisionDetector {
  detectPlayerCollision(playerObj, objArr) {
    // Check the collision between the player and other objects. If there is a collision, 
    // the player bounces back.
    return objArr.some(obj => this.detectCollision(playerObj, obj));
  }
 
  detectBulletEnemyCollision(bulletArr, enemyArr) {
    // Check the collision between bullets and enemies. If there is a collision, 
    // the bullet vanishes and causes damage to the enemy.
    enemyArr.forEach((enemyObj, enemyIndex) => {
      bulletArr.forEach((bulletObj, bulletIndex) => {
        if (this.detectCollision(bulletObj, enemyObj)) {
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
      else if (obstacleArr.some(obstacleObj => this.detectCollision(bulletObj, obstacleObj))) {
        hitSound.currentTime = 0;
        hitSound.play();
        bulletArr.splice(bulletIndex, 1);
      }
    });
  }
  
  detectCollision(objA, objB) {
    // Detect the collision between two objects.
    const isCollided = objA.position.x < objB.position.x + objB.size.x && 
    objA.position.x + objA.size.x > objB.position.x &&
    objA.position.y < objB.position.y + objB.size.y &&
    objA.position.y + objA.size.y > objB.position.y;
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

module.exports = CollisionDetector;
