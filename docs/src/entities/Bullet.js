class Bullet {
  constructor(x, y, direction, dmg, img = bulletImage, s = 20) {
    this.position = createVector(x, y);
    this.size = createVector(s, s);
    this.speed = 4;
    this.direction = direction; // Use a vector direction instead of a letter
    this.damage = dmg;
    this.image = img;

    this.initialAngle = random(TWO_PI); //赋予子弹随机初始角度
    this.spin = 0; //旋转增量
    this.rotationSpeed = random([-1, 1]) * random(3, 7)  // 每帧旋转 0.5 ~ 1 弧度

    this.isHit = false;
    this.hitFrame = 0;
    this.frames = window.hitEffectFrames;

    //添加子弹寿命
    this.life = 0;
    this.maxLife = 100;

    this.trail = [];          // 存放残影粒子
    this.trailMax = 15;       // 最多记录15个尾迹

  }

  update() {
    if (this.isHit) {
      this.hitFrame++;
      // ❗ 清空尾迹（子弹死亡时立即清除尾迹）
      if (this.isHit || this.life >= this.maxLife) {
        this.trail = [];  // ✅ 立即清空尾迹数组
      }
      return;
    }



    // Move the bullet along its direction
    //this.position.add(p5.Vector.mult(this.direction, this.speed));
    if (this.direction === 'w') this.position.y -= this.speed;
    if (this.direction === 'a') this.position.x -= this.speed;
    if (this.direction === 's') this.position.y += this.speed;
    if (this.direction === 'd') this.position.x += this.speed;

    //自转
    this.spin += this.rotationSpeed;

    //累积寿命
    this.life++;

    // ✅ 添加当前位置为残影
    this.trail.unshift({
      pos: this.position.copy(),
      age: 0
    });
    // 限制尾迹最大长度
    if (this.trail.length > this.trailMax) this.trail.pop();
    // 每帧增长年龄
    for (let t of this.trail) t.age++;
  }

  display() {
    push();
    imageMode(CENTER);
    noStroke();

    // ✅ 先绘制尾迹粒子
    for (let i = 0; i < this.trail.length; i++) {
      const t = this.trail[i];
      // ✅ 粒子透明度随 age 衰减
      const alpha = map(t.age, 0, this.trailMax, 200, 0);

      // ✅ 尺寸随 age 缩小，基础为子弹尺寸一半
      const baseSize = this.size.x * 0.5; // 🎯 基础是主子弹一半
      const shrink = map(t.age, 0, this.trailMax, 1.0, 0.3); // 衰减比例
      const flicker = map(sin(frameCount * 0.3 + i), -1, 1, 0.9, 1.1); // 微闪烁
      const radius = baseSize * shrink * flicker;
      fill(255, 255, 180, alpha);
      ellipse(t.pos.x, t.pos.y, radius, radius);
    }

    translate(this.position.x, this.position.y);
    rotate(this.initialAngle + this.spin); //✅ 每颗子弹有独立角度


    // Advance to next hit animation frame each 3 frame
    if (this.isHit) image(this.frames[Math.floor(this.hitFrame / 3)], 0, 0, 2.5 * this.size.x, 2.5 * this.size.y);
    else image(this.image, 0, 0, this.size.x, this.size.y);
    pop();
  }

  markAsHit(playSound = true) {
    if (this.isHit === true) return;
    this.isHit = true;

    // Omit further damage and hit sound
    if (playSound) hitSound.play();
    this.damage = 0;
  }

  // Let the bullet lasts for 30 frames
  shouldBeRemoved() { return this.hitFrame >= 30 || this.life >= this.maxLife; }
}
