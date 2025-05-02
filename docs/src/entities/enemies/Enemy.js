class Enemy {
  constructor(x, y, hp, enImage) {
    this.hp = hp;
    this.position = createVector(x, y);
    const smallEnemyHp = 50;
    const enemyWidth = (hp === smallEnemyHp) ? heightInPixel / 16 : heightInPixel / 12;
    const enemyHeight = Math.floor(enemyWidth * (enImage.height / enImage.width));
    this.size = createVector(enemyWidth, enemyHeight);
    console.log(`Enemy image size ${enImage.width}, ${enImage.height}`);
    console.log(`Enemy size ${this.size.x}, ${this.size.y}`);
    
    this.velocity = createVector(random([-1, 1]), random([-1, 1]));
    this.image = enImage;

    // 添加动画帧相关
    this.frames = window.enemyFrames || [enImage]; // 确保不报错
    console.log(`Enemy sprite size ${this.frames[0].width}, ${this.frames[0].height}`);
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

    // 每帧检查碰撞并造成伤害（替代 InputHandler 中统一处理）
    // this.checkPlayerCollisionAndDamage();
  }

  display() {
    // 播放当前帧
    const img = this.frames[this.currentFrame] || this.image;
    image(img, this.position.x, this.position.y, this.size.x, this.size.y);
  }

  collide(otherObj) {
    // Calculate direction away from collision
    const enemyCenter = p5.Vector.sub(this.position.copy(), this.size.copy().div(2));
    const otherObjCenter = p5.Vector.sub(otherObj.position.copy(), otherObj.size.copy().div(2))
    const direction = p5.Vector.sub(enemyCenter, otherObjCenter).normalize();
    
    // Add some randomness to prevent perfect oscillation
    const randomness = p5.Vector.random2D().mult(0.2);
    direction.add(randomness).normalize();

    this.velocity = direction.mult(this.velocity.mag());
    this.position.add(direction);
  }
}