class Player {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.hp = defaultHp;
    this.speed = defaultSpeed;
    this.maxSpeed = playerMaxSpeed;
    this.velocity = createVector(0, 0);
    this.atk = defaultAtk;
    this.maxAtk = playerMaxAtk;
    this.size = createVector(heightInPixel / 12, heightInPixel / 12);
    this.bullets = [];
  }

  shoot(direction) {
    bullets.push(new Bullet(this.position.x, this.position.y, direction));

  }

  display() {
    fill('red');
    rect(this.position.x, this.position.y, this.size.x, this.size.y);
  };

  updateVelocity() {
    let moving = false; //记录玩家是否在移动

    if (keyIsDown(LEFT_ARROW)) {
      this.velocity.x -= this.speed;
      moving = true;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      this.velocity.x += this.speed;
      moving = true;
    }
    if (keyIsDown(UP_ARROW)) {
      this.velocity.y -= this.speed;
      moving = true;
    }
    if (keyIsDown(DOWN_ARROW)) {
      this.velocity.y += this.speed;
      moving = true;
    }

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
    this.hp = max(0, newHp);

    if (this.hp === 0) {
      deathSound.currentTime = 0;
      deathSound.play();
    }
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
