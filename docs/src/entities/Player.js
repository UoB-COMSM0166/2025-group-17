class Player {
  #canShootAgain;
  #shootCoolDownDuration;

  constructor(x = leftBoundary, y = heightInPixel / 2) {
    console.log(`player x: ${x}`);
    this.position = createVector(x, y);
    this.maxHp = 5;
    this.hp = this.maxHp;
    this.speed = 3;
    this.maxSpeed = 5;
    this.acceleration = 5.0;
    this.friction = 0.85;
    this.velocity = createVector(0, 0);
    this.atk = 50;
    this.#canShootAgain = true;
    this.#shootCoolDownDuration = 600;
    // this.maxAtk = 100;

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
    this.lastHealTime = null;

    // 动画相关初始化
    this.animations = window.playerAnimations; // 从 preload.js 获取动画帧
    this.direction = 'down';                   // 初始朝向
    this.currentFrame = 0;                     // 当前帧索引
    this.frameCounter = 0;                     // 动画播放计数器
    this.frameDelay = 6;                       // 每几帧切换一次动画
  }

  updateHp(newHp, invincibleDuration = 60) {
    if (this.invincibleTimer > 0) return;

    this.hp = newHp;
    console.log("Player hp updated to", this.hp);

    if (this.hp <= 0) {
      deathSound.currentTime = 0;
      deathSound.play();
    }

    this.resetInvincibleTimer(invincibleDuration); // 用参数设定无敌时间
  }

  shoot(direction) {
    if (!this.#canShootAgain) return;

    const centerX = this.position.x + this.size.x / 2;
    const centerY = this.position.y + this.size.y / 2;
    this.bullets.push(new Bullet(centerX, centerY, direction, this.atk));
    this.#canShootAgain = false;
    setTimeout(() => { this.#canShootAgain = true; }, this.#shootCoolDownDuration);
    console.log("A bullet has been shot");

    shootSound.currentTime = 0;
    shootSound.play();
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
      let accelerationVector = p5.Vector.mult(input, this.acceleration * 0.1);
      this.velocity.add(accelerationVector);

      // ✅ 限制最大速度
      if (this.velocity.mag() > this.maxSpeed) {
        this.velocity.setMag(this.maxSpeed);
      }

      // 方向判定用于动画（优先水平）
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
    this.velocity.mult(this.friction);

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

  decreaseHp() {
    console.log('Player took damage!');
    if (this.hp > 0 && this.invincibleTimer === 0) {
      this.hp = max(0, this.hp - 1);
      this.resetInvincibleTimer();
    }
    if (this.hp === 0) {
      deathSound.currentTime = 0;
      deathSound.play();
    }
  }

  increaseHp() { this.hp = min(3, this.hp + 1); }

  healByTime(currentTime) {
    if (this.lastHealTime === null) this.lastHealTime = currentTime;
    if (this.hp !== 1 || (currentTime - this.lastHealTime) < 300000) return;
    console.log('Heal after 5 minutes...')
    this.increaseHp();
    this.lastHealTime = currentTime;
  }

  resetInvincibleTimer(duration = 60) {
    this.invincibleTimer = duration;
  }
}
