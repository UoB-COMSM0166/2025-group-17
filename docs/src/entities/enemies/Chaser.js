class Chaser {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.size = createVector(heightInPixel / 4, heightInPixel / 4);
    this.maxHp = 800;
    this.hp = this.maxHp;
    this.isHurt = false;
    this.hitFrame = 0;
    this.speed = 1;
    this.dashSpeed = 10;
    this.chaseRange = 100;
    this.isDashing = false;
    this.dashCooldown = 100;
    this.currentCooldown = 0;
    this.dashDamageApplied = false;
    this.dashDuration = 10;
    this.currentDashTime = 0;

    // 替换为动画帧数组（来自 preload）
    this.frames = window.bossFrames;
    this.currentFrame = 0;
    this.frameCounter = 0;

    this.frameDelay = 12; // 控制动画播放速度：数值越大越慢（默认 12 帧换一张）例如设置为 20 就更慢，6 就更快
  }

  update() {
    // 动画更新：每 frameDelay 帧切换一张图
    this.frameCounter++;
    if (this.frameCounter >= this.frameDelay) {
      this.frameCounter = 0;
      this.currentFrame = (this.currentFrame + 1) % this.frames.length;
    }

    if (this.currentCooldown > 0) this.currentCooldown--;

    let distanceToPlayer = dist(
      this.position.x, this.position.y,
      player.position.x, player.position.y
    );

    if (this.isDashing) {
      this.position.add(this.dashDirection);
      this.currentDashTime++;

      if (this.checkPlayerCollision() && !this.dashDamageApplied) {
        this.applyDashDamage();
      }

      if (this.hitWall() || distanceToPlayer > player.size.x * 3 || this.currentDashTime >= this.dashDuration) {
        this.isDashing = false;
        this.currentCooldown = this.dashCooldown;
        this.dashDamageApplied = false;
        this.currentDashTime = 0;
      }

    } else {
      if (distanceToPlayer < this.chaseRange && this.currentCooldown === 0) {
        this.startDash();
      } else {
        this.chasePlayer();
      }
    }

    // 撞到玩家但不是dash
    if (!this.isDashing && this.checkPlayerCollision()) {
      const pushDir = p5.Vector.sub(player.position, this.position).normalize().mult(4);
      player.position.add(pushDir);
      player.position.x = constrain(player.position.x, leftBoundary, rightBoundary - player.size.x);
      player.position.y = constrain(player.position.y, topBoundary, bottomBoundary - player.size.y);
    }
  }

  applyDashDamage() {
    player.updateHp(player.hp - 1);
    hurtSound.currentTime = 0;
    hurtSound.play();
    this.dashDamageApplied = true;

    const pushDir = p5.Vector.sub(player.position, this.position).normalize().mult(20);
    player.position.add(pushDir);
    player.position.x = constrain(player.position.x, leftBoundary, rightBoundary - player.size.x);
    player.position.y = constrain(player.position.y, topBoundary, bottomBoundary - player.size.y);

    if (player.hp <= 0 && typeof menuDrawer !== 'undefined') {
      menuDrawer.showGameOverPage();
    }
  }

  chasePlayer() {
    let direction = createVector(
      player.position.x - this.position.x,
      player.position.y - this.position.y
    );
    direction.normalize().mult(this.speed);
    this.position.add(direction);
  }

  startDash() {
    this.isDashing = true;
    this.currentDashTime = 0;
    let direction = createVector(
      player.position.x - this.position.x,
      player.position.y - this.position.y
    );
    direction.normalize().mult(this.dashSpeed);
    this.dashDirection = direction;
    this.dashDamageApplied = false;
    this.applyDashDamage(); // 初始 dash 撞击立即扣血
  }

  hitWall() {
    return (
      this.position.x < leftBoundary ||
      this.position.x + this.size.x > rightBoundary ||
      this.position.y < topBoundary ||
      this.position.y + this.size.y > bottomBoundary
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
        this.isHurt = true;
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

  checkPlayerCollision() {
    return (
      this.position.x < player.position.x + player.size.x &&
      this.position.x + this.size.x > player.position.x &&
      this.position.y < player.position.y + player.size.y &&
      this.position.y + this.size.y > player.position.y
    );
  }

  display() {
    // if (this.hp <= 0) return;
    // 播放当前动画帧
    const img = this.frames[this.currentFrame];
    image(img, this.position.x, this.position.y, this.size.x, this.size.y);
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
}
