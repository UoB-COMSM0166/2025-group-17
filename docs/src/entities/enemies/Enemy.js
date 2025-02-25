const enemySize = 20;
const chaserSize = 30;
const shootSize = 25;

// class Enemy {
//   constructor(xPosition, yPosition, hp, speed, attack) {
//     this.xPos = xPosition;
//     this.yPos = yPosition;
//     this.hp = hp;
//     this.speed = speed;
//     this.atk = attack;
//   };

//   display() {
//     fill('green');
//     ellipse(this.xPos, this.yPos, enemySize);
//   };
// }

// Add from feature_enemies_lyz_before0225
class Enemy {
  constructor(x, y, hp) {
    this.xPos = x;
    this.yPos = y;
    this.hp = hp;
    this.size = (hp === 50 ? 10 : 40);
    this.dx = random([-1, 1]);
    this.dy = random([-1, 1]);
    this.speed = 1;
  }
  update() {
    this.xPos += this.dx * this.speed;
    this.yPos += this.dy * this.speed;
    if (this.xPos < 0 || this.xPos > width) this.dx *= -1;
    if (this.yPos < 0 || this.yPos > height) this.dy *= -1;
  }
  display() {
    fill(255, 0, 0);
    rect(this.xPos, this.yPos, this.size, this.size);
  }
}
// Add done.

class ChasingShooter extends Enemy {

}

class AtkType {
  
}

class ChasingType {

}
