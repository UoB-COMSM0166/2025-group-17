class Player {
  #maxHp = 3;
  #baseAtk = 50;
  #atk = 50;
  #maxAtk = 100;
  #maxSpeed = 4;
  #acceleration = 3.0;
  #friction = 0.85;
  #bulletSize = 20;
  #maxBulletSize = 40;
  #canShootAgain = true;
  #shootCoolDownDuration = 300;

  constructor(x = leftBoundary, y = heightInPixel / 2) {
    this.position = createVector(x, y);
    this.hp = this.#maxHp;
    this.velocity = createVector(0, 0);

    // 判定框尺寸（红框用来检测碰撞）！！！
    this.size = createVector(36, 52);  // ← 可调整碰撞判定大小（原本是 heightInPixel / 7）

    //  图像显示尺寸（不会影响判定框）！！！
    this.displaySize = createVector(72, 72); // ← 建议大于判定框，让图像不被裁剪

    this.invincibleTimer = 0;   // Frames remaining for invincibility
    this.blinkCounter = 0;      // Used for blinking during invincibility
    this.invincibleTimer = 0;   // 剩余无敌帧数
    this.blinkCounter = 0;      // 用于无敌闪烁效果
    this.bullets = [];

    this.image = playerImage; // 初始静态图像
    // 动画相关初始化
    this.animations = window.playerAnimations; // 从 preload.js 获取动画帧
    this.direction = 'down';                   // 初始朝向
    this.currentFrame = 0;                     // 当前帧索引
    this.frameCounter = 0;                     // 动画播放计数器
    this.frameDelay = 6;                       // 每几帧切换一次动画
  }

  getAtk() { return this.#atk; }
  getBulletSize() { return this.#bulletSize; }
  getHp() { return this.hp; }
  getMaxHp() { return this.#maxHp; }
  setHp(newHp) { this.hp = newHp; }
  
  // Reset transient room state while preserving progression stats
  resetRoomState(newHp, x = leftBoundary, y = heightInPixel / 2) {
    this.hp = newHp;
    this.position = createVector(x, y);
    this.velocity = createVector(0, 0);
    this.invincibleTimer = 60; // Player becomes invincible when entering a room
    this.#canShootAgain = true;
    
    this.direction = 'down';
    this.currentFrame = 0;
    this.frameCounter = 0;
    this.frameDelay = 6; 
  }

  updateHp(valueToAdd, invincibleDuration = 60) {
    if (this.invincibleTimer > 0) return;
    const newHp = this.hp + valueToAdd;
    if (newHp < this.hp) hurtSound.play();

    this.hp = max(0, min(newHp, this.#maxHp));
    console.log("Player hp updated to", this.hp);

    if (this.hp <= 0) playerDeathSound.play();
    this.resetInvincibleTimer(invincibleDuration);
  }

  shoot(direction) {
    if (!this.#canShootAgain) return;
    const centerX = this.position.x + this.size.x / 2;
    const centerY = this.position.y + this.size.y / 2;
    const bulletImg = (this.#atk <= this.#baseAtk) ? bulletImage : powerUpBulletImage;
    this.bullets.push(new Bullet(centerX, centerY, direction, this.#atk, bulletImg, this.#bulletSize));
    this.#canShootAgain = false;
    setTimeout(() => { this.#canShootAgain = true; }, this.#shootCoolDownDuration);
    console.log("A bullet has been shot");
    shootSound.play();
  }

  powerUp() {
    const upRatio = 1.25;
    this.#atk = min(this.#atk * upRatio, this.#maxAtk);
    this.#bulletSize = min(this.#bulletSize * upRatio, this.#maxBulletSize);
    console.log(`Power Up activated! ATK: ${this.#atk}, Bullet size: ${this.#bulletSize}`);
  }

  updateBlinking() {
    if (this.invincibleTimer > 0) {
      this.invincibleTimer--;
      this.blinkCounter = (this.blinkCounter + 1) % 10;
    }
  }

  display() {
    // When invincible, skip drawing for half the blink cycle.
    if (this.invincibleTimer > 0 && this.blinkCounter < 5) return;

    // ✅ 偏移显示图像，使图像居中对齐碰撞框
    const offsetX = (this.size.x - this.displaySize.x) / 2;
    const offsetY = (this.size.y - this.displaySize.y) / 2;

    image(
      this.image,
      this.position.x + offsetX,
      this.position.y + offsetY,
      this.displaySize.x,
      this.displaySize.y
    );
  }

  updateVelocity() {
    let input = createVector(0, 0);

    if (keyIsDown(LEFT_ARROW)) input.x = -1;
    if (keyIsDown(RIGHT_ARROW)) input.x = 1;
    if (keyIsDown(UP_ARROW)) input.y = -1;
    if (keyIsDown(DOWN_ARROW)) input.y = 1;

    // ✅ 立即响应速度，无 lerp（避免滑动穿墙）
    if (input.mag() > 0) {
      input.normalize();
      // ✅ 改为加速度推动速度，模拟惯性
      let accelerationVector = p5.Vector.mult(input, this.#acceleration * 0.1);
      this.velocity.add(accelerationVector);

      // ✅ 限制最大速度
      if (this.velocity.mag() > this.#maxSpeed) {
        this.velocity.setMag(this.#maxSpeed);
      }
      // ✅ 方向判定用于动画（优先水平）
      if (abs(input.x) > abs(input.y)) {
        this.direction = input.x > 0 ? 'right' : 'left';
      } else if (input.y !== 0) {
        this.direction = input.y > 0 ? 'down' : 'up';
      }
    } else {
      // ✅ 没有输入时应用摩擦力
      this.applyFriction();
    }


    // 动画帧切换逻辑
    if (this.velocity.mag() > 0.5) {
      this.frameCounter++;
      if (this.frameCounter >= this.frameDelay) {
        this.frameCounter = 0;
        this.currentFrame = (this.currentFrame + 1) % this.animations[this.direction].length;
      }
    } else {
      this.currentFrame = 0;
    }

    // 更新当前图像为对应方向动画帧
    this.image = this.animations[this.direction][this.currentFrame];
  }

  applyFriction() {
    this.velocity.mult(this.#friction);

    // ✅ 若速度足够小则强制归零（避免一直滑）
    if (this.velocity.mag() < 0.1) {
      this.velocity.set(0, 0);
    }
  }

  resetVelocity() {
    this.velocity.x = 0;
    this.velocity.y = 0;
  }

  updatePosition() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }

  revertPosition() {
    this.position.x -= this.velocity.x;
    this.position.y -= this.velocity.y;
  }

  resetInvincibleTimer(duration = 60) {
    this.invincibleTimer = duration;
  }
}
