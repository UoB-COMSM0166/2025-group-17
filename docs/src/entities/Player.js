const defaultSpeed = 5;
const defaultHp = 3;
const defaultAtk = 5;
const playerMaxHp = 5;
const playerMaxSpeed = 15;
const playerMaxAtk = 20;
const playerSize = 20;

class Player {
  constructor(xPosition, yPosition) {
    this.xPos = xPosition;
    this.yPos = yPosition;
    this.hp = defaultHp;
    this.speed = defaultSpeed;
    this.maxSpeed = playerMaxSpeed;
    this.atk = defaultAtk;
    this.maxAtk = playerMaxAtk;

    // Add from feature_enemies_lyz_before0225
    // For key-based displacement
    this.dx = 0;
    this.dy = 0;
    // Add done/
  }

  // Add from feature_enemies_lyz_before0225
  move(keyCode) {
    if (keyCode === UP_ARROW) this.dy = -this.speed;
    if (keyCode === DOWN_ARROW) this.dy = this.speed;
    if (keyCode === LEFT_ARROW) this.dx = -this.speed;
    if (keyCode === RIGHT_ARROW) this.dx = this.speed;
  }

  stop() {
    this.dx = 0;
    this.dy = 0;
  }

  shoot(direction) {
    // Shooting function to create bullet objects
    bullets.push(new Bullet(this.xPos, this.yPos, direction));
  }

  update() {
    // Here we can choose to use key detection (original logic) or update location based on dx, dy
    let newX = this.xPos + this.dx;
    let newY = this.yPos + this.dy;
    // Boundary and obstacle detection can be added (for example, call colliesWithObstacle)
    if (!this.collidesWithObstacle(newX, newY) && !this.hitsBoundary(newX, newY)) {
      this.xPos = newX;
      this.yPos = newY;
    }
  }

  collidesWithObstacle(x, y) {
    // 检查是否与任一障碍物碰撞（每个 Obstacle 应有 x、y 和尺寸信息）
    return obstacles.some(o => x > o.x && x < o.x + o.size && y > o.y && y < o.y + o.size);
  }

  hitsBoundary(x, y) {
    return x < 0 || x > width || y < 0 || y > height;
  }
  // Add done.


  display() {
    fill('red');
    ellipse(this.xPos, this.yPos, playerSize);
  };

  // update() {
  //   if (keyIsDown(LEFT_ARROW)) {
  //     this.xPos -= this.speed;
  //   }
  //   if (keyIsDown(RIGHT_ARROW)) {
  //     this.xPos += this.speed;
  //   }
  //   if (keyIsDown(UP_ARROW)) {
  //     this.yPos -= this.speed;
  //   }
  //   if (keyIsDown(DOWN_ARROW)) {
  //     this.yPos += this.speed;
  //   }
  // };
}
