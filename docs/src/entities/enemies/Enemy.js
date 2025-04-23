class Enemy {
  constructor(x, y, hp) {
    this.hp = hp;
    this.position = createVector(x, y);
    this.size = createVector(
      (heightInPixel / 6) * enemyImage.width / enemyImage.height,
      heightInPixel / 6
    );
    this.velocity = createVector(random([-1, 1]), random([-1, 1]));
    this.image = enemyImage; // 默认图像（兼容旧逻辑）

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
  }

  display() {
    // 播放当前帧
    const img = this.frames[this.currentFrame] || this.image;
    image(img, this.position.x, this.position.y, this.size.x, this.size.y);
  }

  collide(otherObj) {
    // Calculate direction away from collision
    const direction = p5.Vector.sub(this.position, otherObj.position).normalize();
    
    // Add some randomness to prevent perfect oscillation
    const randomness = p5.Vector.random2D().mult(0.1);
    direction.add(randomness).normalize();

    this.velocity = direction.mult(this.velocity.mag());
    this.position.add(direction);
  }
}
