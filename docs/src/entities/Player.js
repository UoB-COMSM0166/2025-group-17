const defaultSpeed = 5;
const defaultHp = 3;
const defaultAtk = 5;
const playerMaxHp = 5;
const playerMaxSpeed = 15;
const playerMaxAtk = 20;
const playerSize = { w: 20, h: 20 };

const playerX = 50;
const playerY = 50;

class Player {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.hp = defaultHp;
    this.speed = defaultSpeed;
    this.maxSpeed = playerMaxSpeed;
    this.velocity = createVector(0, 0);
    this.atk = defaultAtk;
    this.maxAtk = playerMaxAtk;
    this.size = createVector(playerSize.w, playerSize.h);
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
    if (keyIsDown(LEFT_ARROW)) {
      this.velocity.x -= this.speed;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      this.velocity.x += this.speed;
    }
    if (keyIsDown(UP_ARROW)) {
      this.velocity.y -= this.speed;
    }
    if (keyIsDown(DOWN_ARROW)) {
      this.velocity.y += this.speed;
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
  }

  shoot(direction) {
    this.bullets.push(new Bullet(this.position.x, this.position.y, direction));
    console.log("A bullet has been shot");
  }
}
