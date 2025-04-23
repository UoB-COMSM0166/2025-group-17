class Enemy {
  /*
  constructor(x, y, hp) {
    this.hp = hp;
    this.position = createVector(x, y);
    this.size = createVector(
      hp === smallEnemyHp ? heightInPixel / 8 : largeEnemySize.w,
      hp === smallEnemyHp ? heightInPixel / 8 : largeEnemySize.h
    );
    this.velocity = createVector(random([-1, 1]), random([-1, 1]));
    this.image = enemyImage; // 默认图像（兼容旧逻辑）

    // 添加动画帧相关
    this.frames = window.enemyFrames || [enemyImage]; // 确保不报错
    this.currentFrame = 0;
    this.frameCounter = 0;
    this.frameDelay = 10; // 控制播放速度，越大越慢
  }
  */

  constructor(x, y, hp, enImage) {
    this.hp = hp;
    this.position = createVector(x, y);
    this.size = createVector(
      hp === smallEnemyHp ? heightInPixel / 8 : largeEnemySize.w,
      hp === smallEnemyHp ? heightInPixel / 8 : largeEnemySize.h
    );
    this.velocity = createVector(random([-1, 1]), random([-1, 1]));
    this.image = enImage;

    // 添加动画帧相关
    this.frames = window.enemyFrames || [enemyImage]; // 确保不报错
    this.currentFrame = 0;
    this.frameCounter = 0;
    this.frameDelay = 10; // 控制播放速度，越大越慢
  }

  update() {
    // 动画更新：每隔 frameDelay 帧切换一张图
    this.frameCounter++;
    if (this.frameCounter >= this.frameDelay) {
      this.frameCounter = 0;
      this.currentFrame = (this.currentFrame + 1) % this.frames.length;
    }

    // 保持原有运动逻辑不变
    this.position.add(this.velocity);
    if (this.position.x < leftBoundary || this.position.x > rightBoundary - this.size.x) {
      this.velocity.x *= -1;
    }
    if (this.position.y < topBoundary || this.position.y > bottomBoundary - this.size.y) {
      this.velocity.y *= -1;
    }

    // 每帧检查碰撞并造成伤害（替代 InputHandler 中统一处理）
    this.checkPlayerCollisionAndDamage();
  }

  display() {
    // 播放当前帧
    const img = this.frames[this.currentFrame] || this.image;
    image(img, this.position.x, this.position.y, this.size.x, this.size.y);
  }

  collide() {
    this.position.sub(this.velocity);
    this.velocity.mult(-1);
  }

  // 与玩家接触时造成伤害
  checkPlayerCollisionAndDamage() {
    const bounds = {
      left: this.position.x + this.size.x * 0.25,
      right: this.position.x + this.size.x * 0.75,
      top: this.position.y + this.size.y * (2 / 3),
      bottom: this.position.y + this.size.y
    };
  
    const playerBounds = {
      left: player.position.x,
      right: player.position.x + player.size.x,
      top: player.position.y,
      bottom: player.position.y + player.size.y
    };
  
    const collided = (
      bounds.left < playerBounds.right &&
      bounds.right > playerBounds.left &&
      bounds.top < playerBounds.bottom &&
      bounds.bottom > playerBounds.top
    );
  
    if (collided && player.invincibleTimer <= 0) {
      player.updateHp(player.hp - 1, 90); // 扣1血 + 无敌90帧
      hurtSound.currentTime = 0;
      hurtSound.play();
    }
  }
}