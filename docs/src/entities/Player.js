class Player {
  constructor(x, y) {
    // 逻辑属性
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
    this.invincibleTimer = 0;
    this.blinkCounter = 0;
    this.bullets = [];
    this.lastHealTime = null;

    // 动画属性（p5play Sprite）
    this.sprite = new Sprite(this.position.x, this.position.y, this.size.x, this.size.y);
    this.sprite.addAnimation('down', playerAnim.down);
    this.sprite.addAnimation('up', playerAnim.up);
    this.sprite.addAnimation('left', playerAnim.left);
    this.sprite.addAnimation('right', playerAnim.right);
    this.sprite.changeAnimation('down');
    this.facing = 'down';
    this.sprite.collider = 'none'; // 关闭默认碰撞体积
  }

  updateBlinking() {
    if (this.invincibleTimer > 0) {
      this.invincibleTimer--;
      this.blinkCounter = (this.blinkCounter + 1) % 10;
    }
  }

  display() {
    // 同步精灵位置和大小
    this.sprite.x = this.position.x;
    this.sprite.y = this.position.y;
    this.sprite.width = this.size.x;
    this.sprite.height = this.size.y;

    // 处理闪烁
    if (this.invincibleTimer > 0 && this.blinkCounter < 5) {
      this.sprite.visible = false;
    } else {
      this.sprite.visible = true;
    }
  }

  updateVelocity() {
    let input = createVector(0, 0);
    let desiredVel = createVector(0, 0);

    if (keyIsDown(LEFT_ARROW)) input.x = -1;
    if (keyIsDown(RIGHT_ARROW)) input.x = 1;
    if (keyIsDown(UP_ARROW)) input.y = -1;
    if (keyIsDown(DOWN_ARROW)) input.y = 1;

    if (input.mag() > 0) {
      input.normalize();
      desiredVel = p5.Vector.mult(input, this.speed);
    }

    this.velocity.lerp(desiredVel, 0.8);

    if (input.mag() === 0) {
      this.velocity.mult(this.friction);
      this.sprite.animation.stop(); // 停止动画
    } else {
      this.sprite.animation.play();
    
      // 根据移动方向选择动画，但不修改 this.facing
      let anim = this.sprite.animation.label;
    
      if (abs(input.x) > abs(input.y)) {
        anim = input.x > 0 ? 'right' : 'left';
      } else {
        anim = input.y > 0 ? 'down' : 'up';
      }
    
      this.sprite.changeAnimation(anim);
    }
  }

  updatePosition() {
    this.position.add(this.velocity);
  }

  resetVelocity() {
    this.velocity.set(0, 0);
  }

  revertPosition() {
    this.position.sub(this.velocity);
  }

  shoot(direction) {
    this.bullets.push(new Bullet(this.position.x, this.position.y, direction, this.atk));
    console.log("A bullet has been shot");
    shootSound.currentTime = 0;
    shootSound.play();
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

  increaseHp() {
    this.hp = min(3, this.hp + 1);
  }

  healByTime(currentTime) {
    if (this.lastHealTime === null) this.lastHealTime = currentTime;
    if (this.hp !== 1 || (currentTime - this.lastHealTime) < 300000) return;
    console.log('Heal after 5 minutes...');
    this.increaseHp();
    this.lastHealTime = currentTime;
  }

  resetInvincibleTimer() {
    this.invincibleTimer = 60;
  }

  destroy() {
    this.sprite.remove();
  }
  

  // resetStatus() {
  //   this.position.set(playerX, playerY); // 重置到初始位置
  //   this.speed = defaultSpeed;          // 重置速度
  //   this.atk = defaultAtk;              // 重置攻击力
  //   this.bullets = [];                  // 清空子弹

  // }
}
