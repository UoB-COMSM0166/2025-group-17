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
  }

  display() {
    fill('red');
    ellipse(this.xPos, this.yPos, playerSize);
  };

  update() {
    if (keyIsDown(LEFT_ARROW)) {
      this.xPos -= this.speed;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      this.xPos += this.speed;
    }
    if (keyIsDown(UP_ARROW)) {
      this.yPos -= this.speed;
    }
    if (keyIsDown(DOWN_ARROW)) {
      this.yPos += this.speed;
    }
  };
}
