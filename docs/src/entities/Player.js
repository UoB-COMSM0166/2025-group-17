class Player {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.hp = 3;
    this.maxHp = 3;
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
    this.invincibleTimer = 0;   // 剩余无敌帧数
    this.blinkCounter = 0;      // 用于无敌闪烁效果
    this.bullets = [];
    this.image = playerImage;
    this.lastHealTime = null;
  }



  //updateHp(newHp) {
  //  this.hp = newHp;
  //  console.log("Player hp updated to", this.hp);
  //}


   
  updateHp(newHp, invincibleDuration = 60) {
    if (this.invincibleTimer > 0) return;
  
    this.hp = newHp;
    console.log("Player hp updated to", this.hp);
  
    if (this.hp <= 0) {
      deathSound.currentTime = 0;
      deathSound.play();
    }
  
    this.resetInvincibleTimer(invincibleDuration); // ✅ 用参数设定无敌时间
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

  decreaseHp() {
    console.log('Player took damage!');
    if (this.hp > 0 && this.invincibleTimer === 0) {
      this.hp = max(0, this.hp - 1);
      this.resetInvincibleTimer(); // Approximately one second at 60 fps.
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
