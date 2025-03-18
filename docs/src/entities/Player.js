class Player {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.hp = defaultHp;
    this.speed = defaultSpeed;
    this.maxSpeed = playerMaxSpeed;
    this.acceleration = defaultAcceleration;
    this.friction = defaultFriction;
    this.velocity = createVector(0, 0);
    this.atk = defaultAtk;
    this.maxAtk = playerMaxAtk;
    this.size = createVector(heightInPixel / 8, heightInPixel / 8);
    this.invincibleTimer = 0;   // Frames remaining for invincibility
    this.blinkCounter = 0;      // Used for blinking during invincibility
    this.bullets = [];
    this.image = playerImage;
  }

  shoot(direction) {
    bullets.push(new Bullet(this.position.x, this.position.y, direction));

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
    image(this.image, this.position.x, this.position.y, this.size.x, this.size.y);
  };

  updateVelocity() {
    //let moving = false; //记录玩家是否在移动
    let input = createVector(0, 0);
    let desiredVel = createVector(0, 0);
    if (keyIsDown(LEFT_ARROW)) {
      input.x = -1;
      // moving = true;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      input.x = 1;
      //  moving = true;
    }
    if (keyIsDown(UP_ARROW)) {
      input.y = -1;
      //  moving = true;
    }
    if (keyIsDown(DOWN_ARROW)) {
      input.y = 1;
      //  moving = true;
    }
    /**way one **/
    // input.normalize().mult(this.acceleration);
    // this.velocity.add(input);
    // this.velocity.mult(this.friction);

    /**way two**/
    if (input.mag() > 0) {
      input.normalize();
      desiredVel = p5.Vector.mult(input, this.speed);
    }
    // Smoothly update velocity
    this.velocity.lerp(desiredVel, 0.8);
    // If no input, apply friction
    if (input.mag() === 0) {
      this.velocity.mult(this.friction);
    }


    // if (keyIsDown(LEFT_ARROW)) {
    //   this.velocity.x -= this.speed;
    //   moving = true;
    // }
    // if (keyIsDown(RIGHT_ARROW)) {
    //   this.velocity.x += this.speed;
    //   moving = true;
    // }
    // if (keyIsDown(UP_ARROW)) {
    //   this.velocity.y -= this.speed;
    //   moving = true;
    // }
    // if (keyIsDown(DOWN_ARROW)) {
    //   this.velocity.y += this.speed;
    //   moving = true;
    // }

  }

  resetVelocity() {
    this.velocity.x = 0;
    this.velocity.y = 0;
  }

  updatePosition() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  };

  revertPosition() {
    this.position.x -= this.velocity.x;
    this.position.y -= this.velocity.y;
  };

  updateHp(newHp) {
    if (this.hp > 0 && this.invincibleTimer === 0) {
      this.hp = max(0, newHp);
      // this.invincibleTimer = 60; // Approximately one second at 60 fps.
      this.resetInvincibleTimer(); // Approximately one second at 60 fps.
    }
    if (this.hp === 0) {
      deathSound.currentTime = 0;
      deathSound.play();
    }
  }

  resetInvincibleTimer() { this.invincibleTimer = 60; }

  shoot(direction) {
    this.bullets.push(new Bullet(this.position.x, this.position.y, direction, this.atk));
    console.log("A bullet has been shot");

    shootSound.currentTime = 0;
    shootSound.play();
  }


  // resetStatus() {
  //   this.position.set(playerX, playerY); // 重置到初始位置
  //   this.speed = defaultSpeed;          // 重置速度
  //   this.atk = defaultAtk;              // 重置攻击力
  //   this.bullets = [];                  // 清空子弹

  // }
}
