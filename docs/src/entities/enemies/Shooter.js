class Shooter {
  #shakeIntensity;
  #isDead;

  constructor(x, y) {
    this.position = createVector(x, y);
    this.size = createVector(heightInPixel / 4, heightInPixel / 4);
    this.maxHp = 800;
    this.hp = this.maxHp;
    this.isHurt = false;
    this.hitFrame = 0;
    this.speed = 0.8;
    this.moveCooldown = 60;
    this.currentMoveCooldown = 0;
    this.direction = p5.Vector.random2D().mult(this.speed);
    this.shootCooldown = 280;
    this.currentShootCooldown = this.shootCooldown;
    this.bullets = [];
    this.warningTime = 0;
    this.warningDuration = 60;
    this.#shakeIntensity = 0;
    this.#isDead = false;

    // Shooter Boss 动画相关
    this.frames = window.shooterFrames;
    this.currentFrame = 0;
    this.frameCounter = 0;
    this.frameDelay = 10; // 随意设置轮播速度
  }

  update() {
    if (this.hp <= 0) return;

    // 动画切换逻辑
    this.frameCounter++;
    if (this.frameCounter >= this.frameDelay) {
      this.frameCounter = 0;
      this.currentFrame = (this.currentFrame + 1) % this.frames.length;
    }

    if (this.currentMoveCooldown <= 0) {
      this.direction = p5.Vector.random2D().mult(this.speed);
      this.currentMoveCooldown = this.moveCooldown;
    } else {
      this.currentMoveCooldown--;
    }

    this.position.add(this.direction);
    this.checkBoundaryCollision();

    if (this.warningTime > 0) {
      this.warningTime--;
    }

    if (this.currentShootCooldown <= this.warningDuration) {
      this.warningTime = this.warningDuration;
    }

    if (this.currentShootCooldown <= 0) {
      this.warningTime = 60;
      this.shoot();
      this.currentShootCooldown = this.shootCooldown;
    } else {
      this.currentShootCooldown--;
    }

    this.bullets.forEach(bullet => bullet.update());
    this.detectPlayerCollision();
    this.bullets = this.bullets.filter(bullet => !this.isBulletOutOfBounds(bullet));
    this.checkPlayerCollisionDirect();
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
          3,
          BossBulletImgL3
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
    if (this.hp <= 0) this.#markAsDead();
  }

  #markAsDead() {
    if (this.#isDead) return;
    this.#isDead = true;
    this.#shakeIntensity = 30;

    // ★ 播放死亡音效
    if (bossDeathSound) {
      bossDeathSound.currentTime = 0;  // 从头播
      bossDeathSound.play();
      }
  }

  // Remove boss after the animation
  shouldBeRemoved() {
    if (this.#isDead && this.#shakeIntensity <= 0) {
      // bossDeathSound.play();
      return true;
    }
    return false;
  }

  detectBulletCollision(bulletArr) {
    bulletArr.forEach((bulletObj, bulletIndex) => {
      if (this.checkBulletCollision(bulletObj)) {
        this.takeDamage(bulletObj.damage);
        this.isHurt = true;
        bulletArr[bulletIndex].markAsHit(!this.#isDead);
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
    if (this.#isDead) return;
    this.bullets = this.bullets.filter(bullet => {
      if (this.checkPlayerCollision(bullet)) {
        player.updateHp(-bullet.damage, 90);
        return false;
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
      const pushDir = p5.Vector.sub(p.position.copy().add(p.size.x / 2, p.size.y / 2),
                                    s.position.copy().add(s.size.x / 2, s.size.y / 2))
                             .normalize().mult(5);

      p.position.add(pushDir);
      p.position.x = constrain(p.position.x, leftBoundary, rightBoundary - p.size.x);
      p.position.y = constrain(p.position.y, topBoundary, bottomBoundary - p.size.y);

      player.updateHp(-1, 90);
    }
  }

  display() {
    if (this.hp <= 0) return;

    // 动画显示
    const img = this.frames[this.currentFrame];
    image(img, this.position.x, this.position.y, this.size.x, this.size.y);

    this.bullets.forEach(bullet => bullet.display());

    if (this.warningTime > 0) {
      this.displayWarningEffect();
    }
  }

  display() {
    // 播放当前动画帧
    const img = this.frames[this.currentFrame];
    if (this.#isDead) {
      this.#displayDeadBoss(img);
      return;
    }

    image(img, this.position.x, this.position.y, this.size.x, this.size.y);
    this.bullets.forEach(bullet => bullet.display());
    if (this.warningTime > 0) {
      this.displayWarningEffect();
    }
  }

  #displayDeadBoss(img) {
    // Compute random shaking displacement
    let shakeX = random(-this.#shakeIntensity, this.#shakeIntensity);
    let shakeY = random(-this.#shakeIntensity, this.#shakeIntensity);
    
    // Draw the enemy with shaking effects
    if (this.#shakeIntensity % 5 >= 2) {
      image(img, this.position.x + shakeX, this.position.y + shakeY, this.size.x, this.size.y);
    }

    // Decrease intensity
    this.#shakeIntensity -= 0.4;
  }

  displayWarningEffect() {
    push();
    noFill();
    stroke(255, 255, 0);
    strokeWeight(4);
    ellipse(this.position.x + this.size.x / 2, this.position.y + this.size.y / 2, this.size.x * 1.5, this.size.y * 1.5);
    pop();
  }

  applyHitEffect(flashFrame) {
    if (this.isHurt && this.hitFrame < flashFrame) {
      const flashIntensity = this.hitFrame % 3;
      tint(255, 100, 100, flashIntensity * 255);
      this.hitFrame++;
    } else {
      this.isHurt = false;
      this.hitFrame = 0;
      noTint();
    }
  }

  getPosition() {
    return this.position.copy();
  }

  getSize() {
    return this.size.copy();
  }
}

// 在 Shooter.js 文件末尾添加：

// 四方向发射子弹的 Shooter
class ShooterFourDir extends Shooter {
  shoot() {
    shooterFireSound.play();

    // 只要上下左右四个方向
    const directions = [
      createVector(1, 0),
      createVector(-1, 0),
      createVector(0, 1),
      createVector(0, -1)
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
          3,
          BossBulletImgL2
        );
        this.bullets.push(bullet);
      }
    });
  }
}

// 八方向发射子弹的 Shooter（可选，若想显式区分）
class ShooterEightDir extends Shooter {
  // 不重写 shoot() 也可以直接继承父类的八方向逻辑
  // 如果你想在这里写得更清晰，也可以复制父类 shoot() 的内容：
  shoot() {
    shooterFireSound.play();
    super.shoot();
  }
}
