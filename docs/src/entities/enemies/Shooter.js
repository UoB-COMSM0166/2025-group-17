class Shooter {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.size = createVector(heightInPixel / 4, heightInPixel / 4);
    this.hp = 800;
    this.speed = 0.8;
    this.moveCooldown = 60;
    this.currentMoveCooldown = 0;
    this.direction = p5.Vector.random2D().mult(this.speed);
    this.shootCooldown = 280;
    this.currentShootCooldown = this.shootCooldown;
    this.bullets = [];
    this.image = shooterImage; // 你需要在 preload 中加载这个图片
    this.warningTime = 0; // 添加一个警告计时器
    this.warningDuration = 60; // 设置警告持续的时间，比如 60 帧 = 1秒
  }

  update() {
    if (this.hp <= 0) return;

    if (this.currentMoveCooldown <= 0) {
      this.direction = p5.Vector.random2D().mult(this.speed);
      this.currentMoveCooldown = this.moveCooldown;
    } else {
      this.currentMoveCooldown--;
    }

    this.position.add(this.direction);
    this.checkBoundaryCollision();

    if (this.warningTime > 0) {
      this.warningTime--; // 显示特效的时间减少
    }

     // 发射子弹前几秒触发警告
     if (this.currentShootCooldown <= this.warningDuration) {
      this.warningTime = this.warningDuration; // 在发射前几秒显示警告
     }

    if (this.currentShootCooldown <= 0) {
      this.warningTime = 60; // 在发射前触发警告效果，60帧后显示
      this.shoot();
      this.currentShootCooldown = this.shootCooldown;
    } else {
      this.currentShootCooldown--;
    }

    this.bullets.forEach(bullet => bullet.update());
    this.detectPlayerCollision();
    this.bullets = this.bullets.filter(bullet => !this.isBulletOutOfBounds(bullet));
    this.checkPlayerCollisionDirect(); // ✅ 添加与玩家物理碰撞检测
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
    const directions = [
      createVector(1, 0), createVector(-1, 0),
      createVector(0, 1), createVector(0, -1),
      createVector(1, 1), createVector(-1, -1),
      createVector(1, -1), createVector(-1, 1)
    ];

    const bulletsPerDirection = 5;
    const spacing = 40;

    directions.forEach(dir => {
      dir.normalize();
      for (let i = 0; i < bulletsPerDirection; i++) {
        const offset = p5.Vector.mult(dir, i * spacing);
        const bullet = new ShooterBullet(
          this.position.x + this.size.x / 2 + offset.x,
          this.position.y + this.size.y / 2 + offset.y,
          dir.copy(),
          1,
          3
        );
        this.bullets.push(bullet);
      }
    });
  }

  isBulletOutOfBounds(bullet) {
    return (
      bullet.position.x < leftBoundary ||
      bullet.position.x > rightBoundary ||
      bullet.position.y < topBoundary ||
      bullet.position.y > bottomBoundary
    );
  }

  takeDamage(damage) {
    this.hp = max(0, this.hp - damage);
    hitSound.currentTime = 0;
    hitSound.play();
    if (this.hp === 0) {
      deathSound.currentTime = 0;
      deathSound.play();
    }
  }

  detectBulletCollision(bullets) {
    bullets.forEach((bullet, index) => {
      if (this.checkBulletCollision(bullet)) {
        this.takeDamage(bullet.damage);
        bullets.splice(index, 1);
      }
    });
  }

  checkBulletCollision(bullet) {
    return (
      bullet.position.x < this.position.x + this.size.x &&
      bullet.position.x + bullet.size.x > this.position.x &&
      bullet.position.y < this.position.y + this.size.y &&
      bullet.position.y + bullet.size.y > this.position.y
    );
  }
 
  detectPlayerCollision() {
    this.bullets = this.bullets.filter(bullet => {
      if (this.checkPlayerCollision(bullet)) {
        //player.updateHp(player.hp - bullet.damage); // ✅ 用子弹真实伤害
        player.updateHp(player.hp - bullet.damage, 90); // ✅ 被 shooter 击中后 90 帧无敌
        return false; // 碰撞后移除子弹
      }
      return true;
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

  checkPlayerCollisionDirect() {
    const p = player;
    const s = this;
  
    const collided =
      p.position.x < s.position.x + s.size.x &&
      p.position.x + p.size.x > s.position.x &&
      p.position.y < s.position.y + s.size.y &&
      p.position.y + p.size.y > s.position.y;
  
    if (collided) {
      // 计算玩家和 shooter 之间的偏移方向
      const pushDir = p5.Vector.sub(p.position.copy().add(p.size.x / 2, p.size.y / 2), 
                                    s.position.copy().add(s.size.x / 2, s.size.y / 2))
                             .normalize().mult(5);  // 稍微推开玩家
  
      // 让玩家稍微偏移，避免卡住
      p.position.add(pushDir);
  
      // 限制玩家位置，防止其超出边界
      p.position.x = constrain(p.position.x, leftBoundary, rightBoundary - p.size.x);
      p.position.y = constrain(p.position.y, topBoundary, bottomBoundary - p.size.y);
  
      // 造成一次伤害（带无敌时间）
      if (player.invincibleTimer <= 0) {
        player.updateHp(player.hp - 1, 90); // 扣1血 + 无敌90帧
      }
    }
  }
  
  
  
  display() {
    if (this.hp <= 0) return;
    fill('blue');
    //rect(this.position.x, this.position.y, this.size.x, this.size.y);
    image(this.image, this.position.x, this.position.y, this.size.x, this.size.y);
    this.bullets.forEach(bullet => bullet.display());

    // 如果有警告时间，显示特效
    if (this.warningTime > 0) {
      this.displayWarningEffect();
    }
  }

  // 显示警告特效
  displayWarningEffect() {
    push();
    noFill();
    stroke(255, 255, 0); // 黄色的警告
    strokeWeight(4);
    ellipse(this.position.x + this.size.x / 2, this.position.y + this.size.y / 2, this.size.x * 1.5, this.size.y * 1.5);
    pop();
  
  }
}
