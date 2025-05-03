class Bullet {
  constructor(x, y, direction, dmg, s = 20) {
    this.position = createVector(x, y);
    this.size = createVector(s, s);
    this.speed = 4;
    this.direction = direction; // Use a vector direction instead of a letter
    this.damage = dmg;
    this.image = bulletImage;

    this.initialAngle = random(TWO_PI); //赋予子弹随机初始角度
    this.spin = 0; //旋转增量
    this.rotationSpeed = random([-1, 1]) * random(3, 7)  // 每帧旋转 0.5 ~ 1 弧度

    this.isHit = false;
    this.hitFrame = 0;
    this.frames = window.hitEffectFrames;

    //添加子弹寿命
    this.life = 0;
    this.maxLife = 100;
  }

  update() {
    if (this.isHit) {
      this.hitFrame++;
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
  }

  display() {
    push();
    imageMode(CENTER);
    translate(this.position.x, this.position.y);
    rotate(this.initialAngle + this.spin); //✅ 每颗子弹有独立角度


    // Advance to next hit animation frame each 3 frame
    if (this.isHit) image(this.frames[Math.floor(this.hitFrame / 3)], 0, 0, 1.2 * this.size.x, 1.2 * this.size.y);
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
