class CollisionDetector {
  detectPlayerCollision(playerObj, objArray) {
    // Check the collision between the player and other objects. If there is a collision, 
    // the player bounces back.
    return objArray.some(obj => this.detectCollision(playerObj, obj));
  }
 
  detectBulletEnemyCollision(bulletArray, enemyArray) {
    // Check the collision between bullets and enemies. If there is a collision, 
    // the bullet vanishes and causes damage to the enemy.
    enemyArray.forEach((enemyObj, enemyIndex) => {
      bulletArray.forEach((bulletObj, bulletIndex) => {
        if (this.detectCollision(bulletObj, enemyObj)) {
          enemyArray[enemyIndex].hp = max(0, enemyObj.hp - bulletObj.damage);
          bulletArray.splice(bulletIndex, 1);
        }
      });
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

  hitBoundary(obj) {
    let x = obj.position.x + obj.velocity.x;
    let y = obj.position.y + obj.velocity.y;
    return x < 0 || x > width - obj.size.x || y < 0 || y > height - obj.size.y;
  }
}

