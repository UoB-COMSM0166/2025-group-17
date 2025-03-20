class Shooter {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.size = createVector(heightInPixel / 4, heightInPixel / 4);
    this.hp = 800;
    this.speed = 2;
    this.moveCooldown = 60; // 每 60 帧改变方向
    this.currentMoveCooldown = 0;
    this.direction = p5.Vector.random2D().mult(this.speed);
    this.shootCooldown = 180; // 每 180 帧（3 秒）发射一次子弹
    this.currentShootCooldown = 0;
    this.bullets = [];
  }

  update() {
    if (this.hp <= 0) return; // Boss 死亡后不更新
    
    // 移动逻辑
    if (this.currentMoveCooldown <= 0) {
      this.direction = p5.Vector.random2D().mult(this.speed);
      this.currentMoveCooldown = this.moveCooldown;
    } else {
      this.currentMoveCooldown--;
    }
    
    this.position.add(this.direction);
    this.checkBoundaryCollision();
    
    // 射击逻辑
    if (this.currentShootCooldown <= 0) {
      this.shoot();
      this.currentShootCooldown = this.shootCooldown;
    } else {
      this.currentShootCooldown--;
    }
    
    // 更新子弹
    this.bullets.forEach(bullet => bullet.update());
  }

  checkBoundaryCollision() {
    if (this.position.x < leftBoundary || this.position.x + this.size.x > rightBoundary) {
      this.direction.x *= -1;
    }
    if (this.position.y < topBoundary || this.position.y + this.size.y > bottomBoundary) {
      this.direction.y *= -1;
    }
  }

  shoot() {
    let directions = [
      createVector(1, 0), createVector(-1, 0),
      createVector(0, 1), createVector(0, -1),
      createVector(1, 1), createVector(-1, -1),
      createVector(1, -1), createVector(-1, 1)
    ];
    
    directions.forEach(dir => {
      dir.normalize();
      this.bullets.push(new Bullet(this.position.x, this.position.y, dir, 50));
    });
  }

  takeDamage(damage) {
    this.hp = max(0, this.hp - damage);
    if (this.hp === 0) {
      deathSound.currentTime = 0;
      deathSound.play();
    }
  }

  detectBulletCollision() {
    this.bullets.forEach((bullet, index) => {
      if (this.checkPlayerCollision(bullet)) {
        player.updateHp(player.hp - 50); // 造成伤害
        this.bullets.splice(index, 1);
      }
    });
  }

  checkPlayerCollision(bullet) {
    return (
      bullet.position.x < player.position.x + player.size.x &&
      bullet.position.x + bullet.size.x > player.position.x &&
      bullet.position.y < player.position.y + player.size.y &&
      bullet.position.y + bullet.size.y > player.position.y
    );
  }

  display() {
    if (this.hp <= 0) return; // Boss 死亡后不显示
    fill('blue');
    rect(this.position.x, this.position.y, this.size.x, this.size.y);
    this.bullets.forEach(bullet => bullet.display());
  }
}
